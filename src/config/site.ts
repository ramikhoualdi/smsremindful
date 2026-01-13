// Site configuration - REQUIRES APPROVAL FOR CHANGES
// Contact Rami before modifying this file

export const siteConfig = {
  name: 'SMS Remindful',
  description:
    'Never miss another patient appointment. Automated SMS reminders for your dental practice.',
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
    'dental practice',
    'dentist software',
    'patient reminders',
    'automated SMS',
  ] as string[],
}

export type SiteConfig = typeof siteConfig
