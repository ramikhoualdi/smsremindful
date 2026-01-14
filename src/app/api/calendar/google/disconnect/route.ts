import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getUserByClerkId, disconnectCalendar } from '@/features/auth/server/user-service'

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

    await disconnectCalendar(user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error disconnecting Google Calendar:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect calendar' },
      { status: 500 }
    )
  }
}
