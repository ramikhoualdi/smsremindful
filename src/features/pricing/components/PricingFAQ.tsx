import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const generalFaqs = [
  {
    question: 'How does the free trial work?',
    answer:
      'Start with a 7-day free trial that includes 20 SMS credits. No credit card required. Connect your Google Calendar, set up your reminder templates, and see the value before committing to a paid plan.',
  },
  {
    question: 'What calendars do you support?',
    answer:
      'SMS Remindful currently integrates with Google Calendar. We automatically sync your appointments and extract client information to send reminders. Outlook/Microsoft Calendar integration is planned for a future release.',
  },
  {
    question: 'What industries can use SMS Remindful?',
    answer:
      'SMS Remindful works for any appointment-based business including dental practices, medical clinics, salons and spas, consultants, coaches, therapists, veterinary clinics, auto services, and any business that schedules appointments via Google Calendar.',
  },
  {
    question: 'Is this HIPAA compliant?',
    answer:
      'SMS Remindful sends appointment reminders containing only date, time, and your business name. We do not store or transmit protected health information (PHI). All messages include TCPA-compliant opt-out instructions. For practices requiring full HIPAA compliance, please consult with your compliance officer.',
  },
]

const billingFaqs = [
  {
    question: 'What happens if I exceed my SMS limit?',
    answer:
      "You'll receive a notification when approaching your monthly limit. You can upgrade your plan anytime from your dashboard to get more SMS credits. Unused credits do not roll over to the next month.",
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
      "We offer a 7-day free trial so you can test the service before paying. If you're not satisfied with your paid subscription, contact us within the first 7 days for a full refund. After that, you can cancel anytime but refunds are not provided for partial billing periods.",
  },
]

const comparisonFaqs = [
  {
    question: 'How does SMS Remindful compare to Weave or Solutionreach?',
    answer:
      "SMS Remindful is a focused, affordable alternative. While Weave costs $300-400/month and Solutionreach starts at $329/month with long-term contracts, SMS Remindful starts at just $49/month with no contracts. We focus on doing one thing really well: automated SMS appointment reminders.",
  },
]

export function PricingFAQ() {
  return (
    <section className="w-full px-6 py-16 bg-muted/30">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about SMS Remindful pricing and plans.
          </p>
        </div>

        <div className="space-y-10">
          {/* General Section */}
          <section>
            <h3 className="mb-4 text-sm font-semibold tracking-tight text-muted-foreground uppercase">
              General
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {generalFaqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Billing Section */}
          <section>
            <h3 className="mb-4 text-sm font-semibold tracking-tight text-muted-foreground uppercase">
              Billing & Plans
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {billingFaqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Comparison Section */}
          <section>
            <h3 className="mb-4 text-sm font-semibold tracking-tight text-muted-foreground uppercase">
              Comparison
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {comparisonFaqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>

        {/* All Plans Include */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-6">All Plans Include</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-600">✓</span> Google Calendar sync
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-600">✓</span> Customizable templates
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-600">✓</span> Automated scheduling
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-600">✓</span> Dashboard analytics
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-600">✓</span> TCPA-compliant opt-out
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-600">✓</span> No contracts
            </div>
          </div>
        </div>

        {/* Contact */}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Still have questions? Email us at{' '}
          <a href="mailto:hey@getsmsremindful.com" className="underline hover:text-foreground">
            hey@getsmsremindful.com
          </a>
        </p>
      </div>
    </section>
  )
}
