import { z } from 'zod'

// Reminder timing options (daily batch mode - sends at 8 AM)
export const REMINDER_TIMINGS = {
  '1_week': { label: '1 Week Before', description: 'Sent 7 days before appointment', daysAhead: 7 },
  '1_day': { label: '1 Day Before', description: 'Sent the day before appointment', daysAhead: 1 },
  'same_day': { label: 'Same Day (Morning)', description: 'Sent morning of appointment', daysAhead: 0 },
} as const

export type ReminderTiming = keyof typeof REMINDER_TIMINGS

// Reminder Schedule Schema
export const reminderScheduleSchema = z.object({
  id: z.string(),
  userId: z.string(),
  templateId: z.string(),
  timing: z.enum(['1_week', '1_day', 'same_day']),
  enabled: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createReminderScheduleSchema = z.object({
  templateId: z.string().min(1, 'Template is required'),
  timing: z.enum(['1_week', '1_day', 'same_day']),
  enabled: z.boolean().optional().default(true),
})

export const updateReminderScheduleSchema = z.object({
  templateId: z.string().optional(),
  timing: z.enum(['1_week', '1_day', 'same_day']).optional(),
  enabled: z.boolean().optional(),
})

export type ReminderSchedule = z.infer<typeof reminderScheduleSchema>
export type CreateReminderScheduleInput = z.infer<typeof createReminderScheduleSchema>
export type UpdateReminderScheduleInput = z.infer<typeof updateReminderScheduleSchema>

// SMS Status values (matches Twilio statuses)
export const SMS_STATUS = {
  pending: 'pending',       // Created but not yet sent
  queued: 'queued',         // Twilio has queued the message
  sending: 'sending',       // Twilio is sending the message
  sent: 'sent',             // Message sent to carrier
  delivered: 'delivered',   // Carrier confirmed delivery
  undelivered: 'undelivered', // Carrier couldn't deliver
  failed: 'failed',         // Message failed to send
} as const

export type SMSStatus = keyof typeof SMS_STATUS

// SMS Log Schema
export const smsLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  appointmentId: z.string(),
  templateId: z.string().optional(),
  phoneNumber: z.string(),
  message: z.string(),
  status: z.enum(['pending', 'queued', 'sending', 'sent', 'delivered', 'undelivered', 'failed']),
  twilioSid: z.string().optional(),
  error: z.string().optional(),
  errorCode: z.string().optional(),        // Twilio error code (e.g., "30003")
  twilioErrorMessage: z.string().optional(), // Detailed Twilio error message
  scheduledFor: z.date().optional(),
  sentAt: z.date().optional(),
  deliveredAt: z.date().optional(),
  createdAt: z.date(),
})

export type SMSLog = z.infer<typeof smsLogSchema>

export interface CreateSMSLogInput {
  userId: string
  appointmentId: string
  templateId?: string
  phoneNumber: string
  message: string
  status: SMSStatus
  twilioSid?: string
  error?: string
  errorCode?: string
  twilioErrorMessage?: string
  scheduledFor?: Date
  sentAt?: Date
}

// Helper to get days ahead for a timing
export function getDaysAhead(timing: ReminderTiming): number {
  return REMINDER_TIMINGS[timing].daysAhead
}
