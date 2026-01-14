import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getUserByClerkId, updateUser } from '@/features/auth/server/user-service'

const updateSettingsSchema = z.object({
  clinicName: z.string().optional(),
  clinicPhone: z.string().optional(),
})

// PATCH /api/settings - Update user settings
export async function PATCH(request: NextRequest) {
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
    const parsed = updateSettingsSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    await updateUser(user.id, {
      clinicName: parsed.data.clinicName,
      clinicPhone: parsed.data.clinicPhone,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

// GET /api/settings - Get user settings
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserByClerkId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      clinicName: user.clinicName,
      clinicPhone: user.clinicPhone,
      email: user.email,
      name: user.name,
      calendarConnected: user.calendarConnected,
      subscriptionStatus: user.subscriptionStatus,
      smsCreditsRemaining: user.smsCreditsRemaining,
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}
