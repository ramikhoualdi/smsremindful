// Twilio Client - Server only (lazy initialization)
import twilio from 'twilio'

let twilioClient: ReturnType<typeof twilio> | null = null

function getTwilioClient() {
  if (twilioClient) {
    return twilioClient
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN

  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.')
  }

  twilioClient = twilio(accountSid, authToken)
  return twilioClient
}

function getMessagingServiceSid(): string | undefined {
  return process.env.TWILIO_MESSAGING_SERVICE_SID
}

function getTwilioPhoneNumber(): string | undefined {
  return process.env.TWILIO_PHONE_NUMBER
}

export interface SendSMSOptions {
  to: string
  body: string
  statusCallback?: string
}

export interface SendSMSResult {
  success: boolean
  sid?: string
  status?: string
  error?: string
}

export async function sendSMS({ to, body, statusCallback }: SendSMSOptions): Promise<SendSMSResult> {
  try {
    const client = getTwilioClient()
    const messagingServiceSid = getMessagingServiceSid()
    const fromNumber = getTwilioPhoneNumber()

    // Prefer Messaging Service (better for A2P 10DLC compliance)
    // Fall back to phone number if Messaging Service not configured
    if (!messagingServiceSid && !fromNumber) {
      throw new Error('Either TWILIO_MESSAGING_SERVICE_SID or TWILIO_PHONE_NUMBER must be configured')
    }

    const messageOptions: Record<string, string> = {
      body,
      to,
    }

    if (messagingServiceSid) {
      messageOptions.messagingServiceSid = messagingServiceSid
    } else if (fromNumber) {
      messageOptions.from = fromNumber
    }

    if (statusCallback) {
      messageOptions.statusCallback = statusCallback
    }

    const message = await client.messages.create(messageOptions)

    return {
      success: true,
      sid: message.sid,
      status: message.status,
    }
  } catch (error) {
    console.error('Failed to send SMS:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Check if Twilio is configured (for UI display)
export function isTwilioConfigured(): boolean {
  const hasCredentials = !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN
  )
  const hasSender = !!(
    process.env.TWILIO_MESSAGING_SERVICE_SID ||
    process.env.TWILIO_PHONE_NUMBER
  )
  return hasCredentials && hasSender
}
