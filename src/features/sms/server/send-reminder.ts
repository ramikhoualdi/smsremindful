import { sendSMS } from '@/lib/twilio/client'
import { getTemplateById } from '@/features/templates/server/template-service'
import { interpolateTemplate } from '@/features/templates/types'
import { createSMSLog, updateSMSLogStatus } from './sms-log-service'
import { updateAppointment } from '@/features/appointments/server/appointment-service'
import { getUserByClerkId, updateUser } from '@/features/auth/server/user-service'
import { format } from 'date-fns'
import type { Appointment } from '@/features/appointments/types'
import type { User } from '@/types/user'

interface SendReminderOptions {
  appointment: Appointment
  user: User
  templateId: string
}

export async function sendAppointmentReminder({
  appointment,
  user,
  templateId,
}: SendReminderOptions): Promise<{ success: boolean; error?: string; code?: string; action?: string }> {
  // Check if user has SMS credits with smart error messages
  if (user.smsCreditsRemaining <= 0) {
    if (user.subscriptionStatus === 'trial') {
      return {
        success: false,
        error: 'Your trial credits are used up. Subscribe to a plan to continue sending reminders.',
        code: 'TRIAL_CREDITS_EXHAUSTED',
        action: 'subscribe',
      }
    } else if (user.subscriptionStatus === 'active') {
      return {
        success: false,
        error: "You've used all your credits for this billing period. Upgrade your plan for more monthly credits.",
        code: 'PLAN_CREDITS_EXHAUSTED',
        action: 'upgrade',
      }
    } else {
      return {
        success: false,
        error: 'Your subscription is inactive. Subscribe to a plan to continue sending reminders.',
        code: 'SUBSCRIPTION_INACTIVE',
        action: 'subscribe',
      }
    }
  }

  // Validate phone number
  if (!appointment.patientPhone) {
    return { success: false, error: 'No phone number for this appointment' }
  }

  // Get the template
  const template = await getTemplateById(templateId)
  if (!template) {
    return { success: false, error: 'Template not found' }
  }

  // Interpolate template variables
  const message = interpolateTemplate(template.content, {
    patientName: appointment.patientName || 'Patient',
    appointmentDate: format(appointment.appointmentTime, 'MMMM d, yyyy'),
    appointmentTime: format(appointment.appointmentTime, 'h:mm a'),
    clinicName: user.clinicName || 'the clinic',
    clinicPhone: user.clinicPhone || '',
  })

  // Create SMS log entry
  const smsLog = await createSMSLog({
    userId: user.id,
    appointmentId: appointment.id,
    templateId: template.id,
    phoneNumber: appointment.patientPhone,
    message,
    status: 'pending',
  })

  try {
    // Send SMS via Twilio
    const result = await sendSMS({
      to: appointment.patientPhone,
      body: message,
    })

    if (result.success) {
      // Update SMS log with success
      await updateSMSLogStatus(smsLog.id, 'sent', {
        twilioSid: result.sid,
        sentAt: new Date(),
      })

      // Mark appointment as reminder sent
      await updateAppointment(appointment.id, {
        reminderSent: true,
        reminderSentAt: new Date(),
      })

      // Decrement SMS credits
      await updateUser(user.id, {
        smsCreditsRemaining: user.smsCreditsRemaining - 1,
      })

      return { success: true }
    } else {
      // Update SMS log with failure
      await updateSMSLogStatus(smsLog.id, 'failed', {
        error: result.error,
      })

      return { success: false, error: result.error }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Update SMS log with failure
    await updateSMSLogStatus(smsLog.id, 'failed', {
      error: errorMessage,
    })

    return { success: false, error: errorMessage }
  }
}

// Send a test SMS to verify configuration
export async function sendTestSMS(
  phoneNumber: string,
  userId: string
): Promise<{ success: boolean; error?: string; code?: string; action?: string; creditsRemaining?: number }> {
  // Fetch user to check credits (userId is the clerkId/document ID)
  const user = await getUserByClerkId(userId)
  if (!user) {
    return { success: false, error: 'User not found' }
  }

  // Check if user has SMS credits with smart error messages
  if (user.smsCreditsRemaining <= 0) {
    if (user.subscriptionStatus === 'trial') {
      return {
        success: false,
        error: 'Your trial credits are used up. Subscribe to a plan to continue sending reminders.',
        code: 'TRIAL_CREDITS_EXHAUSTED',
        action: 'subscribe',
      }
    } else if (user.subscriptionStatus === 'active') {
      return {
        success: false,
        error: "You've used all your credits for this billing period. Upgrade your plan for more monthly credits.",
        code: 'PLAN_CREDITS_EXHAUSTED',
        action: 'upgrade',
      }
    } else {
      return {
        success: false,
        error: 'Your subscription is inactive. Subscribe to a plan to continue sending reminders.',
        code: 'SUBSCRIPTION_INACTIVE',
        action: 'subscribe',
      }
    }
  }

  const testMessage = 'SMS Remindful: This is a test message. Your SMS integration is working correctly! Reply STOP to opt out.'

  try {
    const result = await sendSMS({
      to: phoneNumber,
      body: testMessage,
    })

    // Log the test message
    await createSMSLog({
      userId,
      appointmentId: 'test',
      phoneNumber,
      message: testMessage,
      status: result.success ? 'sent' : 'failed',
      twilioSid: result.sid,
      error: result.error,
      sentAt: result.success ? new Date() : undefined,
    })

    if (result.success) {
      // Decrement SMS credits
      await updateUser(user.id, {
        smsCreditsRemaining: user.smsCreditsRemaining - 1,
      })

      return {
        success: true,
        creditsRemaining: user.smsCreditsRemaining - 1,
      }
    }

    return { success: false, error: result.error }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: errorMessage }
  }
}
