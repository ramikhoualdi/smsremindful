import { auth, currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getOrCreateUser } from '@/features/auth/server/user-service'
import { getAppointmentsByUserId } from '@/features/appointments/server/appointment-service'
import { AppointmentList } from '@/features/appointments/components/AppointmentList'

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
  const missingPhoneCount = appointments.filter((a) => !a.patientPhone).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">
            {appointments.length > 0
              ? `${appointments.length} upcoming appointment${appointments.length !== 1 ? 's' : ''}${missingPhoneCount > 0 ? ` (${missingPhoneCount} missing phone)` : ''}`
              : 'View and manage your synced appointments'}
          </p>
        </div>
        {user.calendarConnected && (
          <Button asChild>
            <Link href="/dashboard/settings">Sync Calendar</Link>
          </Button>
        )}
      </div>

      <AppointmentList
        appointments={appointments}
        isCalendarConnected={user.calendarConnected}
      />
    </div>
  )
}
