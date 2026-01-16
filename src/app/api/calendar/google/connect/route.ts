import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUrl } from '@/lib/google/oauth'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get optional redirect parameter
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/dashboard/settings'

    // Create state with user ID and redirect URL for callback
    const state = Buffer.from(JSON.stringify({
      clerkId: userId,
      redirectTo,
    })).toString('base64')

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
