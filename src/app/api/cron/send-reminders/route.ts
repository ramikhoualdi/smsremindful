import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase/admin'
import { sendSMS } from '@/lib/twilio/client'
import { createSMSLog } from '@/features/sms/server/sms-log-service'
import { interpolateTemplate } from '@/features/templates/types'
import { REMINDER_TIMINGS, type ReminderTiming } from '@/features/sms/types'
import { format, startOfDay, endOfDay, addDays } from 'date-fns'
import { isUSPhoneNumber, normalizeUSPhoneNumber } from '@/utils/phone'

// Verify cron secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    console.log('Unauthorized cron request')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('Starting daily reminder cron job...')

  try {
    const now = new Date()
    const results = {
      checked: 0,
      sent: 0,
      failed: 0,
      skipped: 0,
    }

    // Get all users with active reminder schedules
    const schedulesSnapshot = await getAdminDb()
      .collection('reminderSchedules')
      .where('enabled', '==', true)
      .get()

    console.log(`Found ${schedulesSnapshot.size} active reminder schedules`)

    for (const scheduleDoc of schedulesSnapshot.docs) {
      const schedule = scheduleDoc.data()
      const timing = schedule.timing as ReminderTiming
      const userId = schedule.userId
      const templateId = schedule.templateId

      // Get user data
      const userDoc = await getAdminDb().collection('users').doc(userId).get()
      if (!userDoc.exists) {
        console.log(`User ${userId} not found, skipping`)
        continue
      }
      const user = userDoc.data()!

      // Check if trial user has credits
      if (user.subscriptionStatus === 'trial' && user.smsCreditsRemaining <= 0) {
        console.log(`User ${userId} has no SMS credits remaining, skipping`)
        continue
      }

      // Get the template
      const templateDoc = await getAdminDb().collection('templates').doc(templateId).get()
      if (!templateDoc.exists) {
        console.log(`Template ${templateId} not found, skipping`)
        continue
      }
      const template = templateDoc.data()!

      // Calculate the target date based on timing
      const daysAhead = REMINDER_TIMINGS[timing]?.daysAhead ?? 1
      const targetDate = addDays(now, daysAhead)
      const dayStart = startOfDay(targetDate)
      const dayEnd = endOfDay(targetDate)

      console.log(`Checking ${timing} reminders for user ${userId}`)
      console.log(`Target date: ${format(targetDate, 'yyyy-MM-dd')} (${daysAhead} days ahead)`)

      // Get appointments on the target date
      const appointmentsSnapshot = await getAdminDb()
        .collection('appointments')
        .where('userId', '==', userId)
        .where('appointmentTime', '>=', dayStart)
        .where('appointmentTime', '<=', dayEnd)
        .get()

      console.log(`Found ${appointmentsSnapshot.size} appointments on target date`)

      for (const appointmentDoc of appointmentsSnapshot.docs) {
        results.checked++
        const appointment = appointmentDoc.data()

        // Skip if no phone number
        if (!appointment.patientPhone) {
          console.log(`Skipping appointment ${appointmentDoc.id}: no phone number`)
          results.skipped++
          continue
        }

        // Skip if not a US phone number
        if (!isUSPhoneNumber(appointment.patientPhone)) {
          console.log(`Skipping appointment ${appointmentDoc.id}: non-US phone number`)
          results.skipped++
          continue
        }

        // Normalize phone to E.164 format
        const normalizedPhone = normalizeUSPhoneNumber(appointment.patientPhone)
        if (!normalizedPhone) {
          console.log(`Skipping appointment ${appointmentDoc.id}: invalid phone format`)
          results.skipped++
          continue
        }

        // Skip if reminder already sent for this timing
        const existingLogSnapshot = await getAdminDb()
          .collection('smsLogs')
          .where('appointmentId', '==', appointmentDoc.id)
          .where('templateId', '==', templateId)
          .limit(1)
          .get()

        if (!existingLogSnapshot.empty) {
          console.log(`Skipping appointment ${appointmentDoc.id}: reminder already sent`)
          results.skipped++
          continue
        }

        // Re-check user credits (may have been decremented in this loop)
        const currentUserDoc = await getAdminDb().collection('users').doc(userId).get()
        const currentUser = currentUserDoc.data()!
        if (currentUser.subscriptionStatus === 'trial' && currentUser.smsCreditsRemaining <= 0) {
          console.log(`User ${userId} ran out of credits during batch, stopping`)
          break
        }

        // Interpolate the template
        const message = interpolateTemplate(template.content, {
          patientName: appointment.patientName || 'Patient',
          appointmentDate: format(appointment.appointmentTime.toDate(), 'MMMM d, yyyy'),
          appointmentTime: format(appointment.appointmentTime.toDate(), 'h:mm a'),
          clinicName: user.clinicName || 'the clinic',
          clinicPhone: user.clinicPhone || '',
        })

        console.log(`Sending reminder to ${normalizedPhone}`)

        // Send SMS
        const result = await sendSMS({
          to: normalizedPhone,
          body: message,
        })

        // Log the SMS
        await createSMSLog({
          userId,
          appointmentId: appointmentDoc.id,
          templateId,
          phoneNumber: normalizedPhone,
          message,
          status: result.success ? 'sent' : 'failed',
          twilioSid: result.sid,
          error: result.error,
          sentAt: result.success ? new Date() : undefined,
        })

        if (result.success) {
          results.sent++
          console.log(`Reminder sent successfully: ${result.sid}`)

          // Decrement SMS credits for trial users
          if (currentUser.subscriptionStatus === 'trial' && currentUser.smsCreditsRemaining > 0) {
            await getAdminDb().collection('users').doc(userId).update({
              smsCreditsRemaining: currentUser.smsCreditsRemaining - 1,
            })
          }
        } else {
          results.failed++
          console.error(`Failed to send reminder: ${result.error}`)
        }
      }
    }

    console.log('Daily cron job completed:', results)

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Cron job failed' },
      { status: 500 }
    )
  }
}
