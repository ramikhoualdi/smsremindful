import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - SMS Remindful',
  description: 'Terms of Service for SMS Remindful appointment reminder service',
}

export default function TermsOfServicePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: January 14, 2025</p>
      </div>

      <Section title="1. Acceptance of Terms">
        <p>
          By accessing or using SMS Remindful (&quot;Service&quot;), you agree to be bound by these Terms of Service.
          If you do not agree to these terms, please do not use our Service.
        </p>
      </Section>

      <Section title="2. Description of Service">
        <p>
          SMS Remindful is an automated SMS appointment reminder service designed for healthcare providers,
          particularly dental practices. The Service integrates with your calendar to send automated SMS
          reminders to your patients about upcoming appointments.
        </p>
      </Section>

      <Section title="3. Account Registration">
        <p>
          To use the Service, you must create an account and provide accurate, complete information.
          You are responsible for maintaining the confidentiality of your account credentials and for
          all activities that occur under your account.
        </p>
      </Section>

      <Section title="4. Acceptable Use">
        <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Send unsolicited or spam messages</li>
          <li>Send messages to individuals who have not consented to receive them</li>
          <li>Use the Service for any illegal or unauthorized purpose</li>
          <li>Violate any applicable laws or regulations, including TCPA and healthcare privacy laws</li>
          <li>Transmit any harmful, offensive, or objectionable content</li>
        </ul>
      </Section>

      <Section title="5. SMS Messaging Compliance">
        <p>
          You are responsible for ensuring that all recipients of SMS messages sent through our Service
          have provided proper consent to receive such messages. You must honor all opt-out requests
          promptly. SMS Remindful automatically processes STOP requests to comply with carrier requirements.
        </p>
      </Section>

      <Section title="6. Healthcare Compliance">
        <p>
          While SMS Remindful is designed for healthcare providers, you are solely responsible for ensuring
          your use of the Service complies with all applicable healthcare regulations, including but not
          limited to HIPAA. Do not include protected health information (PHI) beyond what is necessary
          for appointment reminders.
        </p>
      </Section>

      <Section title="7. Subscription and Payment">
        <p>
          The Service is offered on a subscription basis. By subscribing, you agree to pay the applicable
          fees for your chosen plan. Subscriptions automatically renew unless cancelled before the renewal date.
          Fees are non-refundable except as required by law.
        </p>
      </Section>

      <Section title="8. SMS Credits and Limits">
        <p>
          Each subscription plan includes a monthly allocation of SMS credits. Unused credits do not roll
          over to the next month. If you exceed your monthly limit, additional messages may not be sent
          until your next billing cycle or until you upgrade your plan.
        </p>
      </Section>

      <Section title="9. Service Availability">
        <p>
          We strive to maintain high availability of the Service but do not guarantee uninterrupted access.
          The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond
          our control.
        </p>
      </Section>

      <Section title="10. Intellectual Property">
        <p>
          The Service and its original content, features, and functionality are owned by SMS Remindful
          and are protected by international copyright, trademark, and other intellectual property laws.
        </p>
      </Section>

      <Section title="11. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, SMS Remindful shall not be liable for any indirect,
          incidental, special, consequential, or punitive damages, including but not limited to loss of
          profits, data, or business opportunities, arising from your use of the Service.
        </p>
      </Section>

      <Section title="12. Indemnification">
        <p>
          You agree to indemnify and hold harmless SMS Remindful and its officers, directors, employees,
          and agents from any claims, damages, losses, or expenses arising from your use of the Service
          or violation of these Terms.
        </p>
      </Section>

      <Section title="13. Termination">
        <p>
          We may terminate or suspend your account at any time for any reason, including violation of
          these Terms. Upon termination, your right to use the Service will immediately cease.
        </p>
      </Section>

      <Section title="14. Changes to Terms">
        <p>
          We reserve the right to modify these Terms at any time. We will notify you of significant
          changes by posting the new Terms on this page and updating the &quot;Last updated&quot; date.
        </p>
      </Section>

      <Section title="15. Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the United States,
          without regard to its conflict of law provisions.
        </p>
      </Section>

      <Section title="16. Contact Us">
        <p>
          If you have any questions about these Terms, please contact us at:{' '}
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
