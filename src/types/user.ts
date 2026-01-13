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
  subscriptionTier: z.enum(['starter', 'professional']).optional(),
  trialStartedAt: z.date(),
  trialEndsAt: z.date(),
  smsCreditsRemaining: z.number().default(20),
  calendarConnected: z.boolean().default(false),
  googleRefreshToken: z.string().optional(),
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
  googleRefreshToken: true,
})

export type CreateUserInput = z.infer<typeof createUserSchema>

// User update input
export const updateUserSchema = userSchema.partial().omit({ id: true, clerkId: true })

export type UpdateUserInput = z.infer<typeof updateUserSchema>
