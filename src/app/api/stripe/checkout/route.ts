import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { stripe, getPriceId } from '@/lib/stripe/client'
import { getOrCreateUser, updateUser } from '@/features/auth/server/user-service'
import { currentUser } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const clerkUser = await currentUser()

    if (!userId || !clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { plan, billingPeriod } = body as {
      plan: 'solo' | 'practice' | 'clinic'
      billingPeriod: 'monthly' | 'annual'
    }

    if (!plan || !billingPeriod) {
      return NextResponse.json(
        { error: 'Missing plan or billingPeriod' },
        { status: 400 }
      )
    }

    // Get or create user
    const user = await getOrCreateUser(
      userId,
      clerkUser.emailAddresses[0]?.emailAddress || '',
      clerkUser.fullName || clerkUser.firstName || ''
    )

    // Get Stripe price ID
    const priceId = getPriceId(plan, billingPeriod)

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          clerkId: userId,
          firestoreUserId: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID to user
      await updateUser(user.id, { stripeCustomerId: customerId })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=true`,
      subscription_data: {
        metadata: {
          clerkId: userId,
          firestoreUserId: user.id,
          plan,
          billingPeriod,
        },
      },
      metadata: {
        clerkId: userId,
        firestoreUserId: user.id,
        plan,
        billingPeriod,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
