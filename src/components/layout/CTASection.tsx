import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CTASectionProps {
  title?: string
  description?: string
  primaryCta?: {
    text: string
    href: string
    showArrow?: boolean
  }
  secondaryCta?: {
    text: string
    href: string
  }
  showEmail?: boolean
  showBulletPoints?: boolean
}

export function CTASection({
  title = 'Ready to Reduce No-Shows?',
  description = 'Start your free 7-day trial today. No credit card required. Set up in 5 minutes.',
  primaryCta = { text: 'Start Free Trial', href: '/sign-up', showArrow: false },
  secondaryCta,
  showEmail = false,
  showBulletPoints = false,
}: CTASectionProps) {
  return (
    <section className="px-6 py-16 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-lg opacity-90 mb-8">{description}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary">
            <Link href={primaryCta.href}>
              {primaryCta.text}
              {primaryCta.showArrow && <ArrowRight className="ml-2 h-4 w-4" />}
            </Link>
          </Button>
          {secondaryCta && (
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
            </Button>
          )}
        </div>

        {showBulletPoints && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm opacity-90">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4" />
              7-day free trial
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4" />
              20 free SMS credits
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4" />
              No credit card required
            </span>
          </div>
        )}

        {showEmail && (
          <p className="text-sm mt-6 opacity-75">
            Questions? Email us at{' '}
            <a
              href="mailto:hey@smsremindful.com"
              className="underline hover:no-underline"
            >
              hey@smsremindful.com
            </a>
          </p>
        )}

        {!showEmail && !showBulletPoints && (
          <p className="text-sm mt-6 opacity-75">
            7-day free trial with 20 SMS credits. No credit card required.
          </p>
        )}
      </div>
    </section>
  )
}
