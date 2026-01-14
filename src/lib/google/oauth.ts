import { google } from 'googleapis'

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly',
]

export function getGoogleOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/calendar/google/callback`

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials not configured')
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
}

export function getAuthUrl(state: string) {
  const oauth2Client = getGoogleOAuthClient()

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state,
    prompt: 'consent', // Force consent to get refresh token
  })
}

export async function getTokensFromCode(code: string) {
  const oauth2Client = getGoogleOAuthClient()
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

export function getAuthenticatedClient(accessToken: string, refreshToken?: string) {
  const oauth2Client = getGoogleOAuthClient()
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  })
  return oauth2Client
}
