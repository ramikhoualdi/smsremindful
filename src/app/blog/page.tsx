import { Metadata } from 'next'
import Link from 'next/link'
import { getAllBlogPosts } from '@/features/blog/posts'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Blog | SMS Remindful - Business Insights',
  description:
    'Research-backed articles on reducing no-shows, appointment reminders, and practice management. Learn strategies to recover lost revenue.',
  keywords: [
    'appointment reminder blog',
    'reduce no-shows',
    'appointment reminder tips',
    'practice management',
    'SMS reminders research',
  ],
  openGraph: {
    title: 'Blog | SMS Remindful',
    description:
      'Research-backed articles on reducing no-shows and improving business efficiency.',
    type: 'website',
    url: 'https://smsremindful.com/blog',
  },
  alternates: {
    canonical: 'https://smsremindful.com/blog',
  },
}

const categoryLabels = {
  research: 'Research',
  guides: 'Guides',
  industry: 'Industry',
}

export default function BlogPage() {
  const posts = getAllBlogPosts()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Blog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Research-backed insights on reducing no-shows and improving your
              business.
            </p>
          </header>

        {/* Blog Posts */}
        <section className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-card border rounded-xl p-6 sm:p-8 hover:border-foreground/20 transition-colors"
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-2.5 py-1 bg-muted rounded-md text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {categoryLabels[post.category]}
                </span>
                <span className="text-sm text-muted-foreground">{post.readingTime}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <time className="text-sm text-muted-foreground" dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              </div>

              <Link href={`/blog/${post.slug}`} className="group">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground group-hover:underline mb-3">
                  {post.title}
                </h2>
              </Link>

              <p className="text-muted-foreground mb-4 leading-relaxed">{post.description}</p>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-sm font-medium text-foreground hover:underline"
              >
                Read article →
              </Link>
            </article>
          ))}
        </section>

          {/* CTA */}
          <section className="mt-16 bg-foreground text-background rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Ready to Reduce No-Shows?</h2>
            <p className="text-background/70 mb-6">
              Start your free trial and see results within the first week.
            </p>
            <Link
              href="/sign-up"
              className="inline-block px-8 py-3 text-base font-semibold text-foreground bg-background rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
            >
              Start Free Trial →
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
