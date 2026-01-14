import { getAdminDb } from '@/lib/firebase/admin'
import type { Template, CreateTemplateInput, UpdateTemplateInput, DEFAULT_TEMPLATES } from '../types'

const TEMPLATES_COLLECTION = 'templates'

export async function getTemplatesByUserId(userId: string): Promise<Template[]> {
  const snapshot = await getAdminDb()
    .collection(TEMPLATES_COLLECTION)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get()

  return snapshot.docs.map(docToTemplate)
}

export async function getTemplateById(templateId: string): Promise<Template | null> {
  const doc = await getAdminDb()
    .collection(TEMPLATES_COLLECTION)
    .doc(templateId)
    .get()

  if (!doc.exists) {
    return null
  }

  return docToTemplate(doc)
}

export async function createTemplate(
  userId: string,
  data: CreateTemplateInput
): Promise<Template> {
  const now = new Date()

  // If this is marked as default, unset other defaults
  if (data.isDefault) {
    await unsetDefaultTemplates(userId)
  }

  const templateData = {
    userId,
    name: data.name,
    content: data.content,
    isDefault: data.isDefault || false,
    createdAt: now,
    updatedAt: now,
  }

  const docRef = await getAdminDb().collection(TEMPLATES_COLLECTION).add(templateData)

  return {
    id: docRef.id,
    ...templateData,
  }
}

export async function updateTemplate(
  templateId: string,
  userId: string,
  data: UpdateTemplateInput
): Promise<void> {
  // Verify ownership
  const existing = await getTemplateById(templateId)
  if (!existing || existing.userId !== userId) {
    throw new Error('Template not found or access denied')
  }

  // If setting as default, unset other defaults
  if (data.isDefault) {
    await unsetDefaultTemplates(userId)
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() }
  if (data.name !== undefined) updateData.name = data.name
  if (data.content !== undefined) updateData.content = data.content
  if (data.isDefault !== undefined) updateData.isDefault = data.isDefault

  await getAdminDb().collection(TEMPLATES_COLLECTION).doc(templateId).update(updateData)
}

export async function deleteTemplate(templateId: string, userId: string): Promise<void> {
  // Verify ownership
  const existing = await getTemplateById(templateId)
  if (!existing || existing.userId !== userId) {
    throw new Error('Template not found or access denied')
  }

  await getAdminDb().collection(TEMPLATES_COLLECTION).doc(templateId).delete()
}

export async function getDefaultTemplate(userId: string): Promise<Template | null> {
  const snapshot = await getAdminDb()
    .collection(TEMPLATES_COLLECTION)
    .where('userId', '==', userId)
    .where('isDefault', '==', true)
    .limit(1)
    .get()

  if (snapshot.empty) {
    return null
  }

  return docToTemplate(snapshot.docs[0])
}

// Initialize default templates for a new user
export async function initializeDefaultTemplates(
  userId: string,
  defaultTemplates: typeof DEFAULT_TEMPLATES
): Promise<void> {
  const existing = await getTemplatesByUserId(userId)
  if (existing.length > 0) {
    return // User already has templates
  }

  const now = new Date()
  const batch = getAdminDb().batch()

  for (const template of defaultTemplates) {
    const docRef = getAdminDb().collection(TEMPLATES_COLLECTION).doc()
    batch.set(docRef, {
      userId,
      name: template.name,
      content: template.content,
      isDefault: template.isDefault,
      createdAt: now,
      updatedAt: now,
    })
  }

  await batch.commit()
}

// Helper to unset all default templates for a user
async function unsetDefaultTemplates(userId: string): Promise<void> {
  const snapshot = await getAdminDb()
    .collection(TEMPLATES_COLLECTION)
    .where('userId', '==', userId)
    .where('isDefault', '==', true)
    .get()

  const batch = getAdminDb().batch()
  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, { isDefault: false, updatedAt: new Date() })
  })

  await batch.commit()
}

// Helper to convert Firestore doc to Template type
function docToTemplate(doc: FirebaseFirestore.DocumentSnapshot): Template {
  const data = doc.data()!
  return {
    id: doc.id,
    userId: data.userId,
    name: data.name,
    content: data.content,
    isDefault: data.isDefault,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  }
}
