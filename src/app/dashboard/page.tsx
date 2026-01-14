import { auth, currentUser } from '@clerk/nextjs/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getOrCreateUser } from '@/features/auth/server/user-service'
import { getAppointmentsByUserId } from '@/features/appointments/server/appointment-service'
import { getSMSLogsByUserId, getSMSStats } from '@/features/sms/server/sms-log-service'
import { differenceInDays, isToday } from 'date-fns'

export default async function DashboardPage() {
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

  // Fetch real data
  const [appointments, smsLogs, smsStats] = await Promise.all([
    getAppointmentsByUserId(user.id),
    getSMSLogsByUserId(user.id, 10),
    getSMSStats(user.id),
  ])

  // Calculate stats
  const trialDaysRemaining = user.trialEndsAt
    ? Math.max(0, differenceInDays(user.trialEndsAt, new Date()))
    : 0
  const isOnTrial = user.subscriptionStatus === 'trial'
  const remindersSentToday = smsLogs.filter(
    (log) => log.sentAt && isToday(log.sentAt)
  ).length

  const stats = {
    upcomingAppointments: appointments.length,
    remindersSentToday,
    smsCreditsRemaining: user.smsCreditsRemaining || 0,
    trialDaysRemaining,
    isOnTrial,
    totalSent: smsStats.total,
    deliveryRate: smsStats.total > 0
      ? Math.round((smsStats.delivered / smsStats.total) * 100)
      : 0,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to SMS Remindful. Manage your appointment reminders.
          </p>
        </div>
        {stats.isOnTrial && (
          <Badge variant="secondary">
            Trial: {stats.trialDaysRemaining} days | {stats.smsCreditsRemaining} SMS left
          </Badge>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Next 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reminders Sent Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.remindersSentToday}</div>
            <p className="text-xs text-muted-foreground">
              SMS messages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              SMS Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.smsCreditsRemaining}</div>
            <p className="text-xs text-muted-foreground">
              Remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Calendar Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.calendarConnected ? 'Connected' : 'Not Connected'}
            </div>
            <p className="text-xs text-muted-foreground">
              {user.calendarConnected
                ? user.googleEmail
                : 'Connect to sync appointments'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with SMS Remindful</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              asChild
              variant={user.calendarConnected ? 'outline' : 'default'}
              className="w-full justify-start"
            >
              <Link href="/dashboard/settings">
                {user.calendarConnected ? '✓' : '1.'} Connect Google Calendar
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/templates">
                2. Create SMS Templates
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/reminders">
                3. Configure Reminder Schedule
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/appointments">
                4. Add Patient Phone Numbers
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest reminder activity</CardDescription>
          </CardHeader>
          <CardContent>
            {smsLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reminders sent yet. Connect your calendar to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {smsLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center justify-between text-sm">
                    <div className="truncate flex-1 mr-4">
                      <span className="font-medium">{log.phoneNumber}</span>
                      <span className="text-muted-foreground"> - {log.message.slice(0, 30)}...</span>
                    </div>
                    <Badge
                      variant={
                        log.status === 'delivered' ? 'default' :
                        log.status === 'sent' ? 'secondary' :
                        log.status === 'failed' ? 'destructive' : 'outline'
                      }
                      className="shrink-0"
                    >
                      {log.status}
                    </Badge>
                  </div>
                ))}
                {smsLogs.length > 5 && (
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link href="/dashboard/reminders">View all activity</Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
