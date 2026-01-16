import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUserByClerkId } from '@/features/auth/server/user-service'
import { OnboardingWizard } from '@/features/onboarding/components/OnboardingWizard'

export default async function OnboardingPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await getUserByClerkId(userId)

  if (!user) {
    redirect('/sign-in')
  }

  // If onboarding is already completed, redirect to dashboard
  if (user.onboardingCompleted) {
    redirect('/dashboard')
  }

  return (
    <OnboardingWizard
      userName={user.name?.split(' ')[0] || 'there'}
      isCalendarConnected={user.calendarConnected}
      connectedEmail={user.googleEmail}
    />
  )
}
