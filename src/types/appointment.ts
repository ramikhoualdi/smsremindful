import { z } from 'zod'

// Appointment schema for Firestore
export const appointmentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  calendarEventId: z.string(),
  patientName: z.string(),
  phoneNumber: z.string(),
  appointmentTime: z.date(),
  endTime: z.date().optional(),
  notes: z.string().optional(),
  reminderSent: z.boolean().default(false),
  reminderScheduledFor: z.date().optional(),
  templateId: z.string().optional(),
  status: z.enum(['scheduled', 'confirmed', 'cancelled', 'completed']).default('scheduled'),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Appointment = z.infer<typeof appointmentSchema>

// Appointment creation input (from calendar sync)
export const createAppointmentSchema = appointmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  reminderSent: true,
  status: true,
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>

// Appointment update input
export const updateAppointmentSchema = appointmentSchema.partial().omit({
  id: true,
  userId: true,
  calendarEventId: true,
})

export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>
