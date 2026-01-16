import Link from 'next/link'

interface FooterProps {
  showAbout?: boolean
}

export function Footer({ showAbout = false }: FooterProps) {
  return (
    <footer className="mt-12 pt-8 border-t">
      {showAbout && (
        <section className="text-center text-sm text-muted-foreground mb-6">
          <p className="mb-1">
            <span className="font-medium text-foreground">SMS Remindful</span> is a simple,
            affordable SMS appointment reminder service designed specifically for dental practices.
          </p>
          <p>
            Syncs with Google Calendar • Automated reminders • Plans from $49/month
          </p>
        </section>
      )}

      <div className={`${showAbout ? 'pt-4 border-t' : ''} text-center`}>
        <Link href="/" className="text-sm font-medium text-foreground hover:underline">
          smsremindful.com
        </Link>
        <span className="mx-3 text-muted-foreground">•</span>
        <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
          Blog
        </Link>
        <p className="text-xs text-muted-foreground mt-1">
          © {new Date().getFullYear()} SMS Remindful. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
