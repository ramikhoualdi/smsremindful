import { getAdminDb } from '@/lib/firebase/admin'
import type {
  ReminderSchedule,
  CreateReminderScheduleInput,
  UpdateReminderScheduleInput,
} from '../types'

const REMINDER_SCHEDULES_COLLECTION = 'reminderSchedules'

export async function getReminderSchedulesByUserId(
  userId: string
): Promise<ReminderSchedule[]> {
  const snapshot = await getAdminDb()
    .collection(REMINDER_SCHEDULES_COLLECTION)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get()

  return snapshot.docs.map(docToReminderSchedule)
}

export async function getReminderScheduleById(
  scheduleId: string
): Promise<ReminderSchedule | null> {
  const doc = await getAdminDb()
    .collection(REMINDER_SCHEDULES_COLLECTION)
    .doc(scheduleId)
    .get()

  if (!doc.exists) {
    return null
  }

  return docToReminderSchedule(doc)
}

export async function createReminderSchedule(
  userId: string,
  data: CreateReminderScheduleInput
): Promise<ReminderSchedule> {
  const now = new Date()

  const scheduleData = {
    userId,
    templateId: data.templateId,
    timing: data.timing,
    enabled: data.enabled ?? true,
    createdAt: now,
    updatedAt: now,
  }

  const docRef = await getAdminDb()
    .collection(REMINDER_SCHEDULES_COLLECTION)
    .add(scheduleData)

  return {
    id: docRef.id,
    ...scheduleData,
  }
}

export async function updateReminderSchedule(
  scheduleId: string,
  userId: string,
  data: UpdateReminderScheduleInput
): Promise<void> {
  // Verify ownership
  const existing = await getReminderScheduleById(scheduleId)
  if (!existing || existing.userId !== userId) {
    throw new Error('Reminder schedule not found or access denied')
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() }
  if (data.templateId !== undefined) updateData.templateId = data.templateId
  if (data.timing !== undefined) updateData.timing = data.timing
  if (data.enabled !== undefined) updateData.enabled = data.enabled

  await getAdminDb()
    .collection(REMINDER_SCHEDULES_COLLECTION)
    .doc(scheduleId)
    .update(updateData)
}

export async function deleteReminderSchedule(
  scheduleId: string,
  userId: string
): Promise<void> {
  // Verify ownership
  const existing = await getReminderScheduleById(scheduleId)
  if (!existing || existing.userId !== userId) {
    throw new Error('Reminder schedule not found or access denied')
  }

  await getAdminDb()
    .collection(REMINDER_SCHEDULES_COLLECTION)
    .doc(scheduleId)
    .delete()
}

export async function getEnabledSchedulesByUserId(
  userId: string
): Promise<ReminderSchedule[]> {
  const snapshot = await getAdminDb()
    .collection(REMINDER_SCHEDULES_COLLECTION)
    .where('userId', '==', userId)
    .where('enabled', '==', true)
    .get()

  return snapshot.docs.map(docToReminderSchedule)
}

// Helper to convert Firestore doc to ReminderSchedule type
function docToReminderSchedule(
  doc: FirebaseFirestore.DocumentSnapshot
): ReminderSchedule {
  const data = doc.data()!
  return {
    id: doc.id,
    userId: data.userId,
    templateId: data.templateId,
    timing: data.timing,
    enabled: data.enabled,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  }
}
