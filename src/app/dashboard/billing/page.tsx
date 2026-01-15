import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getOrCreateUser } from '@/features/auth/server/user-service'
import { currentUser } from '@clerk/nextjs/server'
import { PRICING_PLANS } from '@/config/pricing'
import { differenceInDays, format } from 'date-fns'
import { ManageSubscriptionButton } from '@/features/billing/components/ManageSubscriptionButton'
import { stripe } from '@/lib/stripe/client'
import { getAdminDb } from '@/lib/firebase/admin'

const USERS_COLLECTION = 'users'

export default async function BillingPage() {
  const { userId } = await auth()
  const clerkUser = await currentUser()

  if (!userId || !clerkUser) {
    return null
  }

  let user = await getOrCreateUser(
    userId,
    clerkUser.emailAddresses[0]?.emailAddress || '',
    clerkUser.fullName || clerkUser.firstName || ''
  )

  // Auto-sync billing date from Stripe (always sync to ensure accuracy)
  if (user.subscriptionStatus === 'active' && user.stripeCustomerId) {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: 'active',
        limit: 10,
      })

      if (subscriptions.data.length > 0) {
        // Get the subscription with highest amount (most likely the real one)
        const subscription = subscriptions.data.reduce((best: any, current: any) => {
          const bestAmount = best.items?.data?.[0]?.price?.unit_amount || best.plan?.amount || 0
          const currentAmount = current.items?.data?.[0]?.price?.unit_amount || current.plan?.amount || 0
          return currentAmount > bestAmount ? current : best
        }) as any

        // Calculate next credits reset date (always monthly, regardless of billing interval)
        let currentPeriodEnd: Date | null = null
        const startDate = subscription.start_date || subscription.billing_cycle_anchor

        if (startDate && typeof startDate === 'number') {
          const start = new Date(startDate * 1000)
          const now = new Date()

          // Find the next monthly reset date from the subscription start
          currentPeriodEnd = new Date(start)
          while (currentPeriodEnd <= now) {
            currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
          }
        }

        if (currentPeriodEnd && !isNaN(currentPeriodEnd.getTime())) {
          await getAdminDb().collection(USERS_COLLECTION).doc(user.id).update({
            currentPeriodEnd,
            updatedAt: new Date(),
          })

          // Update local user object
          user = { ...user, currentPeriodEnd }
        }
      }
    } catch (error) {
      console.error('Failed to sync billing date:', error)
    }
  }

  const trialDaysRemaining = user.trialEndsAt
    ? Math.max(0, differenceInDays(user.trialEndsAt, new Date()))
    : 0

  const currentPlan = PRICING_PLANS.find((p) => p.id === user.subscriptionTier)
  const isOnTrial = user.subscriptionStatus === 'trial'
  const isActive = user.subscriptionStatus === 'active'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Billing</h2>
        <p className="text-muted-foreground">
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Current Plan Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Plan</CardTitle>
            <Badge variant={isOnTrial ? 'secondary' : 'default'}>
              {isOnTrial ? 'Trial' : isActive ? currentPlan?.name || 'Active' : 'Inactive'}
            </Badge>
          </div>
          <CardDescription>
            {isOnTrial
              ? 'Your trial includes 7 days and 20 free SMS credits'
              : isActive
                ? `You're on the ${currentPlan?.name} plan`
                : 'Subscribe to continue using SMS Remindful'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                {isOnTrial ? 'Trial Days Remaining' : 'Plan Status'}
              </p>
              <p className="text-2xl font-bold">
                {isOnTrial ? `${trialDaysRemaining} days` : isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">SMS Credits</p>
              <p className="text-2xl font-bold">
                {user.smsCreditsRemaining}
                {isActive && currentPlan?.smsLimit && (
                  <span className="text-base font-normal text-muted-foreground">
                    {' '}/ {currentPlan.smsLimit}
                  </span>
                )}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                {isOnTrial ? 'Trial Ends' : isActive ? 'Credits Reset' : 'Status'}
              </p>
              <p className="text-2xl font-bold">
                {isOnTrial && user.trialEndsAt
                  ? format(user.trialEndsAt, 'MMM d, yyyy')
                  : isActive && user.currentPeriodEnd
                    ? format(user.currentPeriodEnd, 'MMM d, yyyy')
                    : 'N/A'}
              </p>
            </div>
          </div>
          {isOnTrial && (
            <p className="text-sm text-muted-foreground">
              Your trial ends on {user.trialEndsAt ? format(user.trialEndsAt, 'MMMM d, yyyy') : 'N/A'} or when you use all {user.smsCreditsRemaining} SMS credits.
            </p>
          )}
          {isActive && user.currentPeriodEnd && (
            <p className="text-sm text-muted-foreground">
              Your SMS credits will reset to {currentPlan?.smsLimit || 0} on {format(user.currentPeriodEnd, 'MMMM d, yyyy')}.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        {isActive && user.stripeCustomerId && (
          <ManageSubscriptionButton />
        )}
        <Button asChild variant={isActive ? 'ghost' : 'outline'}>
          <Link href="/pricing">
            {isOnTrial ? 'View plans & upgrade' : isActive ? 'View all plans' : 'Subscribe now'} →
          </Link>
        </Button>
      </div>
    </div>
  )
}
