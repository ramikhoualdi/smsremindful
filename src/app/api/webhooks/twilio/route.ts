import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import { updateSMSLogByTwilioSid } from '@/features/sms/server/sms-log-service'
import type { SMSStatus } from '@/features/sms/types'

export const runtime = 'nodejs'

// Twilio status values mapped to our status types
const TWILIO_STATUS_MAP: Record<string, SMSStatus> = {
  queued: 'queued',
  sending: 'sending',
  sent: 'sent',
  delivered: 'delivered',
  undelivered: 'undelivered',
  failed: 'failed',
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature validation
    const body = await request.text()
    const params = new URLSearchParams(body)

    // Extract Twilio signature
    const twilioSignature = request.headers.get('x-twilio-signature')
    if (!twilioSignature) {
      console.error('Missing Twilio signature')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Validate the request is from Twilio
    const authToken = process.env.TWILIO_AUTH_TOKEN
    if (!authToken) {
      console.error('TWILIO_AUTH_TOKEN not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Build the full URL for validation
    const url = request.url

    // Convert URLSearchParams to object for validation
    const paramsObject: Record<string, string> = {}
    params.forEach((value, key) => {
      paramsObject[key] = value
    })

    // Validate Twilio signature
    const isValid = twilio.validateRequest(
      authToken,
      twilioSignature,
      url,
      paramsObject
    )

    if (!isValid) {
      console.error('Invalid Twilio signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    // Extract status update data from Twilio callback
    const messageSid = params.get('MessageSid')
    const messageStatus = params.get('MessageStatus')
    const errorCode = params.get('ErrorCode')
    const errorMessage = params.get('ErrorMessage')

    if (!messageSid || !messageStatus) {
      console.error('Missing required fields:', { messageSid, messageStatus })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Map Twilio status to our status type
    const status = TWILIO_STATUS_MAP[messageStatus.toLowerCase()]
    if (!status) {
      console.warn(`Unknown Twilio status: ${messageStatus}`)
      // Still return 200 to acknowledge receipt
      return NextResponse.json({ received: true, warning: 'Unknown status' })
    }

    // Prepare additional data based on status
    const additionalData: {
      error?: string
      errorCode?: string
      twilioErrorMessage?: string
      deliveredAt?: Date
    } = {}

    // Set deliveredAt for delivered status
    if (status === 'delivered') {
      additionalData.deliveredAt = new Date()
    }

    // Set error info for failed/undelivered
    if (status === 'failed' || status === 'undelivered') {
      if (errorCode) {
        additionalData.errorCode = errorCode
      }
      if (errorMessage) {
        additionalData.twilioErrorMessage = errorMessage
        additionalData.error = `${errorCode || 'Error'}: ${errorMessage}`
      }
    }

    // Update the SMS log
    const updated = await updateSMSLogByTwilioSid(messageSid, status, additionalData)

    if (updated) {
      console.log(`SMS status updated: ${messageSid} -> ${status}`)
    } else {
      console.warn(`SMS log not found for SID: ${messageSid}`)
    }

    // Always return 200 to Twilio (they'll retry on non-2xx)
    return NextResponse.json({ received: true, status })
  } catch (error) {
    console.error('Twilio webhook error:', error)
    // Return 200 even on error to prevent Twilio retries for processing errors
    return NextResponse.json({ received: true, error: 'Processing error' })
  }
}

// Handle GET requests (Twilio sometimes pings the endpoint)
export async function GET() {
  return NextResponse.json({ status: 'Twilio webhook endpoint active' })
}
