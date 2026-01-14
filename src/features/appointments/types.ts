import { z } from 'zod'

// Appointment status
export const appointmentStatusSchema = z.enum([
  'scheduled',
  'confirmed',
  'cancelled',
  'completed',
])

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>

// Appointment schema for Firestore
export const appointmentSchema = z.object({
  id: z.string(),
  calendarEventId: z.string(),
  userId: z.string(),
  patientName: z.string(),
  patientPhone: z.string().optional(),
  appointmentTime: z.date(),
  endTime: z.date(),
  description: z.string().optional(),
  location: z.string().optional(),
  status: appointmentStatusSchema.default('scheduled'),
  reminderSent: z.boolean().default(false),
  reminderSentAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Sync metadata
  lastSyncedAt: z.date(),
  sourceCalendar: z.enum(['google', 'outlook']).default('google'),
})

export type Appointment = z.infer<typeof appointmentSchema>

// For creating appointments from calendar events
export const createAppointmentSchema = appointmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  reminderSent: true,
  reminderSentAt: true,
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>

// Helper to extract patient info from calendar event
export function extractPatientInfo(
  summary: string | null,
  description: string | null,
  attendees: Array<{ email: string; displayName?: string }>
): { name: string; phone?: string } {
  // Try to extract from summary (common format: "Patient Name - Checkup")
  let name = 'Unknown Patient'
  let phone: string | undefined

  if (summary) {
    // Remove common appointment type suffixes
    const cleanedSummary = summary
      .replace(/\s*[-–]\s*(checkup|cleaning|exam|consultation|appointment|visit).*/i, '')
      .trim()
    if (cleanedSummary) {
      name = cleanedSummary
    }
  }

  // Try to get name from first attendee (excluding the dentist)
  if (attendees.length > 0) {
    const firstAttendee = attendees[0]
    if (firstAttendee.displayName) {
      name = firstAttendee.displayName
    }
  }

  // Try to extract phone from description
  if (description) {
    const phoneMatch = description.match(/(?:phone|tel|mobile|cell)[:\s]*([+\d\s()-]{10,})/i)
    if (phoneMatch) {
      phone = phoneMatch[1].trim()
    } else {
      // Try to find any phone-like pattern
      const generalPhoneMatch = description.match(/\b(\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})\b/)
      if (generalPhoneMatch) {
        phone = generalPhoneMatch[1]
      }
    }
  }

  return { name, phone }
}
