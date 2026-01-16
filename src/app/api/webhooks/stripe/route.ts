import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { getAdminDb } from '@/lib/firebase/admin'
import { PRICING_PLANS, type PlanId } from '@/config/pricing'
import Stripe from 'stripe'

const USERS_COLLECTION = 'users'

// Stripe sends raw body, so we need to disable body parsing
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutComplete(session)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCanceled(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const firestoreUserId = session.metadata?.firestoreUserId
  const plan = session.metadata?.plan as PlanId | undefined

  if (!firestoreUserId || !plan) {
    console.error('Missing metadata in checkout session:', session.id)
    return
  }

  const planConfig = PRICING_PLANS.find((p) => p.id === plan)
  const newPlanCredits = planConfig?.smsLimit || 300

  // Get current user data to add credits to existing balance
  const userDoc = await getAdminDb().collection(USERS_COLLECTION).doc(firestoreUserId).get()
  const userData = userDoc.data()
  const currentCredits = userData?.smsCreditsRemaining || 0

  // Add new plan credits to remaining credits (e.g., trial credits + new plan credits)
  const totalCredits = currentCredits + newPlanCredits

  await getAdminDb().collection(USERS_COLLECTION).doc(firestoreUserId).update({
    subscriptionStatus: 'active',
    subscriptionTier: plan,
    smsCreditsRemaining: totalCredits,
    updatedAt: new Date(),
  })

  console.log(`User ${firestoreUserId} subscribed to ${plan} plan. Credits: ${currentCredits} + ${newPlanCredits} = ${totalCredits}`)
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  // Find user by customer ID
  const userSnapshot = await getAdminDb()
    .collection(USERS_COLLECTION)
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get()

  if (userSnapshot.empty) {
    console.error('No user found for subscription:', subscription.id)
    return
  }

  const userDoc = userSnapshot.docs[0]
  const userData = userDoc.data()
  const userId = userDoc.id
  const status = subscription.status === 'active' ? 'active' : 'inactive'

  // Get the new plan from the subscription's price
  const priceId = subscription.items.data[0]?.price?.id
  const newPlan = getPlanFromPriceId(priceId)
  const newPlanConfig = PRICING_PLANS.find((p) => p.id === newPlan)

  const oldPlan = userData.subscriptionTier as PlanId | undefined
  const oldPlanConfig = PRICING_PLANS.find((p) => p.id === oldPlan)

  // Store billing period end date for display
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subData = subscription as any
  const periodEnd = subData.current_period_end || subData.billing_cycle_anchor
  const currentPeriodEnd = periodEnd && typeof periodEnd === 'number'
    ? new Date(periodEnd * 1000)
    : null

  const updateData: Record<string, unknown> = {
    subscriptionStatus: status,
    currentPeriodEnd,
    updatedAt: new Date(),
  }

  if (newPlan) {
    updateData.subscriptionTier = newPlan

    // Handle plan upgrade: add new plan credits to remaining credits
    if (oldPlan && newPlan !== oldPlan && newPlanConfig) {
      const currentCredits = userData.smsCreditsRemaining || 0
      const newPlanCredits = newPlanConfig.smsLimit || 0

      // If upgrading (new plan has more credits), add new credits to remaining
      // If downgrading, just set to new plan's limit
      const oldLimit = oldPlanConfig?.smsLimit || 0
      const isUpgrade = newPlanCredits > oldLimit

      if (isUpgrade) {
        // Upgrade: keep remaining + add full new plan credits
        updateData.smsCreditsRemaining = currentCredits + newPlanCredits
        console.log(`Plan upgrade: ${oldPlan} → ${newPlan}, credits: ${currentCredits} + ${newPlanCredits} = ${currentCredits + newPlanCredits}`)
      } else {
        // Downgrade: set to new plan's limit (or keep current if less)
        updateData.smsCreditsRemaining = Math.min(currentCredits, newPlanCredits)
        console.log(`Plan downgrade: ${oldPlan} → ${newPlan}, credits set to: ${updateData.smsCreditsRemaining}`)
      }
    }
  }

  await getAdminDb().collection(USERS_COLLECTION).doc(userId).update(updateData)
  console.log(`Subscription updated for user ${userId}: ${status}, plan: ${newPlan || 'unchanged'}`)
}

// Helper to get plan ID from Stripe price ID
function getPlanFromPriceId(priceId: string | undefined): PlanId | undefined {
  if (!priceId) return undefined

  const priceToPlans: Record<string, PlanId> = {
    [process.env.STRIPE_PRICE_SOLO_MONTHLY || '']: 'solo',
    [process.env.STRIPE_PRICE_SOLO_ANNUAL || '']: 'solo',
    [process.env.STRIPE_PRICE_PRACTICE_MONTHLY || '']: 'practice',
    [process.env.STRIPE_PRICE_PRACTICE_ANNUAL || '']: 'practice',
    [process.env.STRIPE_PRICE_CLINIC_MONTHLY || '']: 'clinic',
    [process.env.STRIPE_PRICE_CLINIC_ANNUAL || '']: 'clinic',
  }

  return priceToPlans[priceId]
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const firestoreUserId = subscription.metadata?.firestoreUserId

  if (!firestoreUserId) {
    const customerId = subscription.customer as string
    const userSnapshot = await getAdminDb()
      .collection(USERS_COLLECTION)
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get()

    if (!userSnapshot.empty) {
      const userId = userSnapshot.docs[0].id
      await getAdminDb().collection(USERS_COLLECTION).doc(userId).update({
        subscriptionStatus: 'inactive',
        updatedAt: new Date(),
      })
      console.log(`Subscription canceled for user ${userId}`)
    }
    return
  }

  await getAdminDb().collection(USERS_COLLECTION).doc(firestoreUserId).update({
    subscriptionStatus: 'inactive',
    updatedAt: new Date(),
  })

  console.log(`Subscription canceled for user ${firestoreUserId}`)
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Only handle subscription invoices (not one-time payments)
  const subscriptionId = invoice.parent?.subscription_details?.subscription
  if (!subscriptionId) return

  const customerId = invoice.customer as string
  const userSnapshot = await getAdminDb()
    .collection(USERS_COLLECTION)
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get()

  if (userSnapshot.empty) {
    console.error('No user found for invoice:', invoice.id)
    return
  }

  const userDoc = userSnapshot.docs[0]
  const userData = userDoc.data()
  const plan = userData.subscriptionTier as PlanId | undefined

  if (!plan) return

  const planConfig = PRICING_PLANS.find((p) => p.id === plan)
  const smsLimit = planConfig?.smsLimit || 300

  // Reset SMS credits on successful payment (monthly renewal)
  await getAdminDb().collection(USERS_COLLECTION).doc(userDoc.id).update({
    smsCreditsRemaining: smsLimit,
    subscriptionStatus: 'active',
    updatedAt: new Date(),
  })

  console.log(`SMS credits reset for user ${userDoc.id}: ${smsLimit}`)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.parent?.subscription_details?.subscription
  if (!subscriptionId) return

  const customerId = invoice.customer as string
  const userSnapshot = await getAdminDb()
    .collection(USERS_COLLECTION)
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get()

  if (userSnapshot.empty) return

  // Mark subscription as inactive on payment failure
  // Stripe will retry the payment, but we mark as inactive until successful
  await getAdminDb().collection(USERS_COLLECTION).doc(userSnapshot.docs[0].id).update({
    subscriptionStatus: 'inactive',
    updatedAt: new Date(),
  })

  console.log(`Payment failed for user ${userSnapshot.docs[0].id}`)
}
