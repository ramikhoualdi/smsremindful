import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free No-Show Cost Calculator | SMS Remindful',
  description:
    'Calculate how much appointment no-shows cost your business annually. Free ROI calculator shows potential savings with automated SMS reminders. Works for dental, salons, coaches, and any appointment-based business.',
  keywords: [
    'no-show cost calculator',
    'appointment no-show calculator',
    'appointment reminder ROI',
    'business revenue loss calculator',
    'SMS reminder savings calculator',
    'reduce appointment no-shows',
    'appointment reminder software cost',
    'client appointment reminders',
    'missed appointment calculator',
    'no-show rate calculator',
  ],
  openGraph: {
    title: 'Free No-Show Cost Calculator',
    description:
      'Calculate how much appointment no-shows cost your business. See potential savings with SMS reminders.',
    type: 'website',
    url: 'https://smsremindful.com/no-show-cost-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free No-Show Cost Calculator',
    description:
      'Calculate how much appointment no-shows cost your business. See potential savings with SMS reminders.',
  },
  alternates: {
    canonical: 'https://smsremindful.com/no-show-cost-calculator',
  },
}

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return children
}
