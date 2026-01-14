import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PricingSection } from '@/features/pricing/components/PricingSection'
import { getUserByClerkId } from '@/features/auth/server/user-service'

export default async function PricingPage() {
  const { userId } = await auth()

  let currentPlan: string | null = null
  let isOnTrial = false

  if (userId) {
    const user = await getUserByClerkId(userId)
    if (user?.subscriptionStatus === 'active' && user.subscriptionTier) {
      currentPlan = user.subscriptionTier
    }
    if (user?.subscriptionStatus === 'trial') {
      isOnTrial = true
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b px-6">
        <Link href="/" className="text-xl font-bold">
          SMS Remindful
        </Link>
        <div className="flex items-center gap-4">
          {userId ? (
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/pricing">Pricing</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1">
        <PricingSection currentPlan={currentPlan} isOnTrial={isOnTrial} />
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} SMS Remindful. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/legal/terms-of-service" className="hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/legal/privacy-policy" className="hover:text-foreground">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
