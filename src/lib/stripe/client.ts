// Stripe Server Client - NEVER import in client components
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not configured')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})

// Price IDs for subscriptions (set these in your .env after creating in Stripe Dashboard)
// Format: price_xxxxx from Stripe
export const STRIPE_PRICES = {
  // Starter plan
  starter_monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || '',
  starter_annual: process.env.STRIPE_PRICE_STARTER_ANNUAL || '',
  // Growth plan
  growth_monthly: process.env.STRIPE_PRICE_GROWTH_MONTHLY || '',
  growth_annual: process.env.STRIPE_PRICE_GROWTH_ANNUAL || '',
  // Pro plan
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
  pro_annual: process.env.STRIPE_PRICE_PRO_ANNUAL || '',
} as const

export type PriceKey = keyof typeof STRIPE_PRICES

// Helper to get price ID from plan and billing period
export function getPriceId(
  plan: 'starter' | 'growth' | 'pro',
  billingPeriod: 'monthly' | 'annual'
): string {
  const key = `${plan}_${billingPeriod}` as PriceKey
  const priceId = STRIPE_PRICES[key]

  if (!priceId) {
    throw new Error(`Stripe price not configured for ${plan} ${billingPeriod}. Set STRIPE_PRICE_${plan.toUpperCase()}_${billingPeriod.toUpperCase()} in .env`)
  }

  return priceId
}
