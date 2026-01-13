import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function BillingPage() {
  // TODO: Fetch from Stripe
  const smsCreditsRemaining = 20

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Billing</h2>
        <p className="text-muted-foreground">
          Manage your subscription and payment methods
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Plan</CardTitle>
            <Badge variant="secondary">Trial</Badge>
          </div>
          <CardDescription>
            Your trial includes 7 days and 20 free SMS credits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Trial Days Remaining</p>
              <p className="text-2xl font-bold">7 days</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">SMS Credits Remaining</p>
              <p className="text-2xl font-bold">{smsCreditsRemaining}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Your trial ends when either the 7 days pass or you use all 20 SMS credits.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Starter</CardTitle>
            <CardDescription>For small practices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-3xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/month</span></p>
            </div>
            <ul className="space-y-2 text-sm">
              <li>Up to 100 SMS/month</li>
              <li>Google Calendar sync</li>
              <li>3 SMS templates</li>
              <li>Email support</li>
            </ul>
            <Button className="w-full">Upgrade to Starter</Button>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Professional</CardTitle>
              <Badge>Popular</Badge>
            </div>
            <CardDescription>For growing practices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-3xl font-bold">$79<span className="text-sm font-normal text-muted-foreground">/month</span></p>
            </div>
            <ul className="space-y-2 text-sm">
              <li>Unlimited SMS</li>
              <li>Google + Outlook sync</li>
              <li>Unlimited templates</li>
              <li>Priority support</li>
              <li>Analytics dashboard</li>
            </ul>
            <Button className="w-full">Upgrade to Professional</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
