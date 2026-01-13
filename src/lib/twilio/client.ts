// Twilio Client - Server only
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_PHONE_NUMBER

if (!accountSid || !authToken || !fromNumber) {
  console.warn('Twilio credentials not configured')
}

export const twilioClient = twilio(accountSid, authToken)

export interface SendSMSOptions {
  to: string
  body: string
  statusCallback?: string
}

export async function sendSMS({ to, body, statusCallback }: SendSMSOptions) {
  if (!fromNumber) {
    throw new Error('TWILIO_PHONE_NUMBER is not configured')
  }

  const message = await twilioClient.messages.create({
    body,
    from: fromNumber,
    to,
    statusCallback,
  })

  return {
    sid: message.sid,
    status: message.status,
    to: message.to,
    body: message.body,
  }
}
