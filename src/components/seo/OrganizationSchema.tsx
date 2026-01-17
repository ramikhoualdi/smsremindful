export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SMS Remindful',
    url: 'https://smsremindful.com',
    logo: 'https://smsremindful.com/logo.png',
    description:
      'Automated SMS appointment reminders for appointment-based businesses. Reduce no-shows with Google Calendar integration.',
    foundingDate: '2025',
    parentOrganization: {
      '@type': 'Organization',
      name: 'SaaSyful LLC',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@smsremindful.com',
      contactType: 'customer support',
    },
    sameAs: [],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
