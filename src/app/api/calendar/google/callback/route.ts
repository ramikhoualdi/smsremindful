import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getTokensFromCode } from '@/lib/google/oauth'
import { getUserInfo } from '@/lib/google/calendar'
import { getOrCreateUser, updateCalendarConnection } from '@/features/auth/server/user-service'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=oauth_denied', request.url)
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=missing_params', request.url)
      )
    }

    // Verify state contains valid user info
    let stateData: { clerkId: string }
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString())
    } catch {
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=invalid_state', request.url)
      )
    }

    // Verify current user matches state
    const { userId: currentUserId } = await auth()
    if (!currentUserId || currentUserId !== stateData.clerkId) {
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=user_mismatch', request.url)
      )
    }

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code)

    if (!tokens.access_token || !tokens.refresh_token) {
      console.error('Missing tokens from Google:', tokens)
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=missing_tokens', request.url)
      )
    }

    // Get user's Google email
    const googleUser = await getUserInfo(tokens.access_token, tokens.refresh_token)

    // Get or create user in Firestore
    const user = await getOrCreateUser(
      currentUserId,
      googleUser.email || '',
      googleUser.name || ''
    )

    // Update calendar connection
    await updateCalendarConnection(user.id, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      email: googleUser.email || undefined,
    })

    // Redirect back to settings with success
    return NextResponse.redirect(
      new URL('/dashboard/settings?success=calendar_connected', request.url)
    )
  } catch (error) {
    console.error('Error handling Google OAuth callback:', error)
    return NextResponse.redirect(
      new URL('/dashboard/settings?error=callback_failed', request.url)
    )
  }
}
