// Stripe Server Client
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not configured')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})

// Subscription tier product IDs (configure in Stripe Dashboard)
export const STRIPE_PRODUCTS = {
  STARTER: process.env.STRIPE_PRODUCT_STARTER_ID || '',
  PROFESSIONAL: process.env.STRIPE_PRODUCT_PROFESSIONAL_ID || '',
} as const

// Price IDs for subscriptions
export const STRIPE_PRICES = {
  STARTER_MONTHLY: process.env.STRIPE_PRICE_STARTER_MONTHLY_ID || '',
  PROFESSIONAL_MONTHLY: process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY_ID || '',
} as const
