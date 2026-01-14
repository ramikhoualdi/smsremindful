import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getUserByClerkId } from '@/features/auth/server/user-service'
import {
  getReminderScheduleById,
  updateReminderSchedule,
  deleteReminderSchedule,
} from '@/features/sms/server/reminder-service'
import { updateReminderScheduleSchema } from '@/features/sms/types'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/reminders/[id] - Get a single reminder schedule
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserByClerkId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id } = await params
    const schedule = await getReminderScheduleById(id)

    if (!schedule || schedule.userId !== user.id) {
      return NextResponse.json(
        { error: 'Reminder schedule not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ schedule })
  } catch (error) {
    console.error('Error fetching reminder schedule:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reminder schedule' },
      { status: 500 }
    )
  }
}

// PATCH /api/reminders/[id] - Update a reminder schedule
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserByClerkId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = updateReminderScheduleSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    await updateReminderSchedule(id, user.id, parsed.data)
    const updated = await getReminderScheduleById(id)

    return NextResponse.json({ schedule: updated })
  } catch (error) {
    console.error('Error updating reminder schedule:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to update reminder schedule'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/reminders/[id] - Delete a reminder schedule
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserByClerkId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id } = await params
    await deleteReminderSchedule(id, user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting reminder schedule:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to delete reminder schedule'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
