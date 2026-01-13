import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const defaultTemplate = {
  name: 'Default Reminder',
  content: 'Hello {{patientName}}, this is a reminder for your appointment at {{clinicName}} on {{appointmentDate}} at {{appointmentTime}}. Reply YES to confirm.',
  isDefault: true,
}

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">SMS Templates</h2>
          <p className="text-muted-foreground">
            Create and manage your reminder message templates
          </p>
        </div>
        <Button>Create Template</Button>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{defaultTemplate.name}</CardTitle>
              {defaultTemplate.isDefault && (
                <Badge variant="secondary">Default</Badge>
              )}
            </div>
            <CardDescription>
              Available variables: {'{{patientName}}'}, {'{{clinicName}}'}, {'{{appointmentDate}}'}, {'{{appointmentTime}}'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm font-mono">{defaultTemplate.content}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="outline" size="sm">Preview</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
