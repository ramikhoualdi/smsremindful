import { getAdminDb } from '@/lib/firebase/admin'
import type { Appointment, CreateAppointmentInput } from '../types'
import { extractPatientInfo } from '../types'
import type { CalendarEvent } from '@/lib/google/calendar'

const APPOINTMENTS_COLLECTION = 'appointments'

export async function getAppointmentsByUserId(userId: string): Promise<Appointment[]> {
  const snapshot = await getAdminDb()
    .collection(APPOINTMENTS_COLLECTION)
    .where('userId', '==', userId)
    .where('appointmentTime', '>=', new Date())
    .orderBy('appointmentTime', 'asc')
    .get()

  return snapshot.docs.map(docToAppointment)
}

export async function getAppointmentByCalendarEventId(
  userId: string,
  calendarEventId: string
): Promise<Appointment | null> {
  const snapshot = await getAdminDb()
    .collection(APPOINTMENTS_COLLECTION)
    .where('userId', '==', userId)
    .where('calendarEventId', '==', calendarEventId)
    .limit(1)
    .get()

  if (snapshot.empty) {
    return null
  }

  return docToAppointment(snapshot.docs[0])
}

export async function createAppointment(data: CreateAppointmentInput): Promise<Appointment> {
  const now = new Date()
  const appointmentData = {
    calendarEventId: data.calendarEventId,
    userId: data.userId,
    patientName: data.patientName,
    patientPhone: data.patientPhone || null,
    appointmentTime: data.appointmentTime,
    endTime: data.endTime,
    description: data.description || null,
    location: data.location || null,
    status: data.status,
    sourceCalendar: data.sourceCalendar,
    lastSyncedAt: data.lastSyncedAt,
    reminderSent: false,
    createdAt: now,
    updatedAt: now,
  }

  const docRef = await getAdminDb().collection(APPOINTMENTS_COLLECTION).add(appointmentData)

  return {
    id: docRef.id,
    ...appointmentData,
  } as Appointment
}

export async function updateAppointment(
  appointmentId: string,
  data: Partial<Appointment>
): Promise<void> {
  // Convert undefined values to null for Firestore compatibility
  const cleanData: Record<string, unknown> = { updatedAt: new Date() }
  for (const [key, value] of Object.entries(data)) {
    cleanData[key] = value === undefined ? null : value
  }
  await getAdminDb().collection(APPOINTMENTS_COLLECTION).doc(appointmentId).update(cleanData)
}

export async function deleteAppointment(appointmentId: string): Promise<void> {
  await getAdminDb().collection(APPOINTMENTS_COLLECTION).doc(appointmentId).delete()
}

export async function syncCalendarEvents(
  userId: string,
  events: CalendarEvent[]
): Promise<{ created: number; updated: number; deleted: number }> {
  const now = new Date()
  let created = 0
  let updated = 0
  let deleted = 0

  // Get existing appointments for this user
  const existingSnapshot = await getAdminDb()
    .collection(APPOINTMENTS_COLLECTION)
    .where('userId', '==', userId)
    .get()

  const existingByEventId = new Map<string, { id: string; data: Appointment }>()
  existingSnapshot.docs.forEach((doc) => {
    const data = docToAppointment(doc)
    existingByEventId.set(data.calendarEventId, { id: doc.id, data })
  })

  // Track which event IDs we've seen
  const seenEventIds = new Set<string>()

  // Process each calendar event
  for (const event of events) {
    seenEventIds.add(event.id)

    const patientInfo = extractPatientInfo(event.summary, event.description, event.attendees)

    const existing = existingByEventId.get(event.id)

    if (existing) {
      // Update existing appointment
      await updateAppointment(existing.id, {
        patientName: patientInfo.name,
        patientPhone: patientInfo.phone,
        appointmentTime: event.start,
        endTime: event.end,
        description: event.description || undefined,
        location: event.location,
        lastSyncedAt: now,
      })
      updated++
    } else {
      // Create new appointment
      await createAppointment({
        calendarEventId: event.id,
        userId,
        patientName: patientInfo.name,
        patientPhone: patientInfo.phone,
        appointmentTime: event.start,
        endTime: event.end,
        description: event.description || undefined,
        location: event.location,
        status: 'scheduled',
        lastSyncedAt: now,
        sourceCalendar: 'google',
      })
      created++
    }
  }

  // Delete appointments that no longer exist in calendar
  for (const [eventId, { id }] of existingByEventId) {
    if (!seenEventIds.has(eventId)) {
      await deleteAppointment(id)
      deleted++
    }
  }

  return { created, updated, deleted }
}

// Helper to convert Firestore doc to Appointment type
function docToAppointment(doc: FirebaseFirestore.DocumentSnapshot): Appointment {
  const data = doc.data()!
  return {
    id: doc.id,
    calendarEventId: data.calendarEventId,
    userId: data.userId,
    patientName: data.patientName,
    patientPhone: data.patientPhone,
    appointmentTime: data.appointmentTime?.toDate(),
    endTime: data.endTime?.toDate(),
    description: data.description,
    location: data.location,
    status: data.status,
    reminderSent: data.reminderSent,
    reminderSentAt: data.reminderSentAt?.toDate(),
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
    lastSyncedAt: data.lastSyncedAt?.toDate(),
    sourceCalendar: data.sourceCalendar,
  } as Appointment
}
