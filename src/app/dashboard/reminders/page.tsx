import { auth, currentUser } from '@clerk/nextjs/server'
import { getOrCreateUser } from '@/features/auth/server/user-service'
import { getReminderSchedulesByUserId } from '@/features/sms/server/reminder-service'
import { getSMSLogsByUserId } from '@/features/sms/server/sms-log-service'
import {
  getTemplatesByUserId,
  initializeDefaultTemplates,
} from '@/features/templates/server/template-service'
import { DEFAULT_TEMPLATES } from '@/features/templates/types'
import { ReminderSettings } from '@/features/sms/components/ReminderSettings'

export default async function RemindersPage() {
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

  // Initialize default templates if needed
  await initializeDefaultTemplates(user.id, DEFAULT_TEMPLATES)

  // Fetch data in parallel
  const [schedules, templates, smsLogs] = await Promise.all([
    getReminderSchedulesByUserId(user.id),
    getTemplatesByUserId(user.id),
    getSMSLogsByUserId(user.id, 20),
  ])

  return (
    <ReminderSettings
      schedules={schedules}
      templates={templates}
      smsLogs={smsLogs}
    />
  )
}
