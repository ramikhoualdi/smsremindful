import { z } from 'zod'

// User schema for Firestore
export const userSchema = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string().email(),
  name: z.string(),
  clinicName: z.string(),
  clinicPhone: z.string().optional(),
  stripeCustomerId: z.string().optional(),
  subscriptionStatus: z.enum(['active', 'inactive', 'trial']).default('trial'),
  subscriptionTier: z.enum(['solo', 'practice', 'clinic', 'custom']).optional(),
  currentPeriodEnd: z.date().optional(), // Next billing date / credits reset
  trialStartedAt: z.date(),
  trialEndsAt: z.date(),
  smsCreditsRemaining: z.number().default(20),
  calendarConnected: z.boolean().default(false),
  googleAccessToken: z.string().optional(),
  googleRefreshToken: z.string().optional(),
  googleTokenExpiresAt: z.date().optional(),
  googleEmail: z.string().optional(),
  lastCalendarSync: z.date().optional(),
  onboardingCompleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof userSchema>

// User creation input
export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  stripeCustomerId: true,
  subscriptionStatus: true,
  subscriptionTier: true,
  smsCreditsRemaining: true,
  calendarConnected: true,
  googleAccessToken: true,
  googleRefreshToken: true,
  googleTokenExpiresAt: true,
  googleEmail: true,
  lastCalendarSync: true,
})

export type CreateUserInput = z.infer<typeof createUserSchema>

// User update input
export const updateUserSchema = userSchema.partial().omit({ id: true, clerkId: true })

export type UpdateUserInput = z.infer<typeof updateUserSchema>
