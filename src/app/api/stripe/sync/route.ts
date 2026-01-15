import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe/client'
import { getAdminDb } from '@/lib/firebase/admin'
import { getUserByClerkId } from '@/features/auth/server/user-service'

const USERS_COLLECTION = 'users'

export async function POST() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserByClerkId(userId)

    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: 'No Stripe customer found' }, { status: 400 })
    }

    // Fetch subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
      limit: 1,
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 })
    }

    const subscription = subscriptions.data[0] as any
    const periodEnd = subscription.current_period_end || subscription.billing_cycle_anchor
    const currentPeriodEnd = periodEnd ? new Date(periodEnd * 1000) : null

    if (!currentPeriodEnd) {
      return NextResponse.json({ error: 'Could not determine billing date' }, { status: 400 })
    }

    // Update user in Firestore
    await getAdminDb().collection(USERS_COLLECTION).doc(user.id).update({
      currentPeriodEnd,
      updatedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      currentPeriodEnd: currentPeriodEnd.toISOString()
    })
  } catch (error) {
    console.error('Stripe sync error:', error)
    return NextResponse.json({ error: 'Failed to sync' }, { status: 500 })
  }
}
