import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - SMS Remindful',
  description: 'Privacy Policy for SMS Remindful appointment reminder service',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: January 17, 2026</p>
      </div>

      <Section title="1. Introduction">
        <p>
          SMS Remindful, operated by SaaSyful LLC (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), is committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information
          when you use our SMS appointment reminder service (&quot;Service&quot;).
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-foreground">2.1 Account Information</h3>
            <p className="mt-1">When you create an account, we collect:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Name and email address</li>
              <li>Business name and phone number</li>
              <li>Payment information (processed securely by Stripe; we do not store card details)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-foreground">2.2 Calendar Data</h3>
            <p className="mt-1">When you connect your Google Calendar, we access:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Appointment details (date, time, title, description)</li>
              <li>Client names and phone numbers (if included in calendar events)</li>
            </ul>
            <p className="mt-2">
              We only access data from your primary calendar and only for the purpose of sending appointment reminders.
              You can disconnect your calendar at any time from your dashboard.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-foreground">2.3 SMS Data</h3>
            <p className="mt-1">We collect and store:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Phone numbers of message recipients</li>
              <li>Message content and delivery status</li>
              <li>Opt-out requests and suppression list</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-foreground">2.4 Usage Data</h3>
            <p className="mt-1">We automatically collect:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Log data (IP address, browser type, pages visited)</li>
              <li>Device information</li>
              <li>Usage patterns and analytics</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="3. How We Use Your Information">
        <p>We use your information to:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Provide, maintain, and improve the Service</li>
          <li>Send SMS appointment reminders on your behalf</li>
          <li>Process payments and manage subscriptions</li>
          <li>Communicate with you about the Service (updates, support, security alerts)</li>
          <li>Monitor and analyze usage to improve user experience</li>
          <li>Prevent fraud and enforce our Terms of Service</li>
          <li>Comply with legal obligations</li>
        </ul>
      </Section>

      <Section title="4. Information Sharing">
        <p>We may share your information with:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li><strong>Twilio:</strong> Our SMS delivery provider, to send messages on your behalf</li>
          <li><strong>Stripe:</strong> Our payment processor, to handle billing securely</li>
          <li><strong>Google:</strong> To access your calendar data (only with your explicit authorization)</li>
          <li><strong>Firebase/Google Cloud:</strong> Our database and hosting provider</li>
          <li><strong>Clerk:</strong> Our authentication provider</li>
          <li><strong>Legal authorities:</strong> When required by law, court order, or to protect our rights</li>
        </ul>
        <p className="mt-3">
          <strong>We do not sell your personal information to third parties.</strong>
        </p>
      </Section>

      <Section title="5. Data Security">
        <p>
          We implement appropriate technical and organizational measures to protect your information, including:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Encryption in transit (HTTPS/TLS) and at rest</li>
          <li>Secure authentication via Clerk</li>
          <li>Access controls and least-privilege principles</li>
          <li>Regular security assessments</li>
        </ul>
        <p className="mt-3">
          However, no method of transmission over the Internet or electronic storage is 100% secure.
          We cannot guarantee absolute security.
        </p>
      </Section>

      <Section title="6. Data Retention">
        <p>We retain your information as follows:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li><strong>Account data:</strong> Retained while your account is active</li>
          <li><strong>SMS logs:</strong> Retained for 90 days for troubleshooting and compliance</li>
          <li><strong>Appointment data:</strong> Synced appointments are retained while your account is active</li>
        </ul>
        <p className="mt-3">
          You may request deletion of your data at any time by contacting us at hey@smsremindful.com.
          Upon account deletion, we will delete your personal data within 30 days, except where retention
          is required by law.
        </p>
      </Section>

      <Section title="7. Data Breach Notification">
        <p>
          In the event of a data breach that affects your personal information, we will:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Notify affected users via email within 72 hours of becoming aware of the breach</li>
          <li>Provide details about the nature of the breach and data affected</li>
          <li>Describe the measures we are taking to address the breach</li>
          <li>Provide recommendations for steps you can take to protect yourself</li>
          <li>Report to relevant authorities as required by applicable law</li>
        </ul>
      </Section>

      <Section title="8. Your Rights">
        <p>Depending on your location, you may have the right to:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your information</li>
          <li>Object to or restrict certain processing</li>
          <li>Data portability (receive your data in a structured format)</li>
          <li>Withdraw consent at any time</li>
          <li>Disconnect your calendar integration at any time</li>
          <li>Cancel your subscription and close your account</li>
        </ul>
        <p className="mt-3">
          To exercise these rights, contact us at hey@smsremindful.com.
        </p>
      </Section>

      <Section title="9. Healthcare Provider Notice">
        <p>
          <strong>This section applies only if you are a healthcare provider subject to HIPAA.</strong>
        </p>
        <p className="mt-2">
          SMS Remindful is not a HIPAA-covered entity or business associate. While we implement
          security measures to protect data, healthcare providers using our Service are responsible
          for ensuring their use complies with HIPAA requirements.
        </p>
        <p className="mt-2">
          <strong>Recommendations for healthcare providers:</strong>
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-6">
          <li>Limit message content to appointment date, time, and your business name</li>
          <li>Do not include diagnosis, treatment, or other PHI in calendar events</li>
          <li>Obtain appropriate patient consent for SMS communications</li>
          <li>Consult with your compliance officer regarding your use of the Service</li>
        </ul>
      </Section>

      <Section title="10. SMS Consent and Opt-Out">
        <p>
          You are responsible for obtaining proper consent from clients before sending them SMS messages
          through our Service, in compliance with the Telephone Consumer Protection Act (TCPA).
        </p>
        <p className="mt-2">
          Recipients can opt out at any time by replying STOP to any message. We automatically process
          opt-out requests, add the number to a suppression list, and prevent future messages to that number.
        </p>
      </Section>

      <Section title="11. Cookies and Tracking">
        <p>
          We use essential cookies to maintain your session and preferences. We may use analytics
          services to understand how users interact with our Service. These are necessary for the
          Service to function properly.
        </p>
        <p className="mt-2">
          You can control cookie settings through your browser, but disabling cookies may affect
          Service functionality.
        </p>
      </Section>

      <Section title="12. Third-Party Links">
        <p>
          Our Service may contain links to third-party websites (e.g., Stripe for billing, Google for calendar).
          We are not responsible for the privacy practices of these external sites. We encourage you to
          review their privacy policies.
        </p>
      </Section>

      <Section title="13. Children&apos;s Privacy">
        <p>
          Our Service is intended for businesses and is not directed at individuals under 18 years of age.
          We do not knowingly collect personal information from children. If you believe we have collected
          information from a child, please contact us immediately.
        </p>
      </Section>

      <Section title="14. International Data Transfers">
        <p>
          Your information may be transferred to and processed in the United States and other countries
          where our service providers operate. These countries may have different data protection laws
          than your country of residence.
        </p>
        <p className="mt-2">
          By using the Service, you consent to the transfer of your information to the United States
          and other jurisdictions. We ensure appropriate safeguards are in place to protect your
          information in accordance with this Privacy Policy.
        </p>
      </Section>

      <Section title="15. California Privacy Rights">
        <p>
          If you are a California resident, you may have additional rights under the California Consumer
          Privacy Act (CCPA), including:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>The right to know what personal information we collect and how it is used</li>
          <li>The right to delete your personal information</li>
          <li>The right to opt-out of the sale of personal information (we do not sell personal information)</li>
          <li>The right to non-discrimination for exercising your privacy rights</li>
        </ul>
        <p className="mt-3">
          To exercise these rights, contact us at hey@smsremindful.com.
        </p>
      </Section>

      <Section title="16. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify you of material changes by:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Posting the new policy on this page</li>
          <li>Updating the &quot;Last updated&quot; date</li>
          <li>Sending you an email notification for significant changes</li>
        </ul>
        <p className="mt-3">
          Your continued use of the Service after changes constitutes acceptance of the updated Privacy Policy.
        </p>
      </Section>

      <Section title="17. Contact Us">
        <p>
          If you have questions about this Privacy Policy or our data practices, please contact us at:{' '}
          <a href="mailto:hey@smsremindful.com" className="text-primary underline hover:no-underline">
            hey@smsremindful.com
          </a>
        </p>
        <p className="mt-3 text-sm">
          SaaSyful LLC<br />
          Email: hey@smsremindful.com
        </p>
      </Section>

    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </section>
  )
}
