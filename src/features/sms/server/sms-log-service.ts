import { cache } from 'react'
import { getAdminDb } from '@/lib/firebase/admin'
import type { SMSLog, CreateSMSLogInput, SMSStatus } from '../types'

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
    errorCode: data.errorCode || null,
    twilioErrorMessage: data.twilioErrorMessage || null,
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
    errorCode: data.errorCode,
    twilioErrorMessage: data.twilioErrorMessage,
    scheduledFor: data.scheduledFor,
    sentAt: data.sentAt,
    deliveredAt: undefined,
    createdAt: now,
  }
}

export async function updateSMSLogStatus(
  logId: string,
  status: SMSStatus,
  additionalData?: {
    twilioSid?: string
    error?: string
    errorCode?: string
    twilioErrorMessage?: string
    sentAt?: Date
    deliveredAt?: Date
  }
): Promise<void> {
  const updateData: Record<string, unknown> = { status }

  if (additionalData?.twilioSid) updateData.twilioSid = additionalData.twilioSid
  if (additionalData?.error) updateData.error = additionalData.error
  if (additionalData?.errorCode) updateData.errorCode = additionalData.errorCode
  if (additionalData?.twilioErrorMessage) updateData.twilioErrorMessage = additionalData.twilioErrorMessage
  if (additionalData?.sentAt) updateData.sentAt = additionalData.sentAt
  if (additionalData?.deliveredAt) updateData.deliveredAt = additionalData.deliveredAt

  await getAdminDb().collection(SMS_LOGS_COLLECTION).doc(logId).update(updateData)
}

// Find SMS log by Twilio SID (for webhook updates)
export async function getSMSLogByTwilioSid(twilioSid: string): Promise<SMSLog | null> {
  const snapshot = await getAdminDb()
    .collection(SMS_LOGS_COLLECTION)
    .where('twilioSid', '==', twilioSid)
    .limit(1)
    .get()

  if (snapshot.empty) {
    return null
  }

  return docToSMSLog(snapshot.docs[0])
}

// Update SMS log by Twilio SID (for webhook updates)
export async function updateSMSLogByTwilioSid(
  twilioSid: string,
  status: SMSStatus,
  additionalData?: {
    error?: string
    errorCode?: string
    twilioErrorMessage?: string
    deliveredAt?: Date
  }
): Promise<boolean> {
  const snapshot = await getAdminDb()
    .collection(SMS_LOGS_COLLECTION)
    .where('twilioSid', '==', twilioSid)
    .limit(1)
    .get()

  if (snapshot.empty) {
    console.warn(`No SMS log found for Twilio SID: ${twilioSid}`)
    return false
  }

  const docRef = snapshot.docs[0].ref
  const updateData: Record<string, unknown> = { status }

  if (additionalData?.error) updateData.error = additionalData.error
  if (additionalData?.errorCode) updateData.errorCode = additionalData.errorCode
  if (additionalData?.twilioErrorMessage) updateData.twilioErrorMessage = additionalData.twilioErrorMessage
  if (additionalData?.deliveredAt) updateData.deliveredAt = additionalData.deliveredAt

  await docRef.update(updateData)
  return true
}

// Cache per request
export const getSMSStats = cache(async (userId: string): Promise<{
  total: number
  pending: number
  sent: number
  delivered: number
  undelivered: number
  failed: number
}> => {
  const snapshot = await getAdminDb()
    .collection(SMS_LOGS_COLLECTION)
    .where('userId', '==', userId)
    .get()

  const stats = {
    total: 0,
    pending: 0,
    sent: 0,
    delivered: 0,
    undelivered: 0,
    failed: 0,
  }

  snapshot.docs.forEach((doc) => {
    const data = doc.data()
    stats.total++
    // Group queued/sending/pending as "pending"
    if (['pending', 'queued', 'sending'].includes(data.status)) stats.pending++
    // "sent" means sent to carrier but not yet confirmed delivered
    if (data.status === 'sent') stats.sent++
    if (data.status === 'delivered') stats.delivered++
    if (data.status === 'undelivered') stats.undelivered++
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
    errorCode: data.errorCode,
    twilioErrorMessage: data.twilioErrorMessage,
    scheduledFor: data.scheduledFor?.toDate(),
    sentAt: data.sentAt?.toDate(),
    deliveredAt: data.deliveredAt?.toDate(),
    createdAt: data.createdAt?.toDate(),
  }
}
