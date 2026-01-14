import { z } from 'zod'

// Reminder timing options
export const REMINDER_TIMINGS = {
  week: { label: '1 Week Before', minutes: 7 * 24 * 60 },
  day: { label: '1 Day Before', minutes: 24 * 60 },
  hour: { label: '1 Hour Before', minutes: 60 },
  thirtyMin: { label: '30 Minutes Before', minutes: 30 },
} as const

export type ReminderTiming = keyof typeof REMINDER_TIMINGS

// Reminder Schedule Schema
export const reminderScheduleSchema = z.object({
  id: z.string(),
  userId: z.string(),
  templateId: z.string(),
  timing: z.enum(['week', 'day', 'hour', 'thirtyMin']),
  enabled: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createReminderScheduleSchema = z.object({
  templateId: z.string().min(1, 'Template is required'),
  timing: z.enum(['week', 'day', 'hour', 'thirtyMin']),
  enabled: z.boolean().optional().default(true),
})

export const updateReminderScheduleSchema = z.object({
  templateId: z.string().optional(),
  timing: z.enum(['week', 'day', 'hour', 'thirtyMin']).optional(),
  enabled: z.boolean().optional(),
})

export type ReminderSchedule = z.infer<typeof reminderScheduleSchema>
export type CreateReminderScheduleInput = z.infer<typeof createReminderScheduleSchema>
export type UpdateReminderScheduleInput = z.infer<typeof updateReminderScheduleSchema>

// SMS Log Schema
export const smsLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  appointmentId: z.string(),
  templateId: z.string().optional(),
  phoneNumber: z.string(),
  message: z.string(),
  status: z.enum(['pending', 'sent', 'delivered', 'failed']),
  twilioSid: z.string().optional(),
  error: z.string().optional(),
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
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  twilioSid?: string
  error?: string
  scheduledFor?: Date
  sentAt?: Date
}

// Helper to calculate when reminder should be sent
export function calculateReminderTime(
  appointmentTime: Date,
  timing: ReminderTiming
): Date {
  const minutesBefore = REMINDER_TIMINGS[timing].minutes
  return new Date(appointmentTime.getTime() - minutesBefore * 60 * 1000)
}

// Helper to check if a reminder should be sent now
export function shouldSendReminder(
  appointmentTime: Date,
  timing: ReminderTiming,
  toleranceMinutes: number = 5
): boolean {
  const reminderTime = calculateReminderTime(appointmentTime, timing)
  const now = new Date()
  const diffMinutes = (reminderTime.getTime() - now.getTime()) / (60 * 1000)

  // Reminder should be sent if we're within the tolerance window
  return diffMinutes >= -toleranceMinutes && diffMinutes <= toleranceMinutes
}
