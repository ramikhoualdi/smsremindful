export type PlanId = 'solo' | 'practice' | 'clinic' | 'custom'

export interface PricingPlan {
  id: PlanId
  name: string
  description: string
  monthlyPrice: number | null // null for custom
  annualPrice: number | null // price per month when billed annually
  smsLimit: number | null // null for custom
  featured: boolean
  features: string[]
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'solo',
    name: 'Solo',
    description: 'Perfect for solo practitioners',
    monthlyPrice: 49,
    annualPrice: 41, // 2 months free ($490/year)
    smsLimit: 300,
    featured: false,
    features: [
      'Up to 300 SMS/month',
      'Google Calendar sync',
      'SMS templates',
      'Automated scheduling',
      'Dashboard analytics',
      'Email support',
    ],
  },
  {
    id: 'practice',
    name: 'Practice',
    description: 'Most popular - ideal for small practices',
    monthlyPrice: 99,
    annualPrice: 83, // 2 months free ($990/year)
    smsLimit: 800,
    featured: true,
    features: [
      'Up to 800 SMS/month',
      'Google Calendar sync',
      'SMS templates',
      'Automated scheduling',
      'Dashboard analytics',
      'Priority support',
    ],
  },
  {
    id: 'clinic',
    name: 'Clinic',
    description: 'For busy multi-dentist practices',
    monthlyPrice: 149,
    annualPrice: 124, // 2 months free ($1,490/year)
    smsLimit: 2000,
    featured: false,
    features: [
      'Up to 2,000 SMS/month',
      'Google Calendar sync',
      'SMS templates',
      'Automated scheduling',
      'Dashboard analytics',
      'Priority support',
      'Dedicated account manager',
    ],
  },
  {
    id: 'custom',
    name: 'Custom',
    description: "Need more? Let's talk",
    monthlyPrice: null,
    annualPrice: null,
    smsLimit: null,
    featured: false,
    features: [
      'Unlimited SMS',
      'Multiple calendars',
      'Custom integrations',
      'White-label options',
      'Dedicated support',
      'SLA guarantee',
    ],
  },
]

// Annual savings (2 months free = ~17% off)
export const ANNUAL_SAVINGS_PERCENT = 17

// Contact email for custom plan
export const CUSTOM_PLAN_EMAIL = 'rami@smsremindful.com'
