import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getUserByClerkId, updateLastCalendarSync } from '@/features/auth/server/user-service'
import { getCalendarEvents } from '@/lib/google/calendar'
import { syncCalendarEvents } from '@/features/appointments/server/appointment-service'

export async function POST() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserByClerkId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.calendarConnected || !user.googleAccessToken || !user.googleRefreshToken) {
      return NextResponse.json(
        { error: 'Calendar not connected' },
        { status: 400 }
      )
    }

    // Fetch events from Google Calendar (next 30 days)
    const events = await getCalendarEvents(
      user.googleAccessToken,
      user.googleRefreshToken,
      {
        timeMin: new Date(),
        timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        maxResults: 100,
      }
    )

    // Sync events to Firestore
    const result = await syncCalendarEvents(user.id, events)

    // Update last sync time
    await updateLastCalendarSync(user.id)

    return NextResponse.json({
      success: true,
      ...result,
      totalEvents: events.length,
    })
  } catch (error) {
    console.error('Error syncing calendar:', error)
    return NextResponse.json(
      { error: 'Failed to sync calendar' },
      { status: 500 }
    )
  }
}
