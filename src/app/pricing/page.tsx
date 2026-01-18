import { auth } from '@clerk/nextjs/server'
import { PricingSection } from '@/features/pricing/components/PricingSection'
import { PricingFAQ } from '@/features/pricing/components/PricingFAQ'
import { FAQStructuredData } from '@/components/seo/StructuredData'
import { getUserByClerkId } from '@/features/auth/server/user-service'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
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
      <Header />

      <main className="flex-1">
        <FAQStructuredData />
        <PricingSection currentPlan={currentPlan} isOnTrial={isOnTrial} hasActiveSubscription={hasActiveSubscription} />
        <PricingFAQ />
      </main>

      <Footer />
    </div>
  )
}
