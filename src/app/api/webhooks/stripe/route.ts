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
  const smsLimit = planConfig?.smsLimit || 300

  await getAdminDb().collection(USERS_COLLECTION).doc(firestoreUserId).update({
    subscriptionStatus: 'active',
    subscriptionTier: plan,
    smsCreditsRemaining: smsLimit,
    updatedAt: new Date(),
  })

  console.log(`User ${firestoreUserId} subscribed to ${plan} plan`)
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const firestoreUserId = subscription.metadata?.firestoreUserId
  const plan = subscription.metadata?.plan as PlanId | undefined

  if (!firestoreUserId) {
    // Try to find user by customer ID
    const customerId = subscription.customer as string
    const userSnapshot = await getAdminDb()
      .collection(USERS_COLLECTION)
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get()

    if (userSnapshot.empty) {
      console.error('No user found for subscription:', subscription.id)
      return
    }

    const userId = userSnapshot.docs[0].id
    const status = subscription.status === 'active' ? 'active' : 'inactive'

    await getAdminDb().collection(USERS_COLLECTION).doc(userId).update({
      subscriptionStatus: status,
      updatedAt: new Date(),
    })
    return
  }

  const planConfig = PRICING_PLANS.find((p) => p.id === plan)
  const status = subscription.status === 'active' ? 'active' : 'inactive'

  const updateData: Record<string, unknown> = {
    subscriptionStatus: status,
    updatedAt: new Date(),
  }

  if (plan) {
    updateData.subscriptionTier = plan
  }

  await getAdminDb().collection(USERS_COLLECTION).doc(firestoreUserId).update(updateData)
  console.log(`Subscription updated for user ${firestoreUserId}: ${status}`)
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
