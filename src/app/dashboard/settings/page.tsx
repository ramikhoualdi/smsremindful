import { auth, currentUser } from '@clerk/nextjs/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CalendarConnection } from '@/features/calendar-sync/components/CalendarConnection'
import { getOrCreateUser } from '@/features/auth/server/user-service'

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const { userId } = await auth()
  const clerkUser = await currentUser()
  const params = await searchParams

  if (!userId || !clerkUser) {
    return null
  }

  // Get or create user in Firestore
  const user = await getOrCreateUser(
    userId,
    clerkUser.emailAddresses[0]?.emailAddress || '',
    clerkUser.fullName || clerkUser.firstName || ''
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your clinic profile and integrations
        </p>
      </div>

      {params.success === 'calendar_connected' && (
        <div className="rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          Google Calendar connected successfully! Click &quot;Sync Now&quot; to import your appointments.
        </div>
      )}

      {params.error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {getErrorMessage(params.error)}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Clinic Information</CardTitle>
          <CardDescription>
            This information is used in your SMS templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="clinicName">Clinic Name</Label>
            <Input
              id="clinicName"
              placeholder="Your Dental Practice"
              defaultValue={user.clinicName || ''}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="clinicPhone">Clinic Phone</Label>
            <Input
              id="clinicPhone"
              placeholder="+1 (555) 123-4567"
              defaultValue={user.clinicPhone || ''}
            />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calendar Integration</CardTitle>
          <CardDescription>
            Connect your calendar to automatically sync appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarConnection
            isConnected={user.calendarConnected}
            connectedEmail={user.googleEmail}
            lastSyncedAt={user.lastCalendarSync}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  )
}

function getErrorMessage(error: string): string {
  switch (error) {
    case 'oauth_denied':
      return 'You denied access to Google Calendar. Please try again if you want to connect.'
    case 'missing_params':
      return 'Invalid OAuth response. Please try connecting again.'
    case 'invalid_state':
      return 'Security validation failed. Please try connecting again.'
    case 'user_mismatch':
      return 'User session mismatch. Please sign in again and try connecting.'
    case 'missing_tokens':
      return 'Failed to get access tokens from Google. Please try again.'
    case 'callback_failed':
      return 'Failed to complete the connection. Please try again.'
    default:
      return 'An error occurred. Please try again.'
  }
}
