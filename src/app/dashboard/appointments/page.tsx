import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">
            View and manage your synced appointments
          </p>
        </div>
        <Button>Sync Now</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>No Appointments</CardTitle>
          <CardDescription>
            Connect your Google Calendar to sync appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Once connected, your appointments will appear here with patient names,
            phone numbers, and scheduled times.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
