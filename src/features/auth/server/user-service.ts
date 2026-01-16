import { cache } from 'react'
import { getAdminDb } from '@/lib/firebase/admin'
import type { User, UpdateUserInput } from '@/types/user'

const USERS_COLLECTION = 'users'

// Cache user lookup per request to avoid duplicate Firebase calls
export const getUserByClerkId = cache(async (clerkId: string): Promise<User | null> => {
  // Try direct document lookup first (fast path)
  const directDoc = await getAdminDb()
    .collection(USERS_COLLECTION)
    .doc(clerkId)
    .get()

  if (directDoc.exists) {
    return docToUser(directDoc)
  }

  // Fallback to query for legacy users (slower)
  const snapshot = await getAdminDb()
    .collection(USERS_COLLECTION)
    .where('clerkId', '==', clerkId)
    .limit(1)
    .get()

  if (snapshot.empty) {
    return null
  }

  const doc = snapshot.docs[0]
  return docToUser(doc)
})

export async function createUser(clerkId: string, email: string, name: string): Promise<User> {
  const now = new Date()
  const trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const userData = {
    clerkId,
    email,
    name,
    clinicName: '',
    subscriptionStatus: 'trial',
    trialStartedAt: now,
    trialEndsAt,
    smsCreditsRemaining: 20,
    calendarConnected: false,
    onboardingCompleted: false,
    createdAt: now,
    updatedAt: now,
  }

  // Use clerkId as document ID for O(1) lookups
  await getAdminDb().collection(USERS_COLLECTION).doc(clerkId).set(userData)

  return {
    id: clerkId,
    ...userData,
  } as User
}

export async function updateUser(userId: string, data: UpdateUserInput): Promise<void> {
  await getAdminDb().collection(USERS_COLLECTION).doc(userId).update({
    ...data,
    updatedAt: new Date(),
  })
}

// Cache per request - avoids duplicate calls across pages/components
export const getOrCreateUser = cache(async (
  clerkId: string,
  email: string,
  name: string
): Promise<User> => {
  const existing = await getUserByClerkId(clerkId)
  if (existing) {
    return existing
  }
  return createUser(clerkId, email, name)
})

export async function updateCalendarConnection(
  userId: string,
  tokens: {
    accessToken: string
    refreshToken: string
    expiresAt?: Date
    email?: string
  }
): Promise<void> {
  await getAdminDb().collection(USERS_COLLECTION).doc(userId).update({
    calendarConnected: true,
    googleAccessToken: tokens.accessToken,
    googleRefreshToken: tokens.refreshToken,
    googleTokenExpiresAt: tokens.expiresAt || null,
    googleEmail: tokens.email || null,
    updatedAt: new Date(),
  })
}

export async function disconnectCalendar(userId: string): Promise<void> {
  await getAdminDb().collection(USERS_COLLECTION).doc(userId).update({
    calendarConnected: false,
    googleAccessToken: null,
    googleRefreshToken: null,
    googleTokenExpiresAt: null,
    googleEmail: null,
    lastCalendarSync: null,
    updatedAt: new Date(),
  })
}

export async function updateLastCalendarSync(userId: string): Promise<void> {
  await getAdminDb().collection(USERS_COLLECTION).doc(userId).update({
    lastCalendarSync: new Date(),
    updatedAt: new Date(),
  })
}

// Helper to convert Firestore doc to User type
function docToUser(doc: FirebaseFirestore.DocumentSnapshot): User {
  const data = doc.data()!
  return {
    id: doc.id,
    clerkId: data.clerkId,
    email: data.email,
    name: data.name,
    clinicName: data.clinicName,
    clinicPhone: data.clinicPhone,
    stripeCustomerId: data.stripeCustomerId,
    subscriptionStatus: data.subscriptionStatus,
    subscriptionTier: data.subscriptionTier,
    currentPeriodEnd: data.currentPeriodEnd?.toDate(),
    trialStartedAt: data.trialStartedAt?.toDate(),
    trialEndsAt: data.trialEndsAt?.toDate(),
    smsCreditsRemaining: data.smsCreditsRemaining,
    calendarConnected: data.calendarConnected,
    googleAccessToken: data.googleAccessToken,
    googleRefreshToken: data.googleRefreshToken,
    googleTokenExpiresAt: data.googleTokenExpiresAt?.toDate(),
    googleEmail: data.googleEmail,
    lastCalendarSync: data.lastCalendarSync?.toDate(),
    onboardingCompleted: data.onboardingCompleted ?? false,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as User
}
