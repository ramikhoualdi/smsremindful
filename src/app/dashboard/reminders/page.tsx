import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const reminderOptions = [
  { label: '1 week before', value: 'week', enabled: false },
  { label: '1 day before', value: 'day', enabled: true },
  { label: '1 hour before', value: 'hour', enabled: false },
]

export default function RemindersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reminder Settings</h2>
          <p className="text-muted-foreground">
            Configure when to send SMS reminders to patients
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reminder Schedule</CardTitle>
          <CardDescription>
            Choose when reminders should be sent before appointments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reminderOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-4">
                <span className="font-medium">{option.label}</span>
                {option.enabled && (
                  <Badge variant="default">Active</Badge>
                )}
              </div>
              <Button variant={option.enabled ? 'default' : 'outline'} size="sm">
                {option.enabled ? 'Disable' : 'Enable'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sent Reminders</CardTitle>
          <CardDescription>
            History of reminders sent to patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No reminders have been sent yet.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
