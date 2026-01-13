// Firebase Admin SDK - Server only
// NEVER import this file in client components
import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

let app: App | undefined

function getAdminApp(): App {
  if (getApps().length === 0) {
    const serviceAccount = process.env.FIREBASE_ADMIN_SDK_JSON
    if (!serviceAccount) {
      throw new Error('FIREBASE_ADMIN_SDK_JSON environment variable is not set')
    }

    app = initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
    })
  }

  return app || getApps()[0]
}

export const adminApp = getAdminApp()
export const adminDb = getFirestore(adminApp)
