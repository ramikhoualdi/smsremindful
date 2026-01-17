import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Calendar,
  MessageSquare,
  Clock,
  BarChart3,
  Settings,
  Shield,
  Smartphone,
  Bell,
  Check,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Features - Automated SMS Appointment Reminders',
  description:
    'Explore SMS Remindful features: Google Calendar sync, customizable SMS templates, flexible reminder schedules, analytics dashboard, and TCPA compliance. Reduce no-shows automatically.',
  keywords: [
    'SMS reminder features',
    'appointment reminder software features',
    'Google Calendar SMS integration',
    'automated text reminders',
    'customizable SMS templates',
    'appointment analytics',
  ],
  openGraph: {
    title: 'Features - SMS Remindful',
    description:
      'Automated SMS appointment reminders with Google Calendar sync, custom templates, and analytics.',
  },
}

const coreFeatures = [
  {
    icon: Calendar,
    title: 'Google Calendar Sync',
    description:
      'Connect your Google Calendar in one click. Appointments sync automatically - no manual data entry required.',
    details: [
      'One-click OAuth connection',
      'Automatic appointment import',
      'Extracts client names and phone numbers',
      'Real-time sync updates',
    ],
  },
  {
    icon: MessageSquare,
    title: 'Customizable SMS Templates',
    description:
      'Create personalized reminder messages that match your brand voice. Use variables for dynamic content.',
    details: [
      'Pre-built templates included',
      'Custom message creation',
      'Variable placeholders (name, time, date)',
      'Preview before sending',
    ],
  },
  {
    icon: Clock,
    title: 'Flexible Reminder Schedules',
    description:
      'Send reminders at the perfect times. Configure 1 week, 1 day, or same-day reminders - or all three.',
    details: [
      '1 week before appointment',
      '1 day before appointment',
      'Same day morning reminder',
      'Enable/disable each timing',
    ],
  },
  {
    icon: Zap,
    title: 'Fully Automated',
    description:
      'Set it and forget it. Once configured, reminders are sent automatically without any manual intervention.',
    details: [
      'Daily automated checks',
      'No manual sending required',
      'Works 24/7 in background',
      'Duplicate prevention built-in',
    ],
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Track your reminder performance. See how many messages were sent, delivery rates, and more.',
    details: [
      'Messages sent count',
      'Delivery success rate',
      'Upcoming appointments view',
      'SMS credits tracking',
    ],
  },
  {
    icon: Shield,
    title: 'Compliance Built-In',
    description:
      'Stay compliant with US messaging regulations. TCPA opt-out handling and A2P 10DLC registration included.',
    details: [
      'Automatic opt-out text',
      'STOP keyword handling',
      'A2P 10DLC registered',
      'No PHI transmitted',
    ],
  },
]

const additionalFeatures = [
  {
    icon: Smartphone,
    title: 'Phone Number Editing',
    description:
      'Easily add or update client phone numbers directly from your dashboard.',
  },
  {
    icon: Bell,
    title: 'Test SMS',
    description:
      'Send test messages to verify your setup before going live with clients.',
  },
  {
    icon: Settings,
    title: 'Clinic Profile',
    description:
      'Configure your business name, phone, and address for personalized messages.',
  },
]

const comingSoonFeatures = [
  {
    title: 'Outlook Calendar Sync',
    description: 'Connect Microsoft Outlook and Office 365 calendars.',
    eta: 'Q2 2025',
  },
  {
    title: 'Two-Way SMS',
    description: 'Let clients confirm or cancel appointments via text reply.',
    eta: 'Q2 2025',
  },
  {
    title: 'Email Reminders',
    description: 'Send email reminders alongside SMS for maximum reach.',
    eta: 'Q3 2025',
  },
  {
    title: 'Custom Schedules',
    description: 'Set any reminder timing (2 days, 3 hours, etc.).',
    eta: 'Q3 2025',
  },
]

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Everything You Need to Reduce No-Shows
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            SMS Remindful is designed to be simple yet powerful. Connect your
            calendar, configure your reminders, and let automation do the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/sign-up">Start Free Trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-center mb-4">Core Features</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Everything you need to automate appointment reminders and reduce
            no-shows at your practice.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="w-4 h-4 text-green-600 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="px-6 py-16 bg-muted/30">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-12">
            Plus These Helpful Extras
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {additionalFeatures.map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-4">Coming Soon</h2>
          <p className="text-center text-muted-foreground mb-12">
            We&apos;re constantly improving SMS Remindful. Here&apos;s what&apos;s on our
            roadmap.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {comingSoonFeatures.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 p-4 rounded-lg border border-dashed"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">
                      {feature.eta}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Plans Include */}
      <section className="px-6 py-16 bg-muted/30">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-8">All Plans Include</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {[
              'Google Calendar sync',
              'Customizable templates',
              'Automated scheduling',
              'Dashboard analytics',
              'TCPA-compliant opt-out',
              'No contracts',
              'Email support',
              '7-day free trial',
              'Cancel anytime',
            ].map((item) => (
              <div key={item} className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Automate Your Reminders?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join businesses that have reduced no-shows by up to 50% with
            automated SMS reminders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/sign-up">Start Free Trial</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/compare">Compare Solutions</Link>
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-75">
            7-day free trial with 20 SMS credits. No credit card required.
          </p>
        </div>
      </section>
    </main>
  )
}
