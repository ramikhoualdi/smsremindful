import { cache } from 'react'
import { getAdminDb } from '@/lib/firebase/admin'
import type { SMSLog, CreateSMSLogInput } from '../types'

const SMS_LOGS_COLLECTION = 'smsLogs'

// Cache per request
export const getSMSLogsByUserId = cache(async (
  userId: string,
  limit: number = 50
): Promise<SMSLog[]> => {
  const snapshot = await getAdminDb()
    .collection(SMS_LOGS_COLLECTION)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get()

  return snapshot.docs.map(docToSMSLog)
})

export async function getSMSLogsByAppointmentId(
  appointmentId: string
): Promise<SMSLog[]> {
  const snapshot = await getAdminDb()
    .collection(SMS_LOGS_COLLECTION)
    .where('appointmentId', '==', appointmentId)
    .orderBy('createdAt', 'desc')
    .get()

  return snapshot.docs.map(docToSMSLog)
}

export async function createSMSLog(data: CreateSMSLogInput): Promise<SMSLog> {
  const now = new Date()

  // Build Firestore data (use null for missing values)
  const firestoreData: Record<string, unknown> = {
    userId: data.userId,
    appointmentId: data.appointmentId,
    templateId: data.templateId || null,
    phoneNumber: data.phoneNumber,
    message: data.message,
    status: data.status,
    twilioSid: data.twilioSid || null,
    error: data.error || null,
    scheduledFor: data.scheduledFor || null,
    sentAt: data.sentAt || null,
    deliveredAt: null,
    createdAt: now,
  }

  const docRef = await getAdminDb().collection(SMS_LOGS_COLLECTION).add(firestoreData)

  // Return typed SMSLog (use undefined for optional fields)
  return {
    id: docRef.id,
    userId: data.userId,
    appointmentId: data.appointmentId,
    templateId: data.templateId,
    phoneNumber: data.phoneNumber,
    message: data.message,
    status: data.status,
    twilioSid: data.twilioSid,
    error: data.error,
    scheduledFor: data.scheduledFor,
    sentAt: data.sentAt,
    deliveredAt: undefined,
    createdAt: now,
  }
}

export async function updateSMSLogStatus(
  logId: string,
  status: 'pending' | 'sent' | 'delivered' | 'failed',
  additionalData?: {
    twilioSid?: string
    error?: string
    sentAt?: Date
    deliveredAt?: Date
  }
): Promise<void> {
  const updateData: Record<string, unknown> = { status }

  if (additionalData?.twilioSid) updateData.twilioSid = additionalData.twilioSid
  if (additionalData?.error) updateData.error = additionalData.error
  if (additionalData?.sentAt) updateData.sentAt = additionalData.sentAt
  if (additionalData?.deliveredAt) updateData.deliveredAt = additionalData.deliveredAt

  await getAdminDb().collection(SMS_LOGS_COLLECTION).doc(logId).update(updateData)
}

// Cache per request
export const getSMSStats = cache(async (userId: string): Promise<{
  total: number
  sent: number
  delivered: number
  failed: number
}> => {
  const snapshot = await getAdminDb()
    .collection(SMS_LOGS_COLLECTION)
    .where('userId', '==', userId)
    .get()

  const stats = {
    total: 0,
    sent: 0,
    delivered: 0,
    failed: 0,
  }

  snapshot.docs.forEach((doc) => {
    const data = doc.data()
    stats.total++
    if (data.status === 'sent') stats.sent++
    if (data.status === 'delivered') stats.delivered++
    if (data.status === 'failed') stats.failed++
  })

  return stats
})

// Helper to convert Firestore doc to SMSLog type
function docToSMSLog(doc: FirebaseFirestore.DocumentSnapshot): SMSLog {
  const data = doc.data()!
  return {
    id: doc.id,
    userId: data.userId,
    appointmentId: data.appointmentId,
    templateId: data.templateId,
    phoneNumber: data.phoneNumber,
    message: data.message,
    status: data.status,
    twilioSid: data.twilioSid,
    error: data.error,
    scheduledFor: data.scheduledFor?.toDate(),
    sentAt: data.sentAt?.toDate(),
    deliveredAt: data.deliveredAt?.toDate(),
    createdAt: data.createdAt?.toDate(),
  }
}
