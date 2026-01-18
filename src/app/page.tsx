import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar,
  MessageSquare,
  Zap,
  Check,
  ArrowRight,
  Clock,
  DollarSign,
  Users,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CTASection } from '@/components/layout/CTASection'

export default async function HomePage() {
  const { userId } = await auth()

  // If user is logged in, redirect to dashboard
  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-12 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              Built for appointment-based businesses
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Reduce No-Shows by Up to 50%
              <br />
              <span className="text-muted-foreground">
                with Automated SMS Reminders
              </span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect your Google Calendar, set up reminder templates, and let
              automation handle the rest. Perfect for dental practices, salons,
              consultants, coaches, and any appointment-based business.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/sign-up">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <a href="#pricing">View Pricing</a>
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-600" />
                7-day free trial
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-600" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-600" />
                Setup in 5 minutes
              </span>
            </div>

            {/* Price Anchor */}
            <p className="mt-8 text-sm text-muted-foreground">
              Starting at just{' '}
              <span className="font-semibold text-foreground">$49/month</span> —
              no contracts, no complex setup
            </p>
          </div>
        </section>

        {/* Industry Stats */}
        <section className="border-y bg-muted/30 px-6 py-12">
          <div className="mx-auto max-w-4xl">
            <p className="text-center text-sm text-muted-foreground mb-6">
              Industry research shows SMS reminders can significantly reduce no-shows
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">30-50%</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Fewer No-Shows*
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold">$200+</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Avg. No-Show Cost*
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold">5 min</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Setup Time
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Automated
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-6">
              *Based on healthcare industry research on SMS appointment reminders
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Get started in three simple steps. No technical skills required.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-4">
                  <Calendar className="h-8 w-8" />
                </div>
                <div className="text-sm font-medium text-primary mb-2">
                  Step 1
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect Calendar</h3>
                <p className="text-muted-foreground">
                  Link your Google Calendar with one click. Appointments sync
                  automatically.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-4">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <div className="text-sm font-medium text-primary mb-2">
                  Step 2
                </div>
                <h3 className="text-xl font-semibold mb-2">Set Up Templates</h3>
                <p className="text-muted-foreground">
                  Customize your reminder messages and choose when to send them.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-4">
                  <Zap className="h-8 w-8" />
                </div>
                <div className="text-sm font-medium text-primary mb-2">
                  Step 3
                </div>
                <h3 className="text-xl font-semibold mb-2">Sit Back & Relax</h3>
                <p className="text-muted-foreground">
                  Reminders are sent automatically. Focus on your business, not
                  phone calls.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button asChild size="lg">
                <Link href="/sign-up">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* SMS Preview */}
        <section className="px-6 py-20 bg-muted/30">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">See What Your Clients Receive</h2>
              <p className="mt-4 text-muted-foreground">
                Professional, customizable reminders that get read
              </p>
            </div>

            <div className="max-w-md mx-auto">
              {/* Phone mockup */}
              <div className="bg-background rounded-3xl border-4 border-foreground/10 p-4 shadow-xl">
                <div className="bg-muted rounded-2xl p-3 space-y-3">
                  {/* 1 Week reminder */}
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">1 week before</div>
                    <div className="bg-[#34C759] text-white rounded-2xl rounded-bl-md p-3 text-sm leading-relaxed shadow-sm">
                      <p>
                        Hi Sarah, reminder: your appointment with{' '}
                        <strong>Premier Services</strong> is in 1 week on{' '}
                        <strong>Jan 24 at 2:00 PM</strong>.
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1 text-xs text-muted-foreground">
                      <span>Delivered</span>
                      <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L9.5 15.5L6 12" />
                        <path d="M22 6L13.5 15.5L12 14" />
                      </svg>
                    </div>
                  </div>
                  {/* 1 Day reminder */}
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">1 day before</div>
                    <div className="bg-[#34C759] text-white rounded-2xl rounded-bl-md p-3 text-sm leading-relaxed shadow-sm">
                      <p>
                        Hi Sarah, reminder: your appointment with{' '}
                        <strong>Premier Services</strong> is tomorrow at{' '}
                        <strong>2:00 PM</strong>.
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1 text-xs text-muted-foreground">
                      <span>Delivered</span>
                      <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L9.5 15.5L6 12" />
                        <path d="M22 6L13.5 15.5L12 14" />
                      </svg>
                    </div>
                  </div>
                  {/* Same day reminder */}
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Same day</div>
                    <div className="bg-[#34C759] text-white rounded-2xl rounded-bl-md p-3 text-sm leading-relaxed shadow-sm">
                      <p>
                        Hi Sarah, reminder: your appointment with{' '}
                        <strong>Premier Services</strong> is today at{' '}
                        <strong>2:00 PM</strong>. Reply STOP to opt out.
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1 text-xs text-muted-foreground">
                      <span>Delivered</span>
                      <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L9.5 15.5L6 12" />
                        <path d="M22 6L13.5 15.5L12 14" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                98% of SMS messages are read within 3 minutes
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">
                Why Businesses Choose SMS Remindful
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Simple, affordable, and effective. Here&apos;s what makes us
                different.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4 p-6 rounded-xl bg-background border">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Save Money on Every No-Show
                  </h3>
                  <p className="text-muted-foreground">
                    The average no-show costs $200+. Reduce no-shows by 30-50%
                    and SMS Remindful pays for itself many times over.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 rounded-xl bg-background border">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Save Hours of Staff Time
                  </h3>
                  <p className="text-muted-foreground">
                    Stop making manual reminder calls. Your staff can focus on
                    patients, not phones.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 rounded-xl bg-background border">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Better Client Experience
                  </h3>
                  <p className="text-muted-foreground">
                    Clients appreciate timely reminders. 98% of SMS messages are
                    read within 3 minutes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 rounded-xl bg-background border">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Star className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Simple & Affordable
                  </h3>
                  <p className="text-muted-foreground">
                    No complex software, no long contracts. Just $49/month for
                    effective SMS reminders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Perfect For</h2>
              <p className="mt-4 text-muted-foreground">
                Any appointment-based business using Google Calendar
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Dental Practices',
                'Salons & Spas',
                'Consultants & Coaches',
                'Medical Clinics',
              ].map((industry) => (
                <span
                  key={industry}
                  className="px-4 py-2 rounded-full bg-muted text-sm font-medium"
                >
                  {industry}
                </span>
              ))}
              <span className="px-4 py-2 rounded-full bg-muted/50 text-sm font-medium text-muted-foreground">
                + therapists, vets, auto services, and more...
              </span>
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section id="pricing" className="px-6 py-20 bg-muted/30 scroll-mt-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground mb-8">
              No hidden fees. No long-term contracts. Cancel anytime.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="rounded-xl border bg-background p-6">
                <div className="text-lg font-semibold mb-1">Starter</div>
                <div className="text-3xl font-bold mb-2">$49</div>
                <div className="text-sm text-muted-foreground mb-4">
                  per month
                </div>
                <div className="text-sm">300 SMS / month</div>
              </div>
              <div className="rounded-xl border-2 border-primary bg-background p-6 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  Recommended
                </div>
                <div className="text-lg font-semibold mb-1">Growth</div>
                <div className="text-3xl font-bold mb-2">$99</div>
                <div className="text-sm text-muted-foreground mb-4">
                  per month
                </div>
                <div className="text-sm">800 SMS / month</div>
              </div>
              <div className="rounded-xl border bg-background p-6">
                <div className="text-lg font-semibold mb-1">Pro</div>
                <div className="text-3xl font-bold mb-2">$149</div>
                <div className="text-sm text-muted-foreground mb-4">
                  per month
                </div>
                <div className="text-sm">2,000 SMS / month</div>
              </div>
            </div>

            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">
                View Full Pricing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Quick FAQ */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Common Questions</h2>
            </div>

            <div className="space-y-6">
              <div className="border-b pb-6">
                <h3 className="font-semibold mb-2">How does the free trial work?</h3>
                <p className="text-muted-foreground text-sm">
                  Start with a 7-day free trial that includes 20 SMS credits. No credit card required.
                  Connect your Google Calendar, set up your reminders, and see the value before paying.
                </p>
              </div>
              <div className="border-b pb-6">
                <h3 className="font-semibold mb-2">Can I customize the reminder messages?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! Create custom templates using variables like client name, appointment date, time,
                  and your business name. We also provide ready-to-use default templates.
                </p>
              </div>
              <div className="border-b pb-6">
                <h3 className="font-semibold mb-2">What happens if I exceed my SMS limit?</h3>
                <p className="text-muted-foreground text-sm">
                  You&apos;ll receive a notification when approaching your limit. You can upgrade your plan
                  anytime to get more credits. Unused credits don&apos;t roll over.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/faq"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                View all FAQs
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        <CTASection
          description="Join businesses saving time and money with automated SMS reminders. Start your free trial today — no credit card required."
          primaryCta={{ text: 'Start Free Trial', href: '/sign-up', showArrow: true }}
          secondaryCta={{ text: 'Calculate Your Savings', href: '/no-show-cost-calculator' }}
          showBulletPoints
        />
      </main>

      <Footer />
    </div>
  )
}
