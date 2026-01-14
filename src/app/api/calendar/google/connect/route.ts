import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getAuthUrl } from '@/lib/google/oauth'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create state with user ID for callback verification
    const state = Buffer.from(JSON.stringify({ clerkId: userId })).toString('base64')

    const authUrl = getAuthUrl(state)

    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Error initiating Google OAuth:', error)
    return NextResponse.json(
      { error: 'Failed to initiate OAuth' },
      { status: 500 }
    )
  }
}
