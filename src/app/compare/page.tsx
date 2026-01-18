import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, X, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CTASection } from '@/components/layout/CTASection'

export const metadata: Metadata = {
  title: 'Compare SMS Remindful vs Weave vs Solutionreach',
  description:
    'Compare SMS Remindful to Weave, Solutionreach, and other appointment reminder solutions. See pricing, features, and find the best fit for your business.',
  keywords: [
    'Weave alternative',
    'Solutionreach alternative',
    'appointment reminder software comparison',
    'SMS reminder comparison',
    'dental reminder software',
    'affordable appointment reminders',
  ],
  openGraph: {
    title: 'Compare SMS Remindful vs Weave vs Solutionreach',
    description:
      'Find the best appointment reminder solution for your business. Compare pricing, features, and contracts.',
  },
}

const competitors = [
  {
    name: 'SMS Remindful',
    highlight: true,
    pricing: {
      starting: '$49/mo',
      range: '$49 - $149/mo',
    },
    contract: 'No contract',
    trialDays: '7 days free',
    creditCard: 'No card required',
    features: {
      smsReminders: true,
      googleCalendar: true,
      outlookCalendar: 'coming',
      customTemplates: true,
      multipleTimings: true,
      analytics: true,
      twoWaySms: 'coming',
      emailReminders: 'coming',
      phoneReminders: false,
      reviewRequests: false,
      paymentProcessing: false,
      patientForms: false,
      teamChat: false,
      voip: false,
    },
  },
  {
    name: 'Weave',
    highlight: false,
    pricing: {
      starting: '$300+/mo',
      range: '$300 - $400/mo',
    },
    contract: '12-24 month contract',
    trialDays: 'Demo only',
    creditCard: 'Required',
    features: {
      smsReminders: true,
      googleCalendar: false,
      outlookCalendar: false,
      customTemplates: true,
      multipleTimings: true,
      analytics: true,
      twoWaySms: true,
      emailReminders: true,
      phoneReminders: true,
      reviewRequests: true,
      paymentProcessing: true,
      patientForms: true,
      teamChat: true,
      voip: true,
    },
  },
  {
    name: 'Solutionreach',
    highlight: false,
    pricing: {
      starting: '$329/mo',
      range: '$329 - $500+/mo',
    },
    contract: '12+ month contract',
    trialDays: 'Demo only',
    creditCard: 'Required',
    features: {
      smsReminders: true,
      googleCalendar: false,
      outlookCalendar: false,
      customTemplates: true,
      multipleTimings: true,
      analytics: true,
      twoWaySms: true,
      emailReminders: true,
      phoneReminders: true,
      reviewRequests: true,
      paymentProcessing: true,
      patientForms: true,
      teamChat: false,
      voip: false,
    },
  },
]

const featureLabels: Record<string, string> = {
  smsReminders: 'SMS Reminders',
  googleCalendar: 'Google Calendar Sync',
  outlookCalendar: 'Outlook Calendar Sync',
  customTemplates: 'Custom Templates',
  multipleTimings: 'Multiple Reminder Times',
  analytics: 'Dashboard & Analytics',
  twoWaySms: 'Two-Way SMS',
  emailReminders: 'Email Reminders',
  phoneReminders: 'Phone Call Reminders',
  reviewRequests: 'Review Requests',
  paymentProcessing: 'Payment Processing',
  patientForms: 'Digital Forms',
  teamChat: 'Team Chat',
  voip: 'VoIP Phone System',
}

function FeatureIcon({ value }: { value: boolean | string }) {
  if (value === true) {
    return <Check className="h-5 w-5 text-green-600" />
  }
  if (value === 'coming') {
    return <span className="text-xs text-muted-foreground">Coming soon</span>
  }
  return <X className="h-5 w-5 text-muted-foreground/40" />
}

export default function ComparePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Compare Appointment Reminder Solutions
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            See how SMS Remindful compares to Weave, Solutionreach, and other
            enterprise solutions. Find the right fit for your business and
            budget.
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

      {/* Quick Comparison */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-center mb-12">
            Quick Comparison
          </h2>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {competitors.map((comp) => (
              <div
                key={comp.name}
                className={`rounded-xl border p-6 ${
                  comp.highlight
                    ? 'border-primary bg-primary/5 ring-2 ring-primary'
                    : 'bg-card'
                }`}
              >
                {comp.highlight && (
                  <span className="inline-block text-xs font-semibold text-primary mb-2">
                    RECOMMENDED
                  </span>
                )}
                <h3 className="text-xl font-semibold mb-2">{comp.name}</h3>
                <div className="text-3xl font-bold mb-1">
                  {comp.pricing.starting}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {comp.pricing.range}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {comp.contract === 'No contract' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/40" />
                    )}
                    <span>{comp.contract}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {comp.trialDays.includes('free') ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground/40" />
                    )}
                    <span>{comp.trialDays}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {comp.creditCard === 'No card required' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/40" />
                    )}
                    <span>{comp.creditCard}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <h2 className="text-2xl font-bold text-center mb-8">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4 font-medium">Feature</th>
                  {competitors.map((comp) => (
                    <th
                      key={comp.name}
                      className={`text-center py-4 px-4 font-medium ${
                        comp.highlight ? 'bg-primary/5' : ''
                      }`}
                    >
                      {comp.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(featureLabels).map(([key, label]) => (
                  <tr key={key} className="border-b">
                    <td className="py-4 px-4 text-sm">{label}</td>
                    {competitors.map((comp) => (
                      <td
                        key={comp.name}
                        className={`text-center py-4 px-4 ${
                          comp.highlight ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex justify-center">
                          <FeatureIcon
                            value={
                              comp.features[key as keyof typeof comp.features]
                            }
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why SMS Remindful */}
      <section className="px-6 py-16 bg-muted/30">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-12">
            Why Choose SMS Remindful?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">
                  5-7x More Affordable
                </h3>
                <p className="text-muted-foreground">
                  While Weave and Solutionreach charge $300-500/month, SMS
                  Remindful starts at just $49/month. You get the core feature
                  you need (SMS reminders) without paying for features you
                  won&apos;t use.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">No Long-Term Contracts</h3>
                <p className="text-muted-foreground">
                  Unlike enterprise solutions that lock you into 12-24 month
                  contracts, SMS Remindful is month-to-month. Cancel anytime
                  with no penalties.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Works With Google Calendar
                </h3>
                <p className="text-muted-foreground">
                  Many businesses already use Google Calendar. SMS Remindful
                  connects directly - no need to learn new software or migrate
                  your scheduling system.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Set Up in 5 Minutes</h3>
                <p className="text-muted-foreground">
                  Enterprise solutions require lengthy onboarding and training.
                  SMS Remindful is simple: connect your calendar, set your
                  reminder times, and you&apos;re done.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Free Trial, No Card Required</h3>
                <p className="text-muted-foreground">
                  Try SMS Remindful free for 7 days with 20 SMS credits. No
                  credit card needed. See the value before you pay anything.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Focused on What Matters
                </h3>
                <p className="text-muted-foreground">
                  We do one thing really well: automated SMS appointment
                  reminders. No bloat, no complexity, no features you&apos;ll
                  never use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best For Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-green-200 bg-green-50/50 p-6">
              <h3 className="font-semibold text-green-800 mb-4">
                SMS Remindful is Best For:
              </h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    Small to medium businesses that need simple SMS reminders
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Practices already using Google Calendar</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Budget-conscious businesses ($49-149/mo vs $300+/mo)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Anyone who wants to avoid long-term contracts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    Dental practices, salons, consultants, coaches, therapists
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
              <h3 className="font-semibold text-amber-800 mb-4">
                Consider Weave/Solutionreach If You Need:
              </h3>
              <ul className="space-y-2 text-sm text-amber-700">
                <li className="flex items-start gap-2">
                  <Minus className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    Full practice management suite (phones, payments, forms)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Minus className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>VoIP phone system integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <Minus className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    Direct integration with Dentrix, Eaglesoft, or Open Dental
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Minus className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Team chat and internal communication tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <Minus className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Enterprise-level support and training</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        secondaryCta={{ text: 'View Pricing', href: '/pricing' }}
        showEmail
      />
      </main>
      <Footer />
    </div>
  )
}
