import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase/admin'
import { sendSMS } from '@/lib/twilio/client'
import { createSMSLog } from '@/features/sms/server/sms-log-service'
import { interpolateTemplate } from '@/features/templates/types'
import { REMINDER_TIMINGS, type ReminderTiming } from '@/features/sms/types'
import { format } from 'date-fns'

// Verify cron secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    console.log('Unauthorized cron request')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('Starting reminder cron job...')

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

      // Get the template
      const templateDoc = await getAdminDb().collection('templates').doc(templateId).get()
      if (!templateDoc.exists) {
        console.log(`Template ${templateId} not found, skipping`)
        continue
      }
      const template = templateDoc.data()!

      // Calculate the time window for this reminder timing
      const minutesBefore = REMINDER_TIMINGS[timing]?.minutes || 0
      const windowStart = new Date(now.getTime() + (minutesBefore - 5) * 60 * 1000)
      const windowEnd = new Date(now.getTime() + (minutesBefore + 5) * 60 * 1000)

      console.log(`Checking ${timing} reminders for user ${userId}`)
      console.log(`Window: ${windowStart.toISOString()} to ${windowEnd.toISOString()}`)

      // Get appointments in the reminder window
      const appointmentsSnapshot = await getAdminDb()
        .collection('appointments')
        .where('userId', '==', userId)
        .where('appointmentTime', '>=', windowStart)
        .where('appointmentTime', '<=', windowEnd)
        .get()

      console.log(`Found ${appointmentsSnapshot.size} appointments in window`)

      for (const appointmentDoc of appointmentsSnapshot.docs) {
        results.checked++
        const appointment = appointmentDoc.data()

        // Skip if no phone number
        if (!appointment.patientPhone) {
          console.log(`Skipping appointment ${appointmentDoc.id}: no phone number`)
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

        // Interpolate the template
        const message = interpolateTemplate(template.content, {
          patientName: appointment.patientName || 'Patient',
          appointmentDate: format(appointment.appointmentTime.toDate(), 'MMMM d, yyyy'),
          appointmentTime: format(appointment.appointmentTime.toDate(), 'h:mm a'),
          clinicName: user.clinicName || 'the clinic',
          clinicPhone: user.clinicPhone || '',
        })

        console.log(`Sending reminder to ${appointment.patientPhone}`)

        // Send SMS
        const result = await sendSMS({
          to: appointment.patientPhone,
          body: message,
        })

        // Log the SMS
        await createSMSLog({
          userId,
          appointmentId: appointmentDoc.id,
          templateId,
          phoneNumber: appointment.patientPhone,
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
          if (user.subscriptionStatus === 'trial' && user.smsCreditsRemaining > 0) {
            await getAdminDb().collection('users').doc(userId).update({
              smsCreditsRemaining: user.smsCreditsRemaining - 1,
            })
          }
        } else {
          results.failed++
          console.error(`Failed to send reminder: ${result.error}`)
        }
      }
    }

    console.log('Cron job completed:', results)

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
