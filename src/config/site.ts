// Site configuration - REQUIRES APPROVAL FOR CHANGES
// Contact Rami before modifying this file

export const siteConfig = {
  name: 'SMS Remindful',
  ogTitle: 'SMS Remindful - Automated SMS Appointment Reminders', // 51 chars (optimal: 50-60)
  description:
    'Reduce no-shows by up to 50% with automated SMS reminders. Syncs with Google Calendar. Perfect for any appointment-based business.', // 131 chars (optimal: 110-160)
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://smsremindful.com',
  ogImage: '/og-image.png',
  links: {
    twitter: '', // TODO: Add social links
    github: '',
  },
  creator: 'SMS Remindful',
  keywords: [
    'SMS reminders',
    'appointment reminders',
    'reduce no-shows',
    'automated SMS',
    'Google Calendar reminders',
    'appointment reminder software',
    'dental appointment reminders',
    'salon appointment reminders',
    'client reminders',
    'booking reminders',
  ] as string[],
}

export type SiteConfig = typeof siteConfig
