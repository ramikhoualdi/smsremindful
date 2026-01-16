import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free No-Show Cost Calculator for Dental Practices | SMS Remindful',
  description:
    'Calculate how much patient no-shows cost your dental practice annually. Free ROI calculator shows potential savings with automated SMS appointment reminders. Reduce no-shows by 30-50%.',
  keywords: [
    'dental no-show calculator',
    'patient no-show cost calculator',
    'dental appointment reminder ROI',
    'dental practice revenue loss',
    'SMS reminder savings calculator',
    'reduce dental no-shows',
    'appointment reminder software cost',
    'dental practice management',
    'patient appointment reminders',
    'dental office no-show rate',
  ],
  openGraph: {
    title: 'Free No-Show Cost Calculator for Dental Practices',
    description:
      'Calculate how much patient no-shows cost your dental practice. See potential savings with SMS reminders.',
    type: 'website',
    url: 'https://smsremindful.com/no-show-cost-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free No-Show Cost Calculator for Dental Practices',
    description:
      'Calculate how much patient no-shows cost your dental practice. See potential savings with SMS reminders.',
  },
  alternates: {
    canonical: 'https://smsremindful.com/no-show-cost-calculator',
  },
}

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return children
}
