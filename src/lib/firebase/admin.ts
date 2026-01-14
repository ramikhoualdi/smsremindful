// Firebase Admin SDK - Server only
// NEVER import this file in client components
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { join } from 'path'

let db: Firestore | undefined

// Initialize Firebase Admin SDK
if (!getApps().length) {
  let credential

  // Option 1: Use file path (local development)
  if (process.env.FIREBASE_ADMIN_SDK_PATH) {
    const filePath = process.env.FIREBASE_ADMIN_SDK_PATH
    const absolutePath = filePath.startsWith('/') || filePath.includes(':')
      ? filePath
      : join(process.cwd(), filePath)
    const serviceAccount = JSON.parse(readFileSync(absolutePath, 'utf-8'))
    credential = cert(serviceAccount)
  }
  // Option 2: Use individual env vars (Vercel)
  else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    credential = cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
  }
  else {
    throw new Error('Firebase Admin SDK not configured. Set FIREBASE_ADMIN_SDK_PATH or individual env vars.')
  }

  initializeApp({ credential })
}

function getDb(): Firestore {
  if (db) return db
  db = getFirestore()
  return db
}

// Lazy getter - only initialize when actually used
export const getAdminDb = () => getDb()
