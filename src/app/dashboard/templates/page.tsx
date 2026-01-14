import { auth, currentUser } from '@clerk/nextjs/server'
import { getOrCreateUser } from '@/features/auth/server/user-service'
import {
  getTemplatesByUserId,
  initializeDefaultTemplates,
} from '@/features/templates/server/template-service'
import { DEFAULT_TEMPLATES } from '@/features/templates/types'
import { TemplateList } from '@/features/templates/components/TemplateList'

export default async function TemplatesPage() {
  const { userId } = await auth()
  const clerkUser = await currentUser()

  if (!userId || !clerkUser) {
    return null
  }

  const user = await getOrCreateUser(
    userId,
    clerkUser.emailAddresses[0]?.emailAddress || '',
    clerkUser.fullName || clerkUser.firstName || ''
  )

  // Initialize default templates if user has none
  await initializeDefaultTemplates(user.id, DEFAULT_TEMPLATES)

  const templates = await getTemplatesByUserId(user.id)

  return <TemplateList templates={templates} />
}
