import { sendSMS } from '@/lib/twilio/client'
import { getTemplateById } from '@/features/templates/server/template-service'
import { interpolateTemplate } from '@/features/templates/types'
import { createSMSLog, updateSMSLogStatus } from './sms-log-service'
import { updateAppointment } from '@/features/appointments/server/appointment-service'
import { getUserByClerkId } from '@/features/auth/server/user-service'
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
}: SendReminderOptions): Promise<{ success: boolean; error?: string }> {
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
): Promise<{ success: boolean; error?: string }> {
  const testMessage = 'This is a test message from SMS Remindful. Your SMS integration is working correctly!'

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

    return { success: result.success, error: result.error }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: errorMessage }
  }
}
