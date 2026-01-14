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
        <p className="mt-2 text-sm text-muted-foreground">Last updated: January 14, 2025</p>
      </div>

      <Section title="1. Introduction">
        <p>
          SMS Remindful (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information
          when you use our SMS appointment reminder service.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-foreground">2.1 Account Information</h3>
            <p className="mt-1">When you create an account, we collect:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Name and email address</li>
              <li>Clinic/practice name and phone number</li>
              <li>Payment information (processed securely by Stripe)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-foreground">2.2 Calendar Data</h3>
            <p className="mt-1">When you connect your Google Calendar, we access:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Appointment details (date, time, title, description)</li>
              <li>Patient names and phone numbers (if included in calendar events)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-foreground">2.3 SMS Data</h3>
            <p className="mt-1">We collect and store:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Phone numbers of message recipients</li>
              <li>Message content and delivery status</li>
              <li>Opt-out requests</li>
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
          <li>Provide and maintain the Service</li>
          <li>Send SMS appointment reminders on your behalf</li>
          <li>Process payments and manage subscriptions</li>
          <li>Communicate with you about the Service</li>
          <li>Improve and optimize the Service</li>
          <li>Comply with legal obligations</li>
        </ul>
      </Section>

      <Section title="4. Information Sharing">
        <p>We may share your information with:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li><strong>Twilio:</strong> Our SMS delivery provider, to send messages</li>
          <li><strong>Stripe:</strong> Our payment processor, to handle billing</li>
          <li><strong>Google:</strong> To access your calendar data (with your authorization)</li>
          <li><strong>Legal authorities:</strong> When required by law or to protect our rights</li>
        </ul>
        <p className="mt-3">We do not sell your personal information to third parties.</p>
      </Section>

      <Section title="5. Data Security">
        <p>
          We implement appropriate technical and organizational measures to protect your information,
          including encryption in transit and at rest, secure authentication, and regular security assessments.
          However, no method of transmission over the Internet is 100% secure.
        </p>
      </Section>

      <Section title="6. Data Retention">
        <p>
          We retain your information for as long as your account is active or as needed to provide
          the Service. SMS logs are retained for 90 days for troubleshooting and compliance purposes.
          You may request deletion of your data at any time.
        </p>
      </Section>

      <Section title="7. Your Rights">
        <p>You have the right to:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your information</li>
          <li>Disconnect your calendar integration at any time</li>
          <li>Cancel your subscription and close your account</li>
        </ul>
      </Section>

      <Section title="8. HIPAA Considerations">
        <p>
          While SMS Remindful implements security measures to protect data, we are not a HIPAA-covered
          entity. Healthcare providers using our Service are responsible for ensuring their use complies
          with HIPAA requirements. We recommend limiting PHI in appointment reminders to the minimum
          necessary information.
        </p>
      </Section>

      <Section title="9. SMS Consent and Opt-Out">
        <p>
          You are responsible for obtaining proper consent from patients before sending them SMS messages.
          Recipients can opt out at any time by replying STOP to any message. We automatically process
          opt-out requests and maintain a suppression list.
        </p>
      </Section>

      <Section title="10. Cookies and Tracking">
        <p>
          We use essential cookies to maintain your session and preferences. We may use analytics
          services to understand how users interact with our Service. You can control cookie settings
          through your browser.
        </p>
      </Section>

      <Section title="11. Third-Party Links">
        <p>
          Our Service may contain links to third-party websites. We are not responsible for the
          privacy practices of these external sites. We encourage you to review their privacy policies.
        </p>
      </Section>

      <Section title="12. Children's Privacy">
        <p>
          Our Service is not intended for individuals under 18 years of age. We do not knowingly
          collect personal information from children.
        </p>
      </Section>

      <Section title="13. International Data Transfers">
        <p>
          Your information may be transferred to and processed in countries other than your own.
          We ensure appropriate safeguards are in place to protect your information in accordance
          with this Privacy Policy.
        </p>
      </Section>

      <Section title="14. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify you of significant
          changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
        </p>
      </Section>

      <Section title="15. Contact Us">
        <p>
          If you have questions about this Privacy Policy or our data practices, please contact us at:{' '}
          <a href="mailto:hey@smsremindful.com" className="text-primary underline hover:no-underline">
            hey@smsremindful.com
          </a>
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
