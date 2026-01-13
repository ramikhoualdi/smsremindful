import { z } from 'zod'

// SMS delivery status
export const smsStatusSchema = z.enum([
  'pending',
  'queued',
  'sent',
  'delivered',
  'failed',
  'undelivered',
])

export type SMSStatus = z.infer<typeof smsStatusSchema>

// SMS log schema for Firestore
export const smsLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  appointmentId: z.string(),
  phoneNumber: z.string(),
  message: z.string(),
  status: smsStatusSchema.default('pending'),
  twilioSid: z.string().optional(),
  errorCode: z.string().optional(),
  errorMessage: z.string().optional(),
  sentAt: z.date().optional(),
  deliveredAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type SMSLog = z.infer<typeof smsLogSchema>

// SMS log creation input
export const createSMSLogSchema = smsLogSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  twilioSid: true,
  errorCode: true,
  errorMessage: true,
  sentAt: true,
  deliveredAt: true,
})

export type CreateSMSLogInput = z.infer<typeof createSMSLogSchema>

// Twilio webhook payload
export const twilioWebhookSchema = z.object({
  MessageSid: z.string(),
  MessageStatus: z.enum([
    'accepted',
    'queued',
    'sending',
    'sent',
    'delivered',
    'undelivered',
    'failed',
  ]),
  ErrorCode: z.string().optional(),
  ErrorMessage: z.string().optional(),
})

export type TwilioWebhookPayload = z.infer<typeof twilioWebhookSchema>
