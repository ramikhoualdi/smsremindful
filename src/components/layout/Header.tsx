'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="SMS Remindful"
          width={32}
          height={32}
          className="rounded-lg object-contain"
        />
        <span className="text-xl font-bold">SMS Remindful</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link
          href="/features"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Features
        </Link>
        <Link
          href="/pricing"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Pricing
        </Link>
        <Link
          href="/faq"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          FAQ
        </Link>
      </nav>
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/sign-up">Start Free Trial</Link>
        </Button>
      </div>
    </header>
  )
}
