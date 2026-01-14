import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getOrCreateUser } from '@/features/auth/server/user-service'
import { currentUser } from '@clerk/nextjs/server'
import { PRICING_PLANS } from '@/config/pricing'
import { differenceInDays } from 'date-fns'
import { ManageSubscriptionButton } from '@/features/billing/components/ManageSubscriptionButton'

export default async function BillingPage() {
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                {isOnTrial ? 'Trial Days Remaining' : 'Plan Status'}
              </p>
              <p className="text-2xl font-bold">
                {isOnTrial ? `${trialDaysRemaining} days` : isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">SMS Credits Remaining</p>
              <p className="text-2xl font-bold">{user.smsCreditsRemaining}</p>
            </div>
          </div>
          {isOnTrial && (
            <p className="text-sm text-muted-foreground">
              Your trial ends when either the {trialDaysRemaining} days pass or you use all SMS credits.
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
