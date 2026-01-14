import { google, calendar_v3 } from 'googleapis'
import { getAuthenticatedClient } from './oauth'

export interface CalendarEvent {
  id: string
  summary: string | null
  description: string | null
  start: Date
  end: Date
  attendees: Array<{
    email: string
    displayName?: string
    responseStatus?: string
  }>
  location?: string
}

export async function getCalendarEvents(
  accessToken: string,
  refreshToken: string,
  options: {
    timeMin?: Date
    timeMax?: Date
    maxResults?: number
  } = {}
): Promise<CalendarEvent[]> {
  const oauth2Client = getAuthenticatedClient(accessToken, refreshToken)
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: (options.timeMin || now).toISOString(),
    timeMax: (options.timeMax || thirtyDaysFromNow).toISOString(),
    maxResults: options.maxResults || 100,
    singleEvents: true,
    orderBy: 'startTime',
  })

  const events = response.data.items || []

  return events
    .filter((event): event is calendar_v3.Schema$Event & { id: string } => {
      // Filter out all-day events and events without proper times
      return !!(event.id && event.start?.dateTime && event.end?.dateTime)
    })
    .map((event) => ({
      id: event.id,
      summary: event.summary || null,
      description: event.description || null,
      start: new Date(event.start!.dateTime!),
      end: new Date(event.end!.dateTime!),
      attendees: (event.attendees || []).map((a) => ({
        email: a.email || '',
        displayName: a.displayName || undefined,
        responseStatus: a.responseStatus || undefined,
      })),
      location: event.location || undefined,
    }))
}

export async function getUserInfo(accessToken: string, refreshToken: string) {
  const oauth2Client = getAuthenticatedClient(accessToken, refreshToken)
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
  const { data } = await oauth2.userinfo.get()
  return {
    email: data.email,
    name: data.name,
    picture: data.picture,
  }
}
