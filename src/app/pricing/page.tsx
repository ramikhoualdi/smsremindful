import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PricingSection } from '@/features/pricing/components/PricingSection'
import { PricingFAQ } from '@/features/pricing/components/PricingFAQ'
import { FAQStructuredData } from '@/components/seo/StructuredData'
import { getUserByClerkId } from '@/features/auth/server/user-service'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - SMS Remindful | Plans Starting at $49/month',
  description:
    'Simple, transparent pricing for SMS appointment reminders. Starter $49/mo (300 SMS), Growth $99/mo (800 SMS), Pro $149/mo (2,000 SMS). 7-day free trial included, no credit card required.',
  openGraph: {
    title: 'Pricing - SMS Remindful | Plans Starting at $49/month',
    description:
      'Simple, transparent pricing for SMS appointment reminders. 7-day free trial included.',
    url: 'https://smsremindful.com/pricing',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing - SMS Remindful',
    description: 'SMS appointment reminders starting at $49/month. Free trial included.',
  },
  alternates: {
    canonical: 'https://smsremindful.com/pricing',
  },
}

export default async function PricingPage() {
  const { userId } = await auth()

  let currentPlan: string | null = null
  let isOnTrial = false
  let hasActiveSubscription = false

  if (userId) {
    const user = await getUserByClerkId(userId)
    if (user?.subscriptionStatus === 'active' && user.subscriptionTier) {
      currentPlan = user.subscriptionTier
      hasActiveSubscription = true
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
        <FAQStructuredData />
        <PricingSection currentPlan={currentPlan} isOnTrial={isOnTrial} hasActiveSubscription={hasActiveSubscription} />
        <PricingFAQ />
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} SMS Remindful. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/legal/terms-of-service" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
