import { z } from 'zod'

// Available template variables
export const TEMPLATE_VARIABLES = [
  '{{patientName}}',
  '{{clinicName}}',
  '{{appointmentDate}}',
  '{{appointmentTime}}',
  '{{clinicPhone}}',
] as const

// Template schema for Firestore
export const templateSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1, 'Template name is required'),
  content: z.string().min(1, 'Template content is required'),
  isDefault: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Template = z.infer<typeof templateSchema>

// Template creation input
export const createTemplateSchema = templateSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>

// Template update input
export const updateTemplateSchema = templateSchema.partial().omit({
  id: true,
  userId: true,
})

export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>

// Reminder schedule schema
export const reminderScheduleSchema = z.object({
  id: z.string(),
  userId: z.string(),
  templateId: z.string(),
  timing: z.enum(['week', 'day', 'hour', 'custom']),
  customMinutesBefore: z.number().optional(),
  enabled: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type ReminderSchedule = z.infer<typeof reminderScheduleSchema>
