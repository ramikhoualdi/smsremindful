// Site configuration - REQUIRES APPROVAL FOR CHANGES
// Contact Rami before modifying this file

export const siteConfig = {
  name: 'SMS Remindful',
  description:
    'Reduce no-shows with automated SMS appointment reminders. Syncs with Google Calendar. Perfect for dental practices, salons, coaches, consultants, and any appointment-based business.',
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
