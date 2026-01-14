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
  // Solo plan
  solo_monthly: process.env.STRIPE_PRICE_SOLO_MONTHLY || '',
  solo_annual: process.env.STRIPE_PRICE_SOLO_ANNUAL || '',
  // Practice plan
  practice_monthly: process.env.STRIPE_PRICE_PRACTICE_MONTHLY || '',
  practice_annual: process.env.STRIPE_PRICE_PRACTICE_ANNUAL || '',
  // Clinic plan
  clinic_monthly: process.env.STRIPE_PRICE_CLINIC_MONTHLY || '',
  clinic_annual: process.env.STRIPE_PRICE_CLINIC_ANNUAL || '',
} as const

export type PriceKey = keyof typeof STRIPE_PRICES

// Helper to get price ID from plan and billing period
export function getPriceId(
  plan: 'solo' | 'practice' | 'clinic',
  billingPeriod: 'monthly' | 'annual'
): string {
  const key = `${plan}_${billingPeriod}` as PriceKey
  const priceId = STRIPE_PRICES[key]

  if (!priceId) {
    throw new Error(`Stripe price not configured for ${plan} ${billingPeriod}. Set STRIPE_PRICE_${plan.toUpperCase()}_${billingPeriod.toUpperCase()} in .env`)
  }

  return priceId
}
