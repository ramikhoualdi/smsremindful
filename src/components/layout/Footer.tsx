'use client'

import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="border-t py-12 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="SMS Remindful"
                width={28}
                height={28}
                className="rounded-lg object-contain"
              />
              <span className="text-lg font-bold">SMS Remindful</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Automated SMS appointment reminders for businesses that value
              their time.
            </p>
          </div>
          <div>
            <div className="font-semibold mb-4">Product</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/features" className="hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-4">Resources</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/blog" className="hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/no-show-cost-calculator"
                  className="hover:text-foreground"
                >
                  No-Show Calculator
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-4">Legal</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/legal/terms-of-service"
                  className="hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy-policy"
                  className="hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SMS Remindful. All rights
            reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Questions?{' '}
            <a
              href="mailto:hey@smsremindful.com"
              className="underline hover:text-foreground"
            >
              hey@smsremindful.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
