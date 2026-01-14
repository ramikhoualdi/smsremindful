import { auth, currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getOrCreateUser } from '@/features/auth/server/user-service'
import { getAppointmentsByUserId } from '@/features/appointments/server/appointment-service'
import { format } from 'date-fns'

export default async function AppointmentsPage() {
  const { userId } = await auth()
  const clerkUser = await currentUser()

  if (!userId || !clerkUser) {
    return null
  }

  const user = await getOrCreateUser(
    userId,
    clerkUser.emailAddresses[0]?.emailAddress || '',
    clerkUser.fullName || clerkUser.firstName || ''
  )

  const appointments = await getAppointmentsByUserId(user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">
            {appointments.length > 0
              ? `${appointments.length} upcoming appointment${appointments.length !== 1 ? 's' : ''}`
              : 'View and manage your synced appointments'}
          </p>
        </div>
        {user.calendarConnected && (
          <Button asChild>
            <Link href="/dashboard/settings">Sync Calendar</Link>
          </Button>
        )}
      </div>

      {!user.calendarConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Calendar</CardTitle>
            <CardDescription>
              Connect your Google Calendar to sync appointments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Once connected, your appointments will appear here with patient names,
              phone numbers, and scheduled times.
            </p>
            <Button asChild>
              <Link href="/dashboard/settings">Go to Settings</Link>
            </Button>
          </CardContent>
        </Card>
      ) : appointments.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Upcoming Appointments</CardTitle>
            <CardDescription>
              Your calendar is connected but no appointments were found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Try syncing your calendar again or add appointments to your Google Calendar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="font-medium">{appointment.patientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.patientPhone || 'No phone number'}
                  </p>
                  {appointment.location && (
                    <p className="text-sm text-muted-foreground">
                      {appointment.location}
                    </p>
                  )}
                </div>
                <div className="text-right space-y-1">
                  <p className="font-medium">
                    {format(appointment.appointmentTime, 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(appointment.appointmentTime, 'h:mm a')} -{' '}
                    {format(appointment.endTime, 'h:mm a')}
                  </p>
                  <Badge
                    variant={appointment.reminderSent ? 'default' : 'secondary'}
                  >
                    {appointment.reminderSent ? 'Reminder Sent' : 'Pending'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
