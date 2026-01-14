import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getUserByClerkId } from '@/features/auth/server/user-service'
import {
  getReminderSchedulesByUserId,
  createReminderSchedule,
} from '@/features/sms/server/reminder-service'
import { createReminderScheduleSchema } from '@/features/sms/types'

// GET /api/reminders - List all reminder schedules for the user
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

    const schedules = await getReminderSchedulesByUserId(user.id)
    return NextResponse.json({ schedules })
  } catch (error) {
    console.error('Error fetching reminder schedules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reminder schedules' },
      { status: 500 }
    )
  }
}

// POST /api/reminders - Create a new reminder schedule
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
    const parsed = createReminderScheduleSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const schedule = await createReminderSchedule(user.id, parsed.data)
    return NextResponse.json({ schedule }, { status: 201 })
  } catch (error) {
    console.error('Error creating reminder schedule:', error)
    return NextResponse.json(
      { error: 'Failed to create reminder schedule' },
      { status: 500 }
    )
  }
}
