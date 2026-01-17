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
        <p className="mt-2 text-sm text-muted-foreground">Last updated: January 17, 2026</p>
      </div>

      <Section title="1. Acceptance of Terms">
        <p>
          By accessing or using SMS Remindful (&quot;Service&quot;), operated by SaaSyful LLC (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;),
          you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our Service.
        </p>
      </Section>

      <Section title="2. Description of Service">
        <p>
          SMS Remindful is an automated SMS appointment reminder service designed for appointment-based businesses,
          including but not limited to dental practices, medical clinics, salons, spas, consultants, coaches,
          therapists, and any business that schedules appointments. The Service integrates with your calendar
          to send automated SMS reminders to your clients about upcoming appointments.
        </p>
      </Section>

      <Section title="3. Account Registration">
        <p>
          To use the Service, you must create an account and provide accurate, complete information.
          You are responsible for maintaining the confidentiality of your account credentials and for
          all activities that occur under your account. You must be at least 18 years old to use the Service.
        </p>
      </Section>

      <Section title="4. Acceptable Use">
        <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Send unsolicited or spam messages</li>
          <li>Send messages to individuals who have not consented to receive them</li>
          <li>Use the Service for any illegal or unauthorized purpose</li>
          <li>Violate any applicable laws or regulations, including TCPA and applicable privacy laws</li>
          <li>Transmit any harmful, offensive, or objectionable content</li>
          <li>Attempt to interfere with or disrupt the Service or its infrastructure</li>
        </ul>
      </Section>

      <Section title="5. SMS Messaging Compliance">
        <p>
          You are responsible for ensuring that all recipients of SMS messages sent through our Service
          have provided proper consent to receive such messages in compliance with the Telephone Consumer
          Protection Act (TCPA) and other applicable laws. You must honor all opt-out requests promptly.
          SMS Remindful automatically processes STOP requests to comply with carrier requirements.
        </p>
      </Section>

      <Section title="6. Healthcare Provider Notice">
        <p>
          <strong>This section applies only if you are a healthcare provider subject to HIPAA.</strong>
        </p>
        <p className="mt-2">
          SMS Remindful is not a HIPAA-covered entity and this Service is not intended to transmit
          protected health information (PHI). If you are a healthcare provider, you are solely responsible
          for ensuring your use of the Service complies with all applicable healthcare regulations, including HIPAA.
          We recommend limiting message content to appointment date, time, and your business name only.
        </p>
      </Section>

      <Section title="7. Subscription and Payment">
        <p>
          The Service is offered on a subscription basis with plans starting at $49/month. By subscribing,
          you agree to pay the applicable fees for your chosen plan. Subscriptions automatically renew
          unless cancelled before the renewal date. You may cancel at any time through your dashboard
          or by contacting us. Fees are non-refundable except as described in Section 8 or as required by law.
        </p>
      </Section>

      <Section title="8. Refund Policy">
        <p>
          We offer a 7-day free trial so you can evaluate the Service before paying. If you are not
          satisfied with your paid subscription, contact us within the first 7 days of your paid
          subscription for a full refund. After that period, you may cancel anytime but refunds are
          not provided for partial billing periods.
        </p>
      </Section>

      <Section title="9. SMS Credits and Limits">
        <p>
          Each subscription plan includes a monthly allocation of SMS credits. Unused credits do not roll
          over to the next month. If you exceed your monthly limit, additional messages will not be sent
          until your next billing cycle or until you upgrade your plan. You will receive notifications
          as you approach your monthly limit.
        </p>
      </Section>

      <Section title="10. Service Availability and SMS Delivery Disclaimer">
        <p>
          We strive to maintain high availability of the Service but do not guarantee uninterrupted access.
          The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control.
        </p>
        <p className="mt-3">
          <strong>SMS Delivery Disclaimer:</strong> While we make every effort to ensure reliable SMS delivery,
          we cannot guarantee that all messages will be delivered. SMS delivery depends on third-party carriers,
          network conditions, recipient device status, and other factors outside our control. Messages may be
          delayed, undelivered, or filtered by carriers. You acknowledge that SMS Remindful is not liable for
          any damages resulting from failed or delayed message delivery. We recommend using SMS reminders as
          one part of your client communication strategy, not as the sole method.
        </p>
      </Section>

      <Section title="11. Intellectual Property">
        <p>
          The Service and its original content, features, and functionality are owned by SaaSyful LLC
          and are protected by international copyright, trademark, and other intellectual property laws.
        </p>
      </Section>

      <Section title="12. Limitation of Liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, SAASYFUL LLC AND SMS REMINDFUL SHALL NOT BE LIABLE FOR
          ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Loss of profits, revenue, or business opportunities</li>
          <li>Loss of data or data corruption</li>
          <li>Damages arising from failed or delayed SMS delivery</li>
          <li>Damages arising from service interruptions or downtime</li>
          <li>Any damages resulting from your reliance on the Service</li>
        </ul>
        <p className="mt-3">
          Our total liability for any claims arising from or related to the Service shall not exceed
          the amount you paid us in the twelve (12) months preceding the claim.
        </p>
      </Section>

      <Section title="13. Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless SaaSyful LLC, SMS Remindful, and their officers,
          directors, employees, and agents from any claims, damages, losses, liabilities, and expenses
          (including reasonable attorneys&apos; fees) arising from:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Your use of the Service</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any applicable laws, including TCPA</li>
          <li>Messages you send through the Service</li>
          <li>Any claims by recipients of your messages</li>
        </ul>
      </Section>

      <Section title="14. Termination">
        <p>
          We may terminate or suspend your account immediately, without prior notice, for any reason,
          including if you violate these Terms. Upon termination, your right to use the Service will
          immediately cease. You may terminate your account at any time by cancelling your subscription
          and contacting us to delete your account.
        </p>
      </Section>

      <Section title="15. Changes to Terms">
        <p>
          We reserve the right to modify these Terms at any time. We will notify you of material changes
          by posting the new Terms on this page, updating the &quot;Last updated&quot; date, and/or sending you
          an email notification. Your continued use of the Service after changes constitutes acceptance
          of the modified Terms.
        </p>
      </Section>

      <Section title="16. Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the State of Delaware,
          United States, without regard to its conflict of law provisions.
        </p>
      </Section>

      <Section title="17. Dispute Resolution and Arbitration">
        <p>
          <strong>PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS.</strong>
        </p>
        <p className="mt-2">
          Any dispute, controversy, or claim arising out of or relating to these Terms or the Service shall
          be resolved by binding arbitration administered by the American Arbitration Association (AAA) in
          accordance with its Commercial Arbitration Rules. The arbitration shall be conducted in Delaware
          or, at your election, conducted remotely via video conference.
        </p>
        <p className="mt-2">
          <strong>Class Action Waiver:</strong> You agree that any arbitration or proceeding shall be limited
          to the dispute between us individually. To the fullest extent permitted by law: (a) no arbitration
          shall be joined with any other proceeding; (b) there is no right or authority for any dispute to be
          arbitrated on a class-action basis; and (c) there is no right or authority for any dispute to be
          brought in a purported representative capacity on behalf of the general public or any other persons.
        </p>
        <p className="mt-2">
          <strong>Exceptions:</strong> Either party may bring a claim in small claims court if it qualifies.
          Either party may seek injunctive relief in any court of competent jurisdiction.
        </p>
      </Section>

      <Section title="18. Severability">
        <p>
          If any provision of these Terms is found to be unenforceable or invalid, that provision shall be
          limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain
          in full force and effect.
        </p>
      </Section>

      <Section title="19. Entire Agreement">
        <p>
          These Terms, together with our Privacy Policy, constitute the entire agreement between you and
          SaaSyful LLC regarding the Service and supersede all prior agreements and understandings.
        </p>
      </Section>

      <Section title="20. Contact Us">
        <p>
          If you have any questions about these Terms, please contact us at:{' '}
          <a href="mailto:support@smsremindful.com" className="text-primary underline hover:no-underline">
            support@smsremindful.com
          </a>
        </p>
        <p className="mt-3 text-sm">
          SaaSyful LLC<br />
          Email: support@smsremindful.com
        </p>
      </Section>

      <div className="border-t pt-6 mt-8 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SaaSyful LLC. All rights reserved.</p>
      </div>
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
