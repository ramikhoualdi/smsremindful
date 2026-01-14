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
    console.log('Exchanging code for tokens...')
    let tokens
    try {
      tokens = await getTokensFromCode(code)
      console.log('Tokens received:', { hasAccessToken: !!tokens.access_token, hasRefreshToken: !!tokens.refresh_token })
    } catch (tokenError) {
      console.error('Token exchange failed:', tokenError)
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=token_exchange_failed', request.url)
      )
    }

    if (!tokens.access_token || !tokens.refresh_token) {
      console.error('Missing tokens from Google:', tokens)
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=missing_tokens', request.url)
      )
    }

    // Get user's Google email
    console.log('Getting Google user info...')
    let googleUser
    try {
      googleUser = await getUserInfo(tokens.access_token, tokens.refresh_token)
      console.log('Google user:', googleUser.email)
    } catch (userInfoError) {
      console.error('Failed to get Google user info:', userInfoError)
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=user_info_failed', request.url)
      )
    }

    // Get or create user in Firestore
    console.log('Getting/creating user in Firestore...')
    let user
    try {
      user = await getOrCreateUser(
        currentUserId,
        googleUser.email || '',
        googleUser.name || ''
      )
      console.log('User ID:', user.id)
    } catch (firestoreError) {
      console.error('Firestore user operation failed:', firestoreError)
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=firestore_user_failed', request.url)
      )
    }

    // Update calendar connection
    console.log('Updating calendar connection...')
    try {
      await updateCalendarConnection(user.id, {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        email: googleUser.email || undefined,
      })
      console.log('Calendar connection updated successfully')
    } catch (updateError) {
      console.error('Failed to update calendar connection:', updateError)
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=update_connection_failed', request.url)
      )
    }

    // Redirect back to settings with success
    return NextResponse.redirect(
      new URL('/dashboard/settings?success=calendar_connected', request.url)
    )
  } catch (error) {
    console.error('Unexpected error in OAuth callback:', error)
    return NextResponse.redirect(
      new URL('/dashboard/settings?error=callback_failed', request.url)
    )
  }
}
