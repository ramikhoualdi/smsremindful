'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronRight, Check } from 'lucide-react'
import {
  PRICING_PLANS,
  ANNUAL_SAVINGS_PERCENT,
  CUSTOM_PLAN_EMAIL,
  type PricingPlan,
} from '@/config/pricing'

interface PricingSectionProps {
  currentPlan?: string | null
  isOnTrial?: boolean
  hasActiveSubscription?: boolean
}

export function PricingSection({ currentPlan, isOnTrial, hasActiveSubscription }: PricingSectionProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

  return (
    <section id="pricing" className="w-full px-6 md:my-16 my-8 pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-6 md:text-lg text-base text-muted-foreground max-w-2xl mx-auto">
            Start with a free trial. Upgrade when you&apos;re ready. No hidden fees.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <span
            className={cn(
              'text-sm font-medium cursor-pointer',
              billingPeriod === 'monthly' ? 'text-foreground' : 'text-muted-foreground'
            )}
            onClick={() => setBillingPeriod('monthly')}
          >
            Monthly
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer',
              billingPeriod === 'annual' ? 'bg-primary' : 'bg-muted'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                billingPeriod === 'annual' ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-sm font-medium cursor-pointer',
                billingPeriod === 'annual' ? 'text-foreground' : 'text-muted-foreground'
              )}
              onClick={() => setBillingPeriod('annual')}
            >
              Annual
            </span>
            <Badge
              className={cn(
                'rounded-full bg-green-600/20 text-xs text-green-600 hover:bg-green-600/20 transition-opacity',
                billingPeriod === 'annual' ? 'opacity-100' : 'opacity-0'
              )}
            >
              Save {ANNUAL_SAVINGS_PERCENT}%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {PRICING_PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billingPeriod={billingPeriod}
              isCurrentPlan={currentPlan === plan.id}
              isOnTrial={isOnTrial}
              hasActiveSubscription={hasActiveSubscription}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface PricingCardProps {
  plan: PricingPlan
  billingPeriod: 'monthly' | 'annual'
  isCurrentPlan: boolean
  isOnTrial?: boolean
  hasActiveSubscription?: boolean
}

function PricingCard({ plan, billingPeriod, isCurrentPlan, isOnTrial, hasActiveSubscription }: PricingCardProps) {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const { name, description, monthlyPrice, annualPrice, features, featured } = plan

  const isCustomPlan = monthlyPrice === null
  const displayPrice = isCustomPlan
    ? null
    : billingPeriod === 'annual'
      ? annualPrice
      : monthlyPrice

  const handleClick = async () => {
    if (isCurrentPlan || isLoading) return

    if (isCustomPlan) {
      window.location.href = `mailto:${CUSTOM_PLAN_EMAIL}?subject=Custom Plan Inquiry&body=Hi, I'm interested in a custom plan for SMS Remindful.`
      return
    }

    if (!isSignedIn) {
      router.push('/sign-up')
      return
    }

    setIsLoading(true)

    // If user has active subscription, redirect to billing portal for plan changes
    if (hasActiveSubscription) {
      try {
        const response = await fetch('/api/stripe/portal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        const data = await response.json()

        if (data.url) {
          window.open(data.url, '_blank', 'noopener,noreferrer')
          setIsLoading(false)
        } else {
          console.error('No portal URL returned')
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Portal error:', error)
        setIsLoading(false)
      }
      return
    }

    // New subscription - redirect to Stripe checkout (same tab for better UX)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plan.id,
          billingPeriod,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url  // Same tab - Stripe will redirect back after payment
      } else {
        console.error('No checkout URL returned')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn(
        'relative rounded-xl p-8 ring-1 ring-border flex flex-col',
        featured ? 'shadow-2xl bg-background' : 'bg-muted/40'
      )}
    >
      {featured && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green-600 text-xs text-white hover:bg-green-600">
          Most Popular
        </Badge>
      )}
      {isCurrentPlan && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-xs text-primary-foreground hover:bg-primary">
          Current Plan
        </Badge>
      )}

      <h3 className="text-lg font-semibold leading-7 text-foreground">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>

      <div className="mt-6">
        {isCustomPlan ? (
          <>
            <p className="text-4xl font-bold tracking-tight text-foreground">Custom</p>
            <p className="mt-1 text-sm text-muted-foreground invisible">Placeholder</p>
          </>
        ) : (
          <>
            <p className="flex items-baseline gap-x-2">
              <span className="text-4xl font-bold tracking-tight text-foreground">
                ${displayPrice}
              </span>
              <span className="text-sm text-muted-foreground">/month</span>
            </p>
            <p className={cn(
              'mt-1 text-sm text-muted-foreground',
              billingPeriod === 'annual' ? 'visible' : 'invisible'
            )}>
              <span className="line-through">${monthlyPrice}</span>
              <span className="ml-2">billed annually</span>
            </p>
          </>
        )}
      </div>

      <ul className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex gap-x-3">
            <Check
              className={cn(
                'h-5 w-5 flex-none rounded-full p-0.5',
                featured ? 'text-green-600 bg-green-100' : 'text-muted-foreground bg-muted'
              )}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {isCurrentPlan ? (
        <div className="mt-8 w-full rounded-xl py-2.5 text-center text-sm font-medium text-muted-foreground">
          Current Plan
        </div>
      ) : (
        <Button
          onClick={handleClick}
          disabled={isLoading}
          className={cn(
            'mt-8 w-full rounded-xl',
            featured ? 'bg-primary hover:bg-primary/90' : ''
          )}
          variant={featured ? 'default' : 'outline'}
          size="lg"
        >
          {isLoading ? (
            'Loading...'
          ) : isCustomPlan ? (
            <>
              Contact Us
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          ) : isOnTrial ? (
            <>
              Upgrade
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          ) : isSignedIn ? (
            <>
              Switch Plan
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              Start Free Trial
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  )
}
