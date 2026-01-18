# SMS Remindful - Complete Project Scope

**Document Version:** 1.9
**Last Updated:** January 18, 2025
**Status:** LIVE IN PRODUCTION - Ready for Customers

---

## Executive Summary

SMS Remindful is a SaaS application that provides automated SMS appointment reminders for dental practices. The platform integrates with Google Calendar to automatically sync appointments and sends customizable SMS reminders to patients at configurable intervals before their appointments.

**Target Market:** Small to medium dental practices in the United States
**Business Model:** Subscription-based with tiered pricing
**Domain:** smsremindful.com

---

## Product Vision

### Problem Statement
Dental practices lose significant revenue due to patient no-shows. Manual reminder calls are time-consuming and inconsistent. Existing solutions are often complex, expensive, or not tailored for small practices.

### Solution
An automated SMS reminder system that:
- Syncs with existing calendar systems (Google Calendar)
- Sends personalized SMS reminders at optimal times
- Requires minimal setup and maintenance
- Offers transparent, affordable pricing

### Value Proposition
- **Reduce no-shows** by up to 30-50%
- **Save staff time** with automated reminders
- **Improve patient experience** with timely, professional communication
- **Simple setup** - connect calendar and go

---

## Feature Set

### Core Features (Implemented)

#### 1. User Authentication
| Feature | Status | Details |
|---------|--------|---------|
| Sign up | DONE | Email/password via Clerk |
| Sign in | DONE | Email/password via Clerk |
| Password reset | DONE | Clerk managed |
| Session management | DONE | Clerk managed |

#### 2. Google Calendar Integration
| Feature | Status | Details |
|---------|--------|---------|
| OAuth connection | DONE | Connect/disconnect Google account |
| Calendar sync | DONE | Fetch appointments from primary calendar |
| Manual sync trigger | DONE | "Sync Now" button on Settings page |
| Appointment extraction | DONE | Title, date/time, attendee info |
| Phone number detection | DONE | Extracts from event description/location |

#### 3. Appointment Management
| Feature | Status | Details |
|---------|--------|---------|
| Appointment list view | DONE | Paginated list with filters |
| Phone number editing | DONE | Manual entry for missing phones |
| Missing phone warnings | DONE | Banner alerting user to incomplete data |
| Appointment details | DONE | View full appointment information |

#### 4. SMS Templates
| Feature | Status | Details |
|---------|--------|---------|
| Default templates | DONE | Pre-built for 1 week, 1 day, same day |
| Custom templates | DONE | Create/edit/delete custom messages |
| Variable interpolation | DONE | {{patientName}}, {{appointmentDate}}, {{appointmentTime}}, {{clinicName}} |
| Opt-out compliance | DONE | "Reply STOP to opt out" auto-appended |
| Branding prefix | DONE | "SMS Remindful:" prefix on all messages |

#### 5. Reminder Configuration
| Feature | Status | Details |
|---------|--------|---------|
| Reminder schedules | DONE | Enable/disable per timing |
| Timing options | DONE | 1 week, 1 day, same day (morning) |
| Template assignment | DONE | Assign template per timing |
| Test SMS | DONE | Send test to verify setup |

#### 6. Automated SMS Sending
| Feature | Status | Details |
|---------|--------|---------|
| Cron job scheduler | DONE | Daily at 8 AM UTC via Vercel Cron |
| Appointment polling | DONE | Query by target date |
| SMS dispatch | DONE | Via Twilio Messaging Service |
| Duplicate prevention | DONE | Check SMS logs before sending |
| Credits management | DONE | Decrement after successful send |

#### 7. SMS Logging & History
| Feature | Status | Details |
|---------|--------|---------|
| SMS log storage | DONE | Firestore with timestamps |
| Delivery status | DONE | Sent/failed status tracking |
| History view | DONE | View sent reminders on dashboard |

#### 8. Dashboard & Analytics
| Feature | Status | Details |
|---------|--------|---------|
| Overview stats | DONE | Sent count, delivery rate |
| Upcoming appointments | DONE | Next 7 days preview |
| Quick actions | DONE | Sync calendar, send test SMS |
| Plan status | DONE | Current plan, credits remaining |

#### 9. Billing & Subscriptions
| Feature | Status | Details |
|---------|--------|---------|
| Pricing page | DONE | 4 tiers with monthly/annual toggle |
| Stripe checkout | DONE | Secure payment processing |
| Webhook handling | DONE | Subscription status updates |
| Customer portal | DONE | Plan changes, cancellation |
| Credits display | DONE | Current balance, reset date |
| Trial support | DONE | 7-day trial with 20 SMS credits |

#### 10. Settings & Configuration
| Feature | Status | Details |
|---------|--------|---------|
| Clinic info form | DONE | Name, phone, address |
| Calendar connection | DONE | Connect/disconnect Google |
| Test SMS sending | DONE | Verify phone/Twilio setup |

#### 11. Onboarding Flow
| Feature | Status | Details |
|---------|--------|---------|
| Onboarding wizard | DONE | 3-step setup flow for new users |
| Clinic profile step | DONE | Required: clinic name + phone |
| Calendar connect step | DONE | Optional: Google Calendar OAuth |
| Test SMS step | DONE | Optional: send test message |
| Onboarding redirect | DONE | Dashboard redirects until completed |
| Live SMS preview | DONE | Shows how messages will appear |

#### 12. Compliance & Legal
| Feature | Status | Details |
|---------|--------|---------|
| Terms of Service | DONE | Local + SaaSyful umbrella |
| Privacy Policy | DONE | Local + SaaSyful umbrella |
| TCPA compliance | DONE | Opt-out text in all messages |
| A2P 10DLC | DONE | Business profile approved, campaign pending |
| STOP keyword | DONE | Twilio auto-managed |

---

## Technical Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 14+ (App Router) | Full-stack React framework |
| Language | TypeScript | Type-safe development |
| Authentication | Clerk | User auth & session management |
| Database | Firebase Firestore | NoSQL document storage |
| SMS Provider | Twilio | SMS delivery with A2P compliance |
| Payments | Stripe | Subscription billing |
| Styling | Tailwind CSS + shadcn/ui | UI components |
| Forms | React Hook Form + Zod | Form handling & validation |
| Scheduling | Vercel Cron | Automated job execution |
| Hosting | Vercel | Serverless deployment |

### Data Models

#### User
```typescript
{
  id: string
  clerkId: string
  email: string
  clinicName?: string
  clinicPhone?: string
  clinicAddress?: string
  googleAccessToken?: string
  googleRefreshToken?: string
  subscriptionStatus: 'trial' | 'active' | 'cancelled' | 'expired'
  subscriptionTier?: 'solo' | 'practice' | 'clinic' | 'custom'
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  smsCredits: number
  trialEndsAt?: Date
  currentPeriodEnd?: Date
  onboardingCompleted: boolean  // New: tracks if user completed onboarding
  createdAt: Date
  updatedAt: Date
}
```

#### Appointment
```typescript
{
  id: string
  clerkId: string
  googleEventId: string
  title: string
  startTime: Date
  endTime: Date
  patientName?: string
  patientPhone?: string
  location?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}
```

#### SMS Template
```typescript
{
  id: string
  clerkId: string
  name: string
  content: string
  timing: '1_week' | '1_day' | 'same_day'
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}
```

#### SMS Log
```typescript
{
  id: string
  clerkId: string
  appointmentId: string
  templateId: string
  recipientPhone: string
  message: string
  status: 'sent' | 'failed' | 'delivered'
  twilioSid?: string
  errorMessage?: string
  sentAt: Date
}
```

### API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/calendar/google/connect` | GET | Initiate Google OAuth |
| `/api/calendar/google/callback` | GET | Handle OAuth callback |
| `/api/calendar/google/disconnect` | POST | Remove Google connection |
| `/api/calendar/sync` | POST | Manual calendar sync |
| `/api/appointments` | GET | List appointments |
| `/api/appointments/[id]` | PATCH | Update appointment (phone) |
| `/api/templates` | GET/POST | List/create templates |
| `/api/templates/[id]` | PATCH/DELETE | Update/delete template |
| `/api/sms/test` | POST | Send test SMS |
| `/api/stripe/checkout` | POST | Create checkout session |
| `/api/stripe/portal` | POST | Create portal session |
| `/api/webhooks/stripe` | POST | Handle Stripe webhooks |
| `/api/cron/send-reminders` | GET | Automated reminder job |
| `/api/user/profile` | PATCH | Update clinic profile |
| `/api/user/complete-onboarding` | POST | Mark onboarding complete |

### Environment Variables

```env
# Site
NEXT_PUBLIC_SITE_URL=https://smsremindful.com

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Database (Firebase)
FIREBASE_ADMIN_SDK_PATH=./firebase-service-account.json

# Google Calendar
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# SMS (Twilio)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
TWILIO_MESSAGING_SERVICE_SID=MG...

# Payments (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs
STRIPE_PRICE_STARTER_MONTHLY=price_...
STRIPE_PRICE_STARTER_ANNUAL=price_...
STRIPE_PRICE_GROWTH_MONTHLY=price_...
STRIPE_PRICE_GROWTH_ANNUAL=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_ANNUAL=price_...

# Cron Security
CRON_SECRET=<random-string>
```

---

## Pricing Structure

| Plan | Monthly | Annual | SMS Credits | Target |
|------|---------|--------|-------------|--------|
| Starter | $49 | $490/year | 300/month | Solo professionals |
| Growth | $99 | $990/year | 800/month | Growing businesses |
| Pro | $149 | $1,490/year | 2,000/month | High-volume teams |
| Custom | Contact | Contact | Unlimited | Enterprise |

**Trial:** 7 days free with 20 SMS credits (no credit card required)

**Annual Discount:** 2 months free (pay for 10, get 12)

**Credits:** Reset monthly on subscription anniversary date (regardless of billing interval)

---

## Current Status

### Production Deployment Complete - January 18, 2025

The application is **LIVE** at **https://smsremindful.com**

### All Core Features Tested & Working

| Feature | Status | Notes |
|---------|--------|-------|
| User sign up/sign in | PASSED | Clerk production instance |
| Google Calendar OAuth | PASSED | Google verification approved |
| Calendar sync | PASSED | Appointments synced correctly |
| Appointment phone editing | PASSED | Working in production |
| Template CRUD | PASSED | Working in production |
| Test SMS sending | PASSED | Working in production |
| SMS credits decrement | PASSED | Working in production |
| Stripe checkout | PASSED | Live payment works |
| Stripe webhooks | PASSED | Credits updated via webhook |
| Stripe portal | PASSED | Plan changes working |
| Vercel Cron Job | PASSED | Manual test: checked 1, sent 1, failed 0 |

### External Dependencies

| Dependency | Status |
|------------|--------|
| Clerk Auth | READY |
| Firebase | READY |
| Google OAuth | VERIFIED by Google |
| Twilio A2P | Campaign under review (2-3 weeks) |
| Stripe | READY (live mode) |
| Vercel | DEPLOYED |

### Cron Job Test Plan (CRITICAL)

The automated reminder system is the core feature. Test thoroughly:

1. **1 Week Reminder**
   - Create appointment 7 days from now
   - Run cron job manually
   - Verify SMS sent
   - Verify log created
   - Verify credits decremented

2. **1 Day Reminder**
   - Create appointment for tomorrow
   - Run cron job manually
   - Verify SMS sent
   - Verify no duplicate if run again

3. **Same Day Reminder**
   - Create appointment for today
   - Run cron job manually
   - Verify SMS sent

4. **Edge Cases**
   - Appointment without phone number (should skip)
   - User with 0 credits (should skip)
   - Cancelled subscription (should skip)
   - Duplicate prevention (run twice, send once)

**Manual Trigger Command:**
```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://smsremindful.com/api/cron/send-reminders
```

---

## Production Setup Completed

### Clerk (Authentication)
- Production instance created
- Production keys added to Vercel (`pk_live_`, `sk_live_`)
- Domain smsremindful.com configured with SSL
- Sign-in/sign-up flows verified working

### Firebase (Database)
- Using same Firebase project for dev and production
- Service account configured in Vercel
- Firestore indexes deployed

### Stripe (Payments)
- Production products created (Starter, Growth, Pro)
- All 6 production price IDs added to Vercel env vars
- Production webhook configured: `https://smsremindful.com/api/webhooks/stripe`
- Webhook signing secret added to Vercel
- Customer portal configured with plan switching enabled
- Legal pages linked in portal:
  - Terms: https://smsremindful.com/legal/terms-of-use
  - Privacy: https://smsremindful.com/legal/privacy-policy

### Twilio (SMS)
- Test SMS verified working in production
- A2P 10DLC brand approved
- A2P campaign still under review (2-3 weeks)
- Messaging Service SID configured

### Google OAuth (Calendar)
- Production redirect URI added: `https://smsremindful.com/api/calendar/google/callback`
- Authorized JavaScript origin added: `https://smsremindful.com`
- OAuth consent screen configured

### Vercel (Hosting)
- Domain smsremindful.com linked and SSL active
- All production env vars configured
- CRON_SECRET generated and added
- NEXT_PUBLIC_SITE_URL set to `https://smsremindful.com`

### Legal Pages
- Terms of Service: https://smsremindful.com/legal/terms-of-use
- Privacy Policy: https://smsremindful.com/legal/privacy-policy
- Both linked in Stripe customer portal

---

## External Dependencies & Status

| Dependency | Status | Production Config |
|------------|--------|-------------------|
| Clerk | READY | Production instance, keys configured |
| Firebase | READY | Same project for dev/prod |
| Google OAuth | READY | Production URIs added |
| Twilio | PARTIAL | A2P campaign under review |
| Stripe | READY | Live mode, webhooks configured |
| Vercel | READY | All env vars set, domain active |

### Twilio A2P 10DLC Status

- **Business Profile:** Approved
- **Brand Registration:** Approved
- **Campaign Registration:** Under Review (submitted Jan 2025)
- **Expected Approval:** 2-3 weeks from submission
- **Fallback:** Can send limited SMS during review period

---

## Known Limitations

1. **Calendar Support:** Google Calendar only (Outlook planned for v2)
2. **SMS Region:** US phone numbers only (international planned)
3. **Reminder Timing:** Daily batch at 8 AM UTC (not real-time)
4. **Analytics:** Basic stats only (advanced dashboard planned)
5. **Multi-clinic:** Single clinic per account (multi-clinic planned)

---

## Security Considerations

| Area | Implementation |
|------|----------------|
| Authentication | Clerk (industry standard) |
| API Security | Clerk middleware on all routes |
| Cron Security | Bearer token authorization |
| Payment Data | Stripe handles all card data (PCI compliant) |
| Data Encryption | Firestore encryption at rest |
| HTTPS | Enforced via Vercel |
| Secrets | Environment variables (not in code) |

---

## Deployment Checklist

### Pre-Deployment - COMPLETE
- [x] All features implemented
- [x] Local testing complete
- [x] Stripe products/prices created
- [x] Stripe webhooks configured
- [x] Legal pages published
- [x] Production environment variables set in Vercel
- [x] Domain DNS configured (smsremindful.com)

### Deployment Steps - COMPLETE
1. [x] Push code to main branch
2. [x] Vercel auto-deploys
3. [x] Verify deployment successful
4. [x] Configure custom domain
5. [x] Update Stripe webhook URL to production
6. [x] Update Google OAuth redirect URI to production
7. [ ] Test critical flows in production (IN PROGRESS)

### Post-Deployment Testing
- [x] Test sign up flow - WORKING
- [x] Test SMS sending - WORKING
- [x] Test Stripe checkout (live mode) - WORKING (300 credits received)
- [x] Test Google Calendar connection - WORKING (needs verification)
- [x] Test calendar sync - PASSED (appointments synced)
- [x] Test cron job manually - PASSED (sent: 1, failed: 0)
- [ ] Monitor error logs
- [ ] Set up uptime monitoring

---

## Future Improvements Roadmap

### URGENT - Pre-Launch Fixes
| Task | Priority | Notes |
|------|----------|-------|
| Google OAuth verification | CRITICAL | Remove "unverified app" warning - submit for Google verification |
| Logo & Branding | HIGH | Create logo, add to Clerk, Stripe, Google OAuth popup |
| App design | HIGH | Currently black & white - needs color/polish |
| Google Cloud - add legal links | HIGH | Add Privacy Policy & Terms to OAuth consent screen |
| Stripe billing portal text | MEDIUM | Shows "SaaSyful LLC" - either explain or change in Stripe |
| Payment success confetti | MEDIUM | Celebration animation on successful payment return |
| Payment failed handling | MEDIUM | Error message, tips, retry guidance |

---

### AI/SEO Visibility & Conversion Optimization

#### Critical (Do First)
| Task | Status | Notes |
|------|--------|-------|
| Create public /pricing page | [x] DONE | With FAQ accordion, competitor comparison |
| Add Product schema (JSON-LD) | [x] DONE | StructuredData.tsx created |
| Add FAQ schema (JSON-LD) | [x] DONE | StructuredData.tsx created |
| Create robots.txt | [x] DONE | AI crawlers (GPTBot, ClaudeBot, PerplexityBot) allowed |
| Create sitemap.xml | [x] DONE | Dynamic sitemap.ts with all public pages |
| Add meta tags to all pages | [x] DONE | Title, description, OG tags configured |

#### Important (Do Soon)
| Task | Status | Notes |
|------|--------|-------|
| Create llms.txt | [x] DONE | Product info for AI discoverability |
| Create /compare page | [x] DONE | SMS Remindful vs Weave, Solutionreach with feature table |
| Create /features page | [x] DONE | Core features, coming soon, all plans include |
| Create /faq standalone page | [x] DONE | All FAQs with categories and JSON-LD schema |
| Add "Best For / Not For" section | [x] DONE | Added to /compare page |
| Add Organization schema | [x] DONE | OrganizationSchema.tsx in layout |

#### Landing Page Conversion
| Task | Status | Notes |
|------|--------|-------|
| Hero section optimization | [x] DONE | Trust badge, price anchor, dual CTAs, trust signals |
| Social proof section | [x] DONE | Stats: 30-50% fewer no-shows, $200+ saved, 5 min setup, 24/7 |
| "How It Works" section | [x] DONE | 3 steps with icons (Calendar, MessageSquare, Zap) |
| Benefits (not features) framing | [x] DONE | 4 benefit cards with outcomes |
| Pricing preview on homepage | [x] DONE | 3 tiers with "View Full Pricing" CTA |
| Final CTA section | [x] DONE | Strong close with calculator link, trust signals |
| "Perfect For" industries section | [x] DONE | 10 industry badges |
| Full footer with navigation | [x] DONE | Product, Resources, Legal columns |

#### Technical SEO
| Task | Status | Notes |
|------|--------|-------|
| Create OG image (1200x630) | [ ] | For social sharing - user to design |
| Create logo + favicon | [ ] | Branding assets - user to design |
| Performance < 3s load time | [ ] | Optimize images (WebP), lazy load |
| Mobile responsive check | [ ] | All pages, thumb-friendly CTAs |
| Accessibility audit | [ ] | Heading hierarchy, alt text, contrast |

#### Schema Data to Implement

**Product/Software Schema (homepage + pricing):**
- @type: SoftwareApplication
- name, description, url, image
- offers array (Free Trial, Starter, Growth, Pro)
- featureList array
- author: SaaSyful LLC

**FAQ Schema (pricing + FAQ pages):**
- What calendars does SMS Remindful support?
- How much does SMS Remindful cost?
- Does SMS Remindful support two-way SMS?
- Is SMS Remindful HIPAA compliant?
- What happens if I exceed my SMS limit?
- Can I cancel my subscription anytime?
- How does SMS Remindful compare to Weave?
- What industries can use SMS Remindful?

**Organization Schema (all pages):**
- name, url, logo, description
- foundingDate: 2025
- parentOrganization: SaaSyful LLC
- contactPoint: support@smsremindful.com

#### Pages to Create/Update
| Page | Priority | Notes |
|------|----------|-------|
| /pricing (public) | CRITICAL | All tiers, FAQ, schema |
| /features | HIGH | Feature matrix, screenshots |
| /compare | HIGH | vs Weave, Solutionreach |
| /faq | MEDIUM | Standalone FAQ page |
| /integrations (future) | LOW | Google Calendar details |

#### robots.txt Content
```
User-agent: *
Allow: /
Sitemap: https://smsremindful.com/sitemap.xml

# AI Crawlers
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Anthropic-ai
Allow: /
User-agent: Google-Extended
Allow: /
```

#### llms.txt Summary
- Product overview and pricing
- Key features and how it works
- Best for / Not ideal for
- Competitor comparison
- Links to key pages
- Contact info

---

### Phase 2 - Post-Launch (Month 1-2)
| Feature | Priority | Impact | Effort |
|---------|----------|--------|--------|
| Twilio delivery status webhooks | HIGH | Track actual delivery vs just "sent" | Low |
| Low credits email notification | HIGH | Reduce churn, upsell opportunity | Low |
| ~~Onboarding wizard~~ | ~~HIGH~~ | ~~Improve activation rate~~ | ~~Medium~~ | **DONE** |
| Product tour for new users | MEDIUM | Reduce support, improve UX | Low |
| Dashboard analytics improvements | MEDIUM | Show ROI to customers | Medium |
| Appointment confirmation replies | MEDIUM | Two-way SMS "Confirm/Cancel" | Medium |

### Phase 3 - Growth (Month 3-4)
| Feature | Priority | Impact | Effort |
|---------|----------|--------|--------|
| Outlook/Microsoft Calendar sync | HIGH | Expand market reach | High |
| Multi-location support | HIGH | Upsell to larger practices | High |
| Custom reminder schedules | MEDIUM | Flexibility (2 days, 3 hours, etc.) | Medium |
| Patient confirmation tracking | MEDIUM | Show no-show reduction metrics | Medium |
| Email reminders (alongside SMS) | MEDIUM | Additional value, lower cost option | Medium |
| Zapier/webhook integrations | LOW | Connect to practice management software | Medium |

### Phase 4 - Scale (Month 5+)
| Feature | Priority | Impact | Effort |
|---------|----------|--------|--------|
| Practice management software integrations | HIGH | Dentrix, Eaglesoft, Open Dental | High |
| White-label/reseller program | MEDIUM | New revenue channel | High |
| International SMS support | MEDIUM | Canada, UK markets | Medium |
| Mobile app | LOW | Nice-to-have, not critical | High |
| API for third-party integrations | LOW | Enterprise feature | Medium |

### Technical Debt & Infrastructure
- [ ] Add error monitoring (Sentry)
- [ ] Set up uptime monitoring (UptimeRobot - free)
- [ ] Implement SMS retry logic for failed sends
- [ ] Add rate limiting on API routes
- [ ] Database backup strategy for Firestore
- [ ] Add logging/analytics (PostHog or Mixpanel)

---

## Sales & Marketing Strategy

### Target Customer Profile
- **Primary:** Solo dentists and small practices (1-3 dentists) in the US
- **Pain point:** Losing $200-500+ per no-show, staff wasting time on manual calls
- **Budget:** $50-150/month for practice software
- **Decision maker:** Practice owner or office manager
- **Tech comfort:** Low to medium - needs simple, "just works" solution

### Unique Value Proposition
"Reduce no-shows by 30-50% with automated SMS reminders. Set up in 5 minutes, works with your existing Google Calendar. No contracts, no complex software."

### Pricing Positioning
- **Not the cheapest:** Avoid competing on price with generic SMS tools
- **Not enterprise:** Undercut Weave ($300+), Solutionreach ($250+)
- **Sweet spot:** Professional, affordable, dental-focused

---

### Channel 1: Cold Email Outreach (Primary - Ready Now)

**Current Assets:**
- 177 dental practice leads (Houston, Phoenix, San Diego, Dallas, Austin)
- Email: hey@getsmsremindful.com (warmed up)
- Instantly.ai account ready

**Email Sequence:**
1. **Day 0 - Pattern interrupt:** "Quick question about no-shows"
2. **Day 3 - Follow-up:** "Re: quick question" (reply-style)
3. **Day 7 - Value add:** "Closing the loop" + case study or stat

**Execution Plan:**
- Start at 30 emails/day
- Send window: 9-11am recipient timezone
- Days: Tuesday, Wednesday, Thursday only
- Scale to 50-100/day after warmup
- Target: 50%+ open rate, 5-10% reply rate, book demos

**Sample Cold Email:**
```
Subject: Quick question about no-shows

Hi [First Name],

Random question - how many patient no-shows does [Practice Name] deal with per week?

I built a simple SMS reminder tool specifically for dental practices. It connects to Google Calendar and automatically texts patients before appointments.

Most practices see 30-50% fewer no-shows within the first month.

Worth a quick chat?

[Your name]

P.S. No contracts, starts at $49/month, 7-day free trial.
```

---

### Channel 2: Google Ads (Month 2+)

**Keywords to target:**
- "dental appointment reminder software"
- "patient reminder system for dentists"
- "reduce dental no-shows"
- "dental practice SMS reminders"
- "appointment reminder app for dentists"

**Budget:** Start with $500/month, optimize for demo bookings
**Landing page:** Create dedicated /google-ads landing page with dental-specific messaging

---

### Channel 3: Dental Forums & Communities

**Where dentists hang out:**
- Dentaltown.com forums (largest dental community)
- Reddit: r/dentistry, r/oralprofessionals
- Facebook groups: "Dental Office Managers", "Dentists Who..."
- LinkedIn groups

**Strategy:**
- Don't spam - provide value first
- Answer questions about no-shows, patient communication
- Share insights/stats, mention tool naturally
- Build reputation as helpful, not salesy

---

### Channel 4: Partnerships (Month 3+)

**Potential partners:**
- Dental consultants and coaches
- Dental marketing agencies
- Dental supply reps (they visit practices regularly)
- Dental associations (local chapters)

**Offer:** Revenue share or referral fee ($50-100 per signup)

---

### Channel 5: Content Marketing (Ongoing)

**Blog posts for SEO:**
- "How to Reduce No-Shows at Your Dental Practice"
- "The True Cost of Patient No-Shows (Calculator)"
- "SMS vs Email: Which Works Better for Appointment Reminders?"
- "HIPAA-Compliant Patient Communication Guide"

**Lead magnets:**
- "No-Show Cost Calculator" (capture email)
- "5 Scripts for Handling Last-Minute Cancellations" (PDF)

---

### Sales Process

**1. Lead → Demo (Goal: 20% conversion)**
- Respond to replies within 2 hours
- Book 15-min Calendly call
- Qualify: How many appointments/week? Current reminder process?

**2. Demo → Trial (Goal: 60% conversion)**
- Screen share, show simplicity
- Connect their Google Calendar live
- Send them a test SMS during call
- "Wow" moment: "That's it - you're set up"

**3. Trial → Paid (Goal: 40% conversion)**
- Day 1: Welcome email with quick tips
- Day 3: Check-in "Any questions?"
- Day 5: "Your trial ends in 2 days" + results so far
- Day 7: "Trial ended" + easy upgrade link

**Key objection handlers:**
| Objection | Response |
|-----------|----------|
| "We already call patients" | "This doesn't replace calls - it's an extra touchpoint. Staff can focus on patients who don't confirm." |
| "We use [competitor]" | "How much are you paying? We're typically 1/3 the cost with the same features." |
| "Need to think about it" | "Totally understand. The trial is free - why not test it for a week and see actual results?" |
| "Is it HIPAA compliant?" | "We don't store patient health records - just names and appointment times from your calendar. All SMS includes opt-out per TCPA regulations." |

---

### Metrics to Track

**Outreach:**
- Emails sent per week
- Open rate (target: 50%+)
- Reply rate (target: 5-10%)
- Demos booked per week

**Sales:**
- Demo → Trial conversion (target: 60%)
- Trial → Paid conversion (target: 40%)
- Average deal cycle (target: <14 days)

**Product:**
- Activation rate (connected calendar within 24h)
- SMS sent per customer per month
- Churn rate (target: <5% monthly)
- NPS score

**Revenue:**
- MRR (Monthly Recurring Revenue)
- Customer count
- Average revenue per customer
- CAC (Customer Acquisition Cost)
- LTV (Lifetime Value) - target 12+ months

---

### 90-Day Sales Goals

| Milestone | Target | Revenue |
|-----------|--------|---------|
| Week 2 | First paying customer | $39-119 MRR |
| Month 1 | 5 paying customers | $200-400 MRR |
| Month 2 | 15 paying customers | $600-1,000 MRR |
| Month 3 | 30 paying customers | $1,200-2,000 MRR |

**Break-even:** ~$860 by May 15th (hosting + tools + Twilio)
**Target:** 10-15 customers at average $70/month = $700-1,050 MRR

---

## Next Steps (Resume Here - Jan 16, 2025)

### Immediate Testing Required

**1. Cron Job Test** (CRITICAL - Core Feature)
```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://smsremindful.com/api/cron/send-reminders
```
- Create test appointments for today, tomorrow, and 7 days out
- Run the cron manually
- Verify SMS sent to correct recipients
- Verify credits decremented
- Verify duplicate prevention works

**2. Stripe Live Payment Test**
- Go to https://smsremindful.com/pricing
- Select a plan and complete checkout with real card
- Verify:
  - Subscription saves to Firestore
  - `smsCredits` field populates correctly (300/750/2000 based on plan)
  - `subscriptionStatus` changes to `active`
  - Billing page displays correct plan info

**3. Google Calendar Test**
- Go to Settings page
- Click "Connect Google Calendar"
- Complete OAuth flow
- Verify appointments sync correctly
- Verify phone numbers extract from event descriptions

### This Week
1. [ ] Complete production testing (cron, Stripe, Google Calendar)
2. [ ] Wait for A2P campaign approval
3. [ ] Finalize cold email sequence in Instantly
4. [ ] Set up Calendly for demo bookings

### Once A2P Approved
1. [ ] Launch cold email campaign at 30/day
2. [ ] Monitor replies, book demos
3. [ ] Close first customer

### Month 1
1. [ ] Iterate on email sequence based on results
2. [ ] Collect testimonials from early customers
3. [ ] Add testimonials to landing page
4. [ ] Scale email outreach to 50-100/day
5. [ ] Consider Google Ads pilot

---

## Resources Needed

- **Calendly:** Free tier for demo booking
- **Loom:** Free tier for async demos/follow-ups
- **Instantly.ai:** $37/month (already have)
- **Google Ads:** $500/month (Month 2+)
- **Total monthly cost:** ~$40 initially, ~$540 with ads

---

## Research & Analysis

### Trial Length Decision: Keep 7 Days

**Research findings:**
- Conversion rates for shorter trials (7-14 days) outperform longer trials (30+ days) by up to 20%
- 7-day free trials maximize acquisition, retention, and profits
- 14-day trials show faster upgrade spikes compared to 30-day trials

**Decision:** Keep 7-day trial with 20 SMS credits. Creates urgency. Product is simple enough to show value in 7 days. Longer trials = more procrastination = lower conversion.

**Sales tactic:** Use "trial extension" for follow-ups with people who didn't convert.

---

### Competitor Pricing Analysis

| Competitor | Price | Notes |
|------------|-------|-------|
| Weave | $249-399/month | Full practice management |
| Solutionreach | $329/month | Enterprise features |
| RevenueWell | $189/month | Marketing + software |
| ReminderDental | $50/month | Closest competitor |
| **SMS Remindful** | **$49-149/month** | **5-7x cheaper** |

**Positioning:** You're 5-8x cheaper than Weave/Solutionreach. This is your KILLER angle. Small practices can't afford $300+/month. You're the affordable solution that does the ONE thing they actually need.

---

### Lead List Data

**CSV Fields:** `first_name`, `email`, `full_name`, `city`, `website`, `personalization`

**Stats:**
- 177 leads with verified emails
- Cities: Houston, Phoenix, San Diego, Dallas, Austin

**Missing (nice-to-have):**
- Rating (Google reviews) - for personalization
- Phone - for omnichannel (but calls from Tunisia impractical)

---

### Lead Magnet Strategy

**Primary: ROI Calculator**
- Simple one-page tool
- Input: appointments/week, no-show rate, avg appointment value
- Output: "You're losing $X/month to no-shows. SMS reminders could save you $Y"
- Qualifies leads AND shows value before demo

**Secondary:** Free trial is enough - 7 days, 20 SMS, no card required.

**Future SEO content:**
- "How to Reduce Dental No-Shows by 40%"
- "SMS vs Email: What Works Better for Appointment Reminders"
- "The True Cost of Patient No-Shows for Dentists"

---

### Social Proof (No Customers Yet)

**Option 1: Industry stats instead of testimonials**
- "Practices using SMS reminders see 30-50% fewer no-shows"
- "The average no-show costs a dental practice $200 per empty chair"

**Option 2: Product demos**
- Screenshots and demo video showing the product in action

**Option 3: Beta testers**
- Offer 3 months free to 2-3 practices in exchange for feedback/testimonial
- Even 1 testimonial is better than zero

---

### Response Speed Setup

**Goal:** Respond within 1 hour during US business hours (3pm-11pm Tunisia time)

**Option A: Instantly.ai mobile app**
- Download the app
- Enable push notifications for replies

**Option B: Email notifications**
- Set up email forwarding from Instantly to personal email
- Set phone to alert on Instantly emails

**Why it matters:** Responding immediately maintains conversational momentum. Delays cause leads to forget about you.

---

### Omnichannel Follow-up (Tunisia-Adapted)

**What you CAN do:**
- LinkedIn follow-up - Find practice on LinkedIn, connect with office manager
- Email sequence - 4 emails over 14 days
- Immediate reply - If they respond interested, follow up within 1 hour

**What to skip:**
- Phone calls (international rates)
- SMS follow-up to business phone

---

## Upgraded Email Campaign (Hormozi Principles)

### Email 1 (Day 0) - Pattern Interrupt + Pain

**Subject:** `quick question about {{city}} no-shows`

```
Hey {{first_name}},

Saw {{full_name}} has great reviews — quick question.

How many patients ghost their appointments each week? Most {{city}} practices I talk to lose $500-1,000/week to no-shows.

I built a simple tool that texts patients before their appointment. Syncs with Google Calendar, takes 10 minutes to set up, costs 1/6th what Weave charges.

Worth a 10-min call to see if it'd help?

— Rami

P.S. It's $49/month, not $300+ like the big guys.
```

**Why it works:**
- City personalization (feels 1-to-1)
- Specific pain point with dollar amount
- Competitor comparison (you're cheaper)
- Low-commitment CTA
- P.S. line = second hook

---

### Email 2 (Day 3) - Reply-Style Follow-up

**Subject:** `re: quick question about {{city}} no-shows`

```
Hey {{first_name}},

Floating this back up — saw you're in {{city}} and figured this might be useful.

Most dental practices spend $300+/month on patient communication software. Mine does one thing really well (SMS reminders) for $49/month.

Worth a quick look?

— Rami
```

**Why it works:**
- "re:" makes it look like a reply (higher open rates)
- Short and direct
- Reinforces price advantage

---

### Email 3 (Day 7) - Breakup + Lead Magnet

**Subject:** `closing the loop on no-shows`

```
Hey {{first_name}},

Haven't heard back — totally fine if the timing's off.

Before I go, here's a quick way to see what no-shows are actually costing {{full_name}}:

→ [No-Show Cost Calculator] (link to ROI calculator)

Takes 30 seconds. Might surprise you.

If reducing no-shows becomes a priority, I'm around.

— Rami
```

**Why it works:**
- Gives value even if they don't reply (Big Fast Value)
- Creates curiosity
- Soft close, not pushy
- They might come back later

---

### Email 4 (Day 14) - Last Chance

**Subject:** `last one from me`

```
Hey {{first_name}},

This is my last email — I promise.

If you ever want to stop losing $500+/week to no-shows, the offer stands:

- 7-day free trial
- $49/month (not $300+ like Weave)
- Set up in 10 minutes

Just reply "interested" and I'll send you the link.

— Rami
```

---

## Reply Templates

### When they reply "interested" or "tell me more"

```
Awesome — thanks for getting back to me {{first_name}}!

Here's the quick version:

1. You connect your Google Calendar (takes 2 minutes)
2. Set when reminders go out (1 week, 1 day, same day)
3. Patients get a text like: "Reminder: Your appointment at {{full_name}} is tomorrow at 2pm"

That's it. No complex setup, no contracts.

Want to try it free for 7 days? Here's the link: smsremindful.com

Or if you'd rather I walk you through it, grab a time here: [Calendly link]

— Rami
```

### When they ask about price

```
Great question!

$49/month for 300 SMS (Starter plan)
$99/month for 800 SMS (Growth - most popular)
$149/month for 2,000 SMS (Pro)

No contracts, cancel anytime. Compare that to Weave at $300+/month or Solutionreach at $329/month.

Want to try it free for 7 days?

— Rami
```

### When they say "we already have something"

```
Got it — mind if I ask what you're using?

If it's working well, I won't bug you. But if you're paying $200+/month for features you don't use, might be worth a look at something simpler.

Either way, appreciate the response!

— Rami
```

### When they say "not right now" or "maybe later"

```
Totally understand — timing matters.

I'll check back in a month or two. In the meantime, if no-shows become a bigger issue, here's a quick calculator to see what they're costing you:

→ [ROI Calculator link]

Talk soon!

— Rami
```

---

## Expected Results

| Metric | Target | Projected |
|--------|--------|-----------|
| Emails sent | 177 | Week 1: ~90, Week 2: ~87 |
| Open rate | 50%+ | ~90 opens |
| Reply rate | 5-10% | 9-18 replies |
| Demo bookings | 30% of replies | 3-5 demos |
| Close rate | 30-40% | 1-2 customers |

**Week 1-2 goal:** 1-2 paying customers = $39-238 MRR

---

## Action Items Checklist

### This Week (Before Launch)
- [ ] Build ROI Calculator - Simple page: inputs → output savings estimate
- [ ] Set up Calendly - 15-min "Quick Demo" slot
- [ ] Download Instantly app - Enable push notifications
- [ ] Create email sequence in Instantly - Use templates above
- [ ] Complete production testing (cron, Stripe, Google Calendar)

### Before Email Launch
- [ ] Wait for A2P approval (needed for reliable SMS delivery)
- [ ] Warmup hits 7+ days (check Instantly dashboard)

### Launch Day
- [ ] Upload 177 leads CSV to Instantly
- [ ] Start at 30 emails/day
- [ ] Send Tuesday-Thursday only, 9-11am recipient time
- [ ] Monitor replies, respond within 1 hour

---

## Support & Contacts

- **Technical Issues:** GitHub Issues
- **Billing Questions:** support@smsremindful.com
- **Custom Plans:** enterprise@smsremindful.com

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 15, 2025 | Initial complete scope document |
| 1.1 | Jan 15, 2025 | Production deployment complete, testing in progress |
| 1.2 | Jan 15, 2025 | Added sales/marketing strategy, detailed roadmap, 90-day goals |
| 1.3 | Jan 15, 2025 | Added research analysis, upgraded email campaign, reply templates |
| 1.4 | Jan 16, 2025 | Stripe live payment tested, credits fix, portal confirmed |
| 1.5 | Jan 16, 2025 | Added onboarding wizard (3-step flow), SMS 0-credit enforcement, smart error messages |
| 1.6 | Jan 17, 2025 | Updated pricing to $49/$99/$149. Renamed plans: Solo→Starter, Practice→Growth, Clinic→Pro. Added no-show cost calculator improvements, blog with research posts, reframed comparison section |
| 1.7 | Jan 17, 2025 | Completed AI/SEO tasks: public /pricing page with accordion FAQ, robots.txt, sitemap.ts, meta tags, JSON-LD schemas (StructuredData.tsx), llms.txt. Made product generic for all appointment-based businesses |
| 1.8 | Jan 17, 2025 | Completed all AI/SEO and landing page tasks: /features page, /faq page with schema, /compare page, Organization schema, completely redesigned homepage with hero, stats, how it works, benefits, industries, pricing preview, and CTA sections |
| 1.9 | Jan 18, 2025 | **PRODUCTION LAUNCH:** Deployed to Vercel, all features tested, Google OAuth verified, Stripe webhooks working, created reusable CTASection component, added core reliability focus, phone number handling spec, calendar integrations strategy |

---

## Next Steps (January 19, 2025)

### Immediate Priority

| Task | Priority | Notes |
|------|----------|-------|
| Add demo video to landing page | HIGH | Show product in action |
| Twilio delivery status webhooks | HIGH | Know if SMS actually delivered |
| Customer outreach begins | HIGH | Start getting customers |
| Phone validation before sending | MEDIUM | Validate numbers are real |

### Core Feature Reliability Focus

**Philosophy: Perfect the core before adding new features**

```
The core must work flawlessly:
1. Calendar sync → Works perfectly, no edge cases
2. Templates → Variables interpolate correctly, preview matches actual SMS
3. Scheduling → 1 week / 1 day / same day timings are precise
4. SMS Delivery → 100% success rate (tracked with delivery webhooks)
```

**SMS Delivery - Path to 100%:**
1. Twilio delivery webhooks - Know exactly which messages delivered/failed
2. Retry failed sends - Auto-retry once if failed
3. Phone validation - Verify numbers are valid before sending
4. Dashboard alerts - Show failed deliveries prominently

---

## Feature Spec: Smart Phone Number Handling

### Problem
Calendars don't have a dedicated phone number field. Numbers may be in description, title, location, or nowhere.

### Solution: Hybrid Approach

**Priority order when appointment syncs:**
1. **Contact Database Match** - Check if client name exists in saved contacts → Use stored phone
2. **Smart Extraction** - Regex scan description/title/location for phone patterns → Ask user to verify
3. **Google Contacts Lookup** - Check Google Contacts by attendee email → Ask user to verify
4. **Manual Entry** - No phone found → Flag for user to add manually

### Components to Build

| Component | Description | Priority |
|-----------|-------------|----------|
| Contact Database | Store client name + phone, reuse across appointments | High |
| Phone Regex Parser | Extract phone patterns from event text fields | High |
| Verification UI | "We found XXX-XXX-XXXX. Is this correct?" modal | High |
| Google Contacts OAuth | Additional scope to read contacts | Medium |
| CSV Import | Bulk upload name + phone pairs | Medium |
| Client Self-Service | Email/form for client to provide their own number | Low |

### Phone Extraction Patterns
```
Formats to detect:
- (555) 123-4567
- 555-123-4567
- 555.123.4567
- 5551234567
- +1 555 123 4567
- +15551234567

Scan fields:
- Event description
- Event title
- Location field
- Attendee notes (if available)
```

### Contact Database Schema
```typescript
interface Contact {
  id: string
  userId: string
  name: string           // "Sarah Johnson"
  normalizedName: string // "sarah johnson" (for matching)
  phone: string
  email?: string
  createdAt: Date
  lastAppointment?: Date
}
```

### User Flow
```
Appointment syncs → No phone in event
↓
Check contacts by name → Not found
↓
Parse event fields → Found "Call 555-1234"
↓
Show verification: "Is 555-1234 correct for John Smith?"
↓
User confirms → Save to contacts + appointment
↓
Future "John Smith" appointments auto-matched
```

---

## Feature Spec: Calendar Integrations Strategy

### Goal
Support all major calendar platforms to maximize market reach.

### Calendar Platforms to Support

| Calendar | API Type | Complexity | Priority |
|----------|----------|------------|----------|
| Google Calendar | REST API (OAuth) | DONE | Implemented |
| Outlook/Microsoft 365 | Microsoft Graph API | Medium | High |
| Calendly | REST API + Webhooks | Easy | High |
| Cal.com | REST API + Webhooks | Easy | Medium |
| Acuity Scheduling | REST API | Easy | Medium |
| iCloud Calendar | CalDAV (no official API) | Hard | Low |

### Notes
- **Calendly/Cal.com/Acuity** are easier than Google - they push events via webhooks
- **iCloud** is hardest - Apple has no public API, would need CalDAV implementation
- **Outlook** uses Microsoft Graph API - similar to Google OAuth flow

---

## Discussion: Why Us? (Value Proposition)

### Open Questions to Explore
- Why should a customer choose SMS Remindful?
- What guarantees can we offer?
- What's our availability promise?
- How do we stand out from competitors?

### Current Differentiators

| Factor | Our Angle | Notes |
|--------|-----------|-------|
| Price | 5-7x cheaper than Weave/Solutionreach | $49 vs $300+ |
| Simplicity | Setup in 5 minutes, no training needed | One thing done well |
| No contracts | Month-to-month, cancel anytime | Zero risk |
| Delivery guarantee | ??? | Need to define SLA |
| Uptime/Availability | ??? | Need to define SLA |
| Support | ??? | Email? Chat? Response time? |

### Questions to Answer
1. Do we offer a delivery guarantee? (e.g., "99% delivery rate or money back")
2. Do we offer uptime SLA? (e.g., "99.9% uptime")
3. What's our support promise? (e.g., "Response within 24 hours")
4. Can we offer a "no no-show guarantee"? (e.g., "Reduce no-shows or refund")
5. Free trial extension if they're not seeing results?

### Messaging Ideas
- "Set it and forget it" - fully automated
- "We do one thing, and we do it perfectly"
- "Your reminders, delivered. Guaranteed."
- "The affordable alternative that actually works"

*To be discussed and finalized*

---

*This document represents the complete scope of SMS Remindful MVP.*
*Production URL: https://smsremindful.com*

