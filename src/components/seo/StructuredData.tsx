// Product/Software Schema for homepage and pricing pages
export function ProductStructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SMS Remindful',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Appointment Reminder Software',
    operatingSystem: 'Web',
    description:
      'Automated SMS appointment reminder software that syncs with Google Calendar to reduce no-shows for appointment-based businesses. Helps dental practices, salons, consultants, coaches, and service businesses send timely text reminders to clients.',
    url: 'https://smsremindful.com',
    image: 'https://smsremindful.com/og-image.png',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free Trial',
        price: '0',
        priceCurrency: 'USD',
        description: '7-day free trial with 20 SMS credits, no credit card required',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Starter Plan',
        price: '49',
        priceCurrency: 'USD',
        priceValidUntil: '2027-12-31',
        description: '300 SMS/month - Perfect for solo professionals',
      },
      {
        '@type': 'Offer',
        name: 'Growth Plan',
        price: '99',
        priceCurrency: 'USD',
        priceValidUntil: '2027-12-31',
        description: '800 SMS/month - Ideal for growing businesses',
      },
      {
        '@type': 'Offer',
        name: 'Pro Plan',
        price: '149',
        priceCurrency: 'USD',
        priceValidUntil: '2027-12-31',
        description: '2000 SMS/month - For high-volume businesses',
      },
    ],
    featureList: [
      'Google Calendar sync',
      'Automated SMS reminders',
      'Customizable SMS templates',
      'Variable interpolation (client name, date, time)',
      '1 week, 1 day, same-day reminder scheduling',
      'Dashboard analytics',
      'SMS delivery tracking',
      'TCPA-compliant opt-out handling',
      'No contracts required',
    ],
    softwareRequirements: 'Google Calendar account',
    author: {
      '@type': 'Organization',
      name: 'SaaSyful LLC',
      url: 'https://saasyful.com',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// FAQ Schema for pricing and FAQ pages
const faqItems = [
  {
    question: 'What calendars does SMS Remindful support?',
    answer:
      'SMS Remindful currently integrates with Google Calendar. We extract appointment details including date, time, and attendee information to send automated SMS reminders. Outlook calendar integration is planned for future releases.',
  },
  {
    question: 'How much does SMS Remindful cost?',
    answer:
      'SMS Remindful offers three plans: Starter at $49/month (300 SMS), Growth at $99/month (800 SMS), and Pro at $149/month (2,000 SMS). Annual billing saves 17% (2 months free). All plans include a 7-day free trial with 20 SMS credits, no credit card required.',
  },
  {
    question: 'Does SMS Remindful support two-way SMS?',
    answer:
      'Currently, SMS Remindful focuses on automated outbound appointment reminders. Two-way SMS for appointment confirmations and replies is planned for a future update.',
  },
  {
    question: 'Is SMS Remindful HIPAA compliant?',
    answer:
      'SMS Remindful sends appointment reminders containing only date, time, and business name. We do not store or transmit protected health information (PHI). All messages include TCPA-compliant opt-out instructions. For practices requiring full HIPAA compliance, please consult with your compliance officer.',
  },
  {
    question: 'What happens if I exceed my SMS limit?',
    answer:
      "You'll receive a notification when approaching your monthly limit. You can upgrade your plan anytime from your dashboard to get more SMS credits. Unused credits do not roll over to the next month.",
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      "Yes, there are no contracts or commitments. You can cancel or change your plan anytime from your dashboard. If you cancel, you'll retain access until the end of your current billing period.",
  },
  {
    question: 'How does SMS Remindful compare to Weave or Solutionreach?',
    answer:
      "SMS Remindful is a focused, affordable alternative to enterprise solutions. While Weave costs $300-400/month and Solutionreach starts at $329/month, SMS Remindful starts at just $49/month. We focus on doing one thing well: automated SMS appointment reminders with Google Calendar sync.",
  },
  {
    question: 'What industries can use SMS Remindful?',
    answer:
      'SMS Remindful works for any appointment-based business including dental practices, medical clinics, salons and spas, consultants, coaches, therapists, veterinary clinics, auto services, and any business that schedules appointments via Google Calendar.',
  },
]

export function FAQStructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Organization Schema for all pages
export function OrganizationStructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SMS Remindful',
    url: 'https://smsremindful.com',
    logo: 'https://smsremindful.com/logo.png',
    description: 'Automated SMS appointment reminder software to reduce no-shows',
    foundingDate: '2026',
    parentOrganization: {
      '@type': 'Organization',
      name: 'SaaSyful LLC',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hey@smsremindful.com',
      contactType: 'customer support',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
