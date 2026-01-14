import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getUserByClerkId, updateUser } from '@/features/auth/server/user-service'
import { sendSMS } from '@/lib/twilio/client'
import { createSMSLog } from '@/features/sms/server/sms-log-service'

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

    const body = await request.json()
    const parsed = testSMSSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      )
    }

    const testMessage = `SMS Remindful: This is a test message. Your SMS integration is working correctly! Reply STOP to opt out.`

    console.log('Sending test SMS to:', parsed.data.phoneNumber)

    const result = await sendSMS({
      to: parsed.data.phoneNumber,
      body: testMessage,
    })

    // Log the test message
    await createSMSLog({
      userId: user.id,
      appointmentId: 'test',
      phoneNumber: parsed.data.phoneNumber,
      message: testMessage,
      status: result.success ? 'sent' : 'failed',
      twilioSid: result.sid,
      error: result.error,
      sentAt: result.success ? new Date() : undefined,
    })

    if (result.success) {
      console.log('Test SMS sent successfully:', result.sid)

      // Decrement SMS credits for trial users
      if (user.subscriptionStatus === 'trial' && user.smsCreditsRemaining > 0) {
        await updateUser(user.id, {
          smsCreditsRemaining: user.smsCreditsRemaining - 1,
        })
        console.log(`Decremented SMS credits for user ${user.id}: ${user.smsCreditsRemaining} -> ${user.smsCreditsRemaining - 1}`)
      }

      return NextResponse.json({
        success: true,
        message: 'Test SMS sent successfully!',
        sid: result.sid,
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
