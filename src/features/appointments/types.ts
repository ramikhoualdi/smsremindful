import { z } from 'zod'

// Appointment status
export const appointmentStatusSchema = z.enum([
  'scheduled',
  'confirmed',
  'cancelled',
  'completed',
])

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>

// Phone carrier types (from Twilio Lookup)
export const phoneCarrierTypeSchema = z.enum(['mobile', 'landline', 'voip', 'unknown'])
export type PhoneCarrierType = z.infer<typeof phoneCarrierTypeSchema>

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
  // Phone validation fields
  phoneValidated: z.boolean().optional(),
  phoneType: phoneCarrierTypeSchema.optional(),
  phoneValidatedAt: z.date().optional(),
  phoneCanReceiveSMS: z.boolean().optional(),
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

// Phone number regex patterns to match various formats
const PHONE_PATTERNS = [
  // Labeled phone: "phone: 123-456-7890", "tel: +1234567890", "mobile: (123) 456-7890"
  /(?:phone|tel|mobile|cell|contact)[:\s]*([+\d\s().-]{10,})/i,
  // US format: (123) 456-7890, 123-456-7890, 123.456.7890
  /\b(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})\b/,
  // International: +1 234 567 8901, +12345678901
  /\b(\+\d{1,3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4})\b/,
  // Simple 10+ digit number
  /\b(\d{10,14})\b/,
]

// Helper to extract phone number from text
function extractPhoneFromText(text: string | null | undefined): string | undefined {
  if (!text) return undefined

  for (const pattern of PHONE_PATTERNS) {
    const match = text.match(pattern)
    if (match) {
      // Clean up the phone number
      const phone = match[1].trim().replace(/\s+/g, ' ')
      // Validate it has enough digits (at least 10)
      const digitCount = phone.replace(/\D/g, '').length
      if (digitCount >= 10) {
        return phone
      }
    }
  }
  return undefined
}

// Helper to extract patient info from calendar event
export function extractPatientInfo(
  summary: string | null,
  description: string | null,
  attendees: Array<{ email: string; displayName?: string }>,
  location?: string | null
): { name: string; phone?: string } {
  let name = 'Unknown Patient'
  let phone: string | undefined

  // Extract name from summary (common format: "Patient Name - Checkup")
  if (summary) {
    // Remove common appointment type suffixes
    const cleanedSummary = summary
      .replace(/\s*[-–]\s*(checkup|cleaning|exam|consultation|appointment|visit|dental|teeth|crown|filling|root canal).*/i, '')
      .trim()

    // Also remove phone numbers from the name
    const nameWithoutPhone = cleanedSummary.replace(/[+\d().\s-]{10,}/g, '').trim()
    if (nameWithoutPhone) {
      name = nameWithoutPhone
    }
  }

  // Try to get name from first attendee
  if (name === 'Unknown Patient' && attendees.length > 0) {
    const firstAttendee = attendees[0]
    if (firstAttendee.displayName) {
      name = firstAttendee.displayName
    }
  }

  // Try to extract phone from multiple sources (in priority order)
  // 1. Description (most likely place for explicit phone)
  phone = extractPhoneFromText(description)

  // 2. Summary/Title (some people put phone in title)
  if (!phone) {
    phone = extractPhoneFromText(summary)
  }

  // 3. Location field (sometimes used for contact info)
  if (!phone) {
    phone = extractPhoneFromText(location)
  }

  return { name, phone }
}
