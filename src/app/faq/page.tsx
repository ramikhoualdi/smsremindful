import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions',
  description:
    'Find answers to common questions about SMS Remindful: pricing, features, calendar integration, compliance, billing, and more.',
  keywords: [
    'SMS Remindful FAQ',
    'appointment reminder questions',
    'SMS reminder help',
    'dental reminder FAQ',
  ],
  openGraph: {
    title: 'FAQ - SMS Remindful',
    description: 'Answers to common questions about SMS Remindful.',
  },
}

const faqCategories = [
  {
    title: 'Getting Started',
    faqs: [
      {
        question: 'How does SMS Remindful work?',
        answer:
          'SMS Remindful connects to your Google Calendar and automatically sends SMS reminders to your clients before their appointments. You set up your reminder templates and schedules once, then the system handles everything automatically.',
      },
      {
        question: 'How does the free trial work?',
        answer:
          'Start with a 7-day free trial that includes 20 SMS credits. No credit card required. Connect your Google Calendar, set up your reminder templates, and see the value before committing to a paid plan.',
      },
      {
        question: 'What calendars do you support?',
        answer:
          'SMS Remindful currently integrates with Google Calendar. We automatically sync your appointments and extract client information to send reminders. Outlook/Microsoft Calendar integration is planned for Q2 2025.',
      },
      {
        question: 'How long does setup take?',
        answer:
          'Most users are up and running in under 5 minutes. Simply connect your Google Calendar, customize your reminder templates (or use our defaults), and configure your reminder timing. That\'s it!',
      },
    ],
  },
  {
    title: 'Features & Functionality',
    faqs: [
      {
        question: 'What information do I need in my calendar events?',
        answer:
          'At minimum, you need the appointment date/time and client phone number. You can add phone numbers in the event description, location field, or edit them directly in the SMS Remindful dashboard. Client names are extracted from the event title or attendee list.',
      },
      {
        question: 'Can I customize the reminder messages?',
        answer:
          'Yes! You can create custom SMS templates using variables like {{patientName}}, {{appointmentDate}}, {{appointmentTime}}, and {{clinicName}}. We also provide default templates you can use or modify.',
      },
      {
        question: 'When are reminders sent?',
        answer:
          'You can configure reminders for 1 week before, 1 day before, and/or same-day (morning) before appointments. Enable or disable each timing based on your preference. Reminders are processed daily at 8 AM UTC.',
      },
      {
        question: 'Does SMS Remindful support two-way SMS?',
        answer:
          'Two-way SMS (allowing clients to confirm or cancel via text reply) is on our roadmap for Q2 2025. Currently, messages are one-way reminders with opt-out capability.',
      },
    ],
  },
  {
    title: 'Industries & Use Cases',
    faqs: [
      {
        question: 'What industries can use SMS Remindful?',
        answer:
          'SMS Remindful works for any appointment-based business including dental practices, medical clinics, salons and spas, consultants, coaches, therapists, veterinary clinics, auto services, and any business that schedules appointments via Google Calendar.',
      },
      {
        question: 'Is this only for dental practices?',
        answer:
          'No! While we work great for dental practices, SMS Remindful is designed for any appointment-based business. Salons, consultants, coaches, therapists, medical clinics, veterinary offices, and more all use our service.',
      },
      {
        question: 'Can I use this for multiple locations?',
        answer:
          'Currently, each SMS Remindful account supports one business/location. Multi-location support is planned for a future release. For now, you would need separate accounts for each location.',
      },
    ],
  },
  {
    title: 'Compliance & Security',
    faqs: [
      {
        question: 'Is SMS Remindful HIPAA compliant?',
        answer:
          'SMS Remindful sends appointment reminders containing only date, time, and your business name. We do not store or transmit protected health information (PHI). All messages include TCPA-compliant opt-out instructions. For practices requiring full HIPAA compliance, please consult with your compliance officer.',
      },
      {
        question: 'How do you handle opt-outs?',
        answer:
          'All messages include "Reply STOP to opt out" text. When someone texts STOP, Twilio (our SMS provider) automatically handles the opt-out and prevents future messages to that number. This is TCPA-compliant.',
      },
      {
        question: 'Is my data secure?',
        answer:
          'Yes. We use industry-standard security practices including encrypted data storage, secure OAuth for calendar connections, and never store credit card information (handled by Stripe). We only access the calendar data needed to send reminders.',
      },
    ],
  },
  {
    title: 'Billing & Plans',
    faqs: [
      {
        question: 'How much does SMS Remindful cost?',
        answer:
          'Plans start at $49/month for 300 SMS credits (Starter), $99/month for 800 SMS credits (Growth), or $149/month for 2,000 SMS credits (Pro). Annual plans get 2 months free. All plans include the same features - you only pay for volume.',
      },
      {
        question: 'What happens if I exceed my SMS limit?',
        answer:
          'You\'ll receive a notification when approaching your monthly limit. You can upgrade your plan anytime from your dashboard to get more SMS credits. Unused credits do not roll over to the next month.',
      },
      {
        question: 'Can I change plans anytime?',
        answer:
          'Yes! You can upgrade or downgrade your plan at any time from your dashboard. When upgrading, you get immediate access to more SMS credits. When downgrading, the change takes effect at the end of your current billing period.',
      },
      {
        question: 'Is there a contract?',
        answer:
          'No contracts, no commitments. All plans are month-to-month (or annual if you choose). You can cancel anytime and retain access until the end of your billing period.',
      },
      {
        question: 'Can I get a refund?',
        answer:
          'We offer a 7-day free trial so you can test the service before paying. If you\'re not satisfied with your paid subscription, contact us within the first 7 days for a full refund. After that, you can cancel anytime but refunds are not provided for partial billing periods.',
      },
    ],
  },
  {
    title: 'Comparison',
    faqs: [
      {
        question: 'How does SMS Remindful compare to Weave or Solutionreach?',
        answer:
          'SMS Remindful is a focused, affordable alternative. While Weave costs $300-400/month and Solutionreach starts at $329/month with long-term contracts, SMS Remindful starts at just $49/month with no contracts. We focus on doing one thing really well: automated SMS appointment reminders.',
      },
      {
        question: 'Why should I choose SMS Remindful over competitors?',
        answer:
          'Choose SMS Remindful if you want: (1) affordable pricing (5-7x cheaper than enterprise solutions), (2) no long-term contracts, (3) simple setup in under 5 minutes, (4) Google Calendar integration, and (5) a focused tool that does one thing really well.',
      },
    ],
  },
]

// Generate FAQ Schema for SEO
function generateFAQSchema() {
  const allFaqs = faqCategories.flatMap((cat) => cat.faqs)
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export default function FAQPage() {
  const faqSchema = generateFAQSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-16 md:py-20 bg-gradient-to-b from-muted/50 to-background">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about SMS Remindful. Can&apos;t find
              what you&apos;re looking for? Email us at{' '}
              <a
                href="mailto:hey@getsmsremindful.com"
                className="underline hover:text-foreground"
              >
                hey@getsmsremindful.com
              </a>
            </p>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-3xl space-y-12">
            {faqCategories.map((category) => (
              <div key={category.title}>
                <h2 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase mb-4">
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq) => (
                    <AccordionItem key={faq.question} value={faq.question}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="px-6 py-16 bg-muted/30">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-8">
              We&apos;re here to help. Reach out and we&apos;ll get back to you
              as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <a href="mailto:hey@getsmsremindful.com">Email Support</a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/sign-up">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
