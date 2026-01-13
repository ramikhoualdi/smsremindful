# SMS Remindful - MVP Implementation Plan

## Overview
Building an SMS appointment reminder SaaS for dentists at **smsremindful.com**

---

## Part 1: Analysis of Current Specification

### What Works Well

1. **Clear Niche Focus**
   - Dentists & Orthodontists is a well-defined B2B market
   - Pain point (missed appointments = lost revenue) is real and quantifiable
   - Value proposition is clear and compelling

2. **Solid Pricing Strategy**
   - Flat monthly fee removes friction
   - Tiered approach (by patient count) is scalable
   - No complex metering keeps UX simple

3. **Good Data Model Foundation**
   - `Appointment` and `User` interfaces are clean
   - Key fields identified (patientName, phoneNumber, appointmentTime)
   - `reminderSent` boolean for tracking state

4. **Well-Scoped MVP Features**
   - Google Calendar integration (covers most small practices)
   - SMS templates with variables
   - Multiple reminder timing options
   - Essential dashboard features

5. **Smart Technical Choices**
   - Next.js + TypeScript (matches your starter architecture)
   - Twilio for SMS (industry standard, reliable)
   - Stripe for payments (your established pattern)

---

### What Needs Adjustment

1. **Auth Provider Conflict**
   - **Spec says**: Firebase Auth
   - **Your CLAUDE.md says**: Clerk is canonical, never delete Clerk code
   - **Recommendation**: Use Clerk as primary auth, add Firebase only for Firestore database
   - This keeps your architecture consistent across projects

2. **Backend Architecture Mismatch**
   - **Spec says**: Firebase Functions for backend
   - **Your stack**: Next.js API routes + Server Actions
   - **Recommendation**: Use Next.js API routes for most logic, use Firebase only for:
     - Firestore (database)
     - Optional: Cloud Functions for scheduled SMS jobs (or use Vercel Cron)

3. **Data Model Enhancements Needed**
   ```typescript
   // Missing from spec:
   interface User {
     // Add:
     clinicName: string;        // For SMS templates
     clinicPhone?: string;
     stripeCustomerId: string;  // For payments
     subscriptionStatus: 'active' | 'inactive' | 'trial';
     subscriptionTier: 'starter' | 'professional';
     // Trial tracking:
     trialStartedAt: Date;
     trialEndsAt: Date;         // 7 days from start
     smsCreditsRemaining: number; // Starts at 20, decrements
   }

   interface Template {
     id: string;
     userId: string;
     name: string;
     content: string;           // With {{variables}}
     isDefault: boolean;
     createdAt: Date;
   }

   interface ReminderSchedule {
     id: string;
     userId: string;
     templateId: string;
     timing: 'week' | 'day' | 'hour' | 'custom';
     customMinutesBefore?: number;
     enabled: boolean;
   }

   interface SMSLog {
     id: string;
     appointmentId: string;
     userId: string;
     phoneNumber: string;
     message: string;
     status: 'pending' | 'sent' | 'delivered' | 'failed';
     twilioSid?: string;
     sentAt: Date;
     error?: string;
   }
   ```

4. **Calendar Sync Strategy**
   - Spec mentions webhooks but doesn't detail sync logic
   - Need to handle: new appointments, modified appointments, cancelled appointments
   - Need conflict resolution for duplicate events

---

### What Needs Improvement

1. **Security Gaps**
   - No mention of phone number validation
   - No rate limiting for SMS sends
   - No audit logging
   - **Add**: Phone validation with libphonenumber, daily SMS limits per account

2. **Missing Compliance Considerations**
   - SMS marketing/reminders have legal requirements (TCPA in US)
   - Need opt-out mechanism ("Reply STOP to unsubscribe")
   - Need consent tracking
   - **Add**: Consent checkbox in appointment flow, STOP keyword handling

3. **Error Handling & Recovery**
   - What if SMS fails? Retry logic needed
   - What if calendar sync fails? User notification needed
   - **Add**: Retry queue, failure notifications, sync status indicator

4. **Multi-Tenant Architecture**
   - Spec allows "multiple clinics per dentist" in Phase 2
   - Database schema should support this from Day 1
   - **Add**: `clinicId` field, proper data isolation

5. **Missing Webhook Handling**
   - Twilio delivery status webhooks
   - Stripe subscription webhooks
   - Calendar change webhooks (Google/Microsoft)
   - **Add**: Webhook endpoints and handlers

---

## Part 2: Recommended Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 14+ (App Router) | Your standard |
| Auth | Clerk | Your canonical choice |
| Database | Firebase Firestore | Real-time, scales well |
| SMS | Twilio | Reliable, great API |
| Payments | Stripe | Your standard |
| Styling | Tailwind + shadcn/ui | Your standard |
| Forms | React Hook Form + Zod | Your standard |
| Scheduling | Vercel Cron + Firebase Functions | Hybrid approach |
| Calendar APIs | Google Calendar API, MS Graph | As specified |

---

## Part 3: Implementation Phases

### Phase 1: Foundation (Core Infrastructure)
1. Project setup with Next.js 14 + TypeScript
2. Clerk auth integration
3. Firebase Firestore setup
4. Base UI layout (dashboard shell)
5. Stripe integration (subscription flow)
6. Environment configuration

### Phase 2: Calendar Integration
1. Google Calendar OAuth flow
2. Google Calendar sync logic
3. Appointment extraction & normalization
4. Firestore appointment storage
5. Manual sync trigger + status display
6. (Optional) Outlook Calendar integration

### Phase 3: SMS Core Features
1. Twilio account setup & integration
2. SMS template CRUD
3. Template variable interpolation
4. Reminder schedule configuration
5. SMS sending function
6. SMS logging & status tracking

### Phase 4: Automation & Scheduling
1. Scheduled job for reminder checks (Vercel Cron)
2. Appointment polling logic
3. Automatic SMS dispatch
4. Delivery status webhook handling
5. Retry logic for failed sends

### Phase 5: Dashboard & Polish
1. Appointment list view
2. Sent reminders history
3. Basic analytics (sent count, delivery rate)
4. Settings page (clinic info, preferences)
5. Onboarding flow

### Phase 6: Compliance & Launch Prep
1. STOP keyword handling
2. Consent tracking
3. Terms of Service / Privacy Policy pages
4. Error boundaries & loading states
5. Production deployment

---

## Part 4: Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard home
│   │   ├── appointments/
│   │   ├── templates/
│   │   ├── reminders/
│   │   ├── settings/
│   │   └── billing/
│   ├── api/
│   │   ├── webhooks/
│   │   │   ├── stripe/
│   │   │   └── twilio/
│   │   ├── calendar/
│   │   │   ├── google/
│   │   │   └── outlook/
│   │   └── sms/
│   └── layout.tsx
├── features/
│   ├── auth/                     # Clerk (preserved)
│   ├── appointments/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── server/
│   │   └── types.ts
│   ├── calendar-sync/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── server/
│   │   └── types.ts
│   ├── templates/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── server/
│   │   └── types.ts
│   ├── sms/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── server/
│   │   └── types.ts
│   └── billing/
│       ├── components/
│       ├── hooks/
│       ├── server/
│       └── types.ts
├── lib/
│   ├── firebase/
│   │   ├── admin.ts
│   │   └── client.ts
│   ├── twilio/
│   │   └── client.ts
│   └── stripe/
└── config/
    └── site.ts                   # Branding (needs approval)
```

---

## Part 5: Confirmed Decisions

| Decision | Choice |
|----------|--------|
| **Auth Provider** | Clerk (matches your architecture) |
| **Calendar MVP** | Google Calendar only (Outlook deferred to Phase 2) |
| **Trial Model** | 7-day trial with 20 free SMS, then payment required |
| **SMS Provider** | Twilio (as specified) |

### Trial & Billing Logic
- New users get 7-day trial + 20 free SMS credits
- Trial ends when EITHER:
  - 7 days pass, OR
  - 20 SMS credits are used up
- After trial, subscription required to continue

### Remaining to Confirm
- **Pricing**: What monthly price for paid tier(s)?
- **Branding**: Logo, colors, tagline (need approval for `src/config/site.ts`)

---

## Part 6: Verification Plan

After implementation, verify by:

1. **Auth Flow**: Sign up new account, verify Clerk works
2. **Calendar Sync**: Connect Google Calendar, verify appointments import
3. **Template Creation**: Create SMS template with variables
4. **SMS Send**: Manually trigger test SMS, verify delivery
5. **Scheduled Reminder**: Set reminder, wait for automatic send
6. **Billing**: Subscribe via Stripe, verify access
7. **Webhook Tests**: Verify Twilio delivery status updates

---

## Summary

Your specification is **solid for an MVP**. The main adjustments:
- Use Clerk for auth (per your architecture) - **CONFIRMED**
- Google Calendar only for MVP, Outlook in Phase 2 - **CONFIRMED**
- 7-day trial with 20 free SMS credits - **CONFIRMED**
- Enhance data models for templates, logs, and compliance
- Add SMS compliance features (STOP handling, consent)
- Structure for multi-clinic support from Day 1

**Ready to start implementation.** Pricing and branding can be finalized during development.
