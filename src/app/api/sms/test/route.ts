import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getUserByClerkId, updateUser } from '@/features/auth/server/user-service'
import { sendSMS, getTwilioStatusCallbackUrl } from '@/lib/twilio/client'
import { createSMSLog } from '@/features/sms/server/sms-log-service'
import { isUSPhoneNumber, normalizeUSPhoneNumber, US_PHONE_ERROR } from '@/utils/phone'

const testSMSSchema = z.object({
  phoneNumber: z.string().min(10, 'Invalid phone number'),
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserByClerkId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has SMS credits
    if (user.smsCreditsRemaining <= 0) {
      // Smart error message based on subscription status
      if (user.subscriptionStatus === 'trial') {
        return NextResponse.json(
          {
            error: 'Your trial credits are used up. Subscribe to a plan to continue sending reminders.',
            code: 'TRIAL_CREDITS_EXHAUSTED',
            action: 'subscribe',
          },
          { status: 403 }
        )
      } else if (user.subscriptionStatus === 'active') {
        return NextResponse.json(
          {
            error: "You've used all your credits for this billing period. Upgrade your plan for more monthly credits.",
            code: 'PLAN_CREDITS_EXHAUSTED',
            action: 'upgrade',
          },
          { status: 403 }
        )
      } else {
        return NextResponse.json(
          {
            error: 'Your subscription is inactive. Subscribe to a plan to continue sending reminders.',
            code: 'SUBSCRIPTION_INACTIVE',
            action: 'subscribe',
          },
          { status: 403 }
        )
      }
    }

    const body = await request.json()
    const parsed = testSMSSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      )
    }

    // Validate US phone number
    if (!isUSPhoneNumber(parsed.data.phoneNumber)) {
      return NextResponse.json(
        { error: US_PHONE_ERROR },
        { status: 400 }
      )
    }

    // Normalize to E.164 format
    const normalizedPhone = normalizeUSPhoneNumber(parsed.data.phoneNumber)
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: 'Invalid US phone number format' },
        { status: 400 }
      )
    }

    const testMessage = `SMS Remindful: This is a test message. Your SMS integration is working correctly! Reply STOP to opt out.`

    console.log('Sending test SMS to:', normalizedPhone)

    // Send SMS with status callback for delivery tracking
    const result = await sendSMS({
      to: normalizedPhone,
      body: testMessage,
      statusCallback: getTwilioStatusCallbackUrl(),
    })

    // Log the test message
    await createSMSLog({
      userId: user.id,
      appointmentId: 'test',
      phoneNumber: normalizedPhone,
      message: testMessage,
      status: result.success ? 'sent' : 'failed',
      twilioSid: result.sid,
      error: result.error,
      sentAt: result.success ? new Date() : undefined,
    })

    if (result.success) {
      console.log('Test SMS sent successfully:', result.sid)

      // Decrement SMS credits for all users
      await updateUser(user.id, {
        smsCreditsRemaining: user.smsCreditsRemaining - 1,
      })
      console.log(`Decremented SMS credits for user ${user.id}: ${user.smsCreditsRemaining} -> ${user.smsCreditsRemaining - 1}`)

      return NextResponse.json({
        success: true,
        message: 'Test SMS sent successfully!',
        sid: result.sid,
        creditsRemaining: user.smsCreditsRemaining - 1,
      })
    } else {
      console.error('Test SMS failed:', result.error)
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error sending test SMS:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send test SMS' },
      { status: 500 }
    )
  }
}
