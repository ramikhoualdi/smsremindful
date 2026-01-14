// Firebase Admin SDK - Server only
// NEVER import this file in client components
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { join } from 'path'

let app: App | undefined
let db: Firestore | undefined

function getAdminApp(): App {
  if (app) return app

  if (getApps().length > 0) {
    app = getApps()[0]
    return app
  }

  try {
    let serviceAccountData: object

    // Option 1: Read from file path (local development)
    const filePath = process.env.FIREBASE_ADMIN_SDK_PATH
    if (filePath) {
      const absolutePath = filePath.startsWith('/') || filePath.includes(':')
        ? filePath
        : join(process.cwd(), filePath)
      const fileContent = readFileSync(absolutePath, 'utf-8')
      serviceAccountData = JSON.parse(fileContent)
    }
    // Option 2: Individual env vars (recommended for Vercel)
    else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      // Replace escaped newlines with actual newlines in private key
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')

      serviceAccountData = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: privateKey,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
      }
    }
    // Option 3: Full JSON string (fallback)
    else if (process.env.FIREBASE_ADMIN_SDK_JSON) {
      let jsonStr = process.env.FIREBASE_ADMIN_SDK_JSON.trim()
      // Remove surrounding quotes if present
      if ((jsonStr.startsWith('"') && jsonStr.endsWith('"')) ||
          (jsonStr.startsWith("'") && jsonStr.endsWith("'"))) {
        jsonStr = jsonStr.slice(1, -1)
      }
      serviceAccountData = JSON.parse(jsonStr)
    }
    else {
      throw new Error(
        'Firebase Admin SDK not configured. Set one of:\n' +
        '  1. FIREBASE_ADMIN_SDK_PATH (local file path)\n' +
        '  2. FIREBASE_PROJECT_ID + FIREBASE_PRIVATE_KEY + FIREBASE_CLIENT_EMAIL\n' +
        '  3. FIREBASE_ADMIN_SDK_JSON (full JSON string)'
      )
    }

    app = initializeApp({
      credential: cert(serviceAccountData as Parameters<typeof cert>[0]),
    })
    return app
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error)
    throw error
  }
}

function getDb(): Firestore {
  if (db) return db
  db = getFirestore(getAdminApp())
  return db
}

// Lazy getters - only initialize when actually used
export const getAdminDb = () => getDb()
