import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getUserByClerkId, updateLastCalendarSync } from '@/features/auth/server/user-service'
import { getCalendarEvents } from '@/lib/google/calendar'
import { syncCalendarEvents } from '@/features/appointments/server/appointment-service'

export async function POST() {
  try {
    console.log('Starting calendar sync...')
    const { userId } = await auth()

    if (!userId) {
      console.log('Sync failed: No user ID')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Getting user from Firestore...')
    const user = await getUserByClerkId(userId)
    if (!user) {
      console.log('Sync failed: User not found in Firestore')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('User found:', { id: user.id, calendarConnected: user.calendarConnected })

    if (!user.calendarConnected || !user.googleAccessToken || !user.googleRefreshToken) {
      console.log('Sync failed: Calendar not connected or missing tokens')
      return NextResponse.json(
        { error: 'Calendar not connected' },
        { status: 400 }
      )
    }

    // Fetch events from Google Calendar (next 30 days)
    console.log('Fetching events from Google Calendar...')
    const events = await getCalendarEvents(
      user.googleAccessToken,
      user.googleRefreshToken,
      {
        timeMin: new Date(),
        timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        maxResults: 100,
      }
    )
    console.log(`Found ${events.length} events from Google Calendar`)

    // Sync events to Firestore
    console.log('Syncing events to Firestore...')
    const result = await syncCalendarEvents(user.id, events)
    console.log('Sync result:', result)

    // Update last sync time
    await updateLastCalendarSync(user.id)
    console.log('Calendar sync completed successfully')

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
