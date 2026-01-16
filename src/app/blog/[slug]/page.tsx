import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPost, getAllBlogPosts } from '@/features/blog/posts'
import { BlogContent } from '@/features/blog/types'
import { Footer } from '@/components/layout/Footer'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: `${post.title} | SMS Remindful Blog`,
    description: post.description,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      url: `https://smsremindful.com/blog/${post.slug}`,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `https://smsremindful.com/blog/${post.slug}`,
    },
  }
}

function renderContent(content: BlogContent, index: number) {
  switch (content.type) {
    case 'paragraph':
      return (
        <p key={index} className="text-muted-foreground leading-relaxed">
          {content.text}
        </p>
      )

    case 'heading':
      if (content.level === 2) {
        return (
          <h2 key={index} className="text-xl sm:text-2xl font-semibold text-foreground mt-10 mb-4">
            {content.text}
          </h2>
        )
      }
      return (
        <h3 key={index} className="text-lg font-semibold text-foreground mt-8 mb-3">
          {content.text}
        </h3>
      )

    case 'list':
      return (
        <ul key={index} className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          {content.items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      )

    case 'stat':
      return (
        <div
          key={index}
          className="bg-muted/50 border rounded-xl p-6 my-6 text-center"
        >
          <p className="text-4xl sm:text-5xl font-bold text-foreground mb-2">{content.value}</p>
          <p className="text-muted-foreground">{content.label}</p>
          {content.source && (
            <p className="text-xs text-muted-foreground/70 mt-2">Source: {content.source}</p>
          )}
        </div>
      )

    case 'quote':
      return (
        <blockquote
          key={index}
          className="border-l-4 border-foreground/20 pl-6 py-2 my-6 italic text-muted-foreground"
        >
          <p className="leading-relaxed">&ldquo;{content.text}&rdquo;</p>
          {(content.author || content.source) && (
            <cite className="block text-sm mt-2 not-italic">
              — {content.author ? content.author : content.source}
              {content.author && content.source && `, ${content.source}`}
            </cite>
          )}
        </blockquote>
      )

    case 'callout':
      return (
        <div
          key={index}
          className="bg-green-50 border border-green-200 rounded-xl p-6 my-8"
        >
          <p className="font-semibold text-green-800 mb-2">{content.title}</p>
          <p className="text-green-700 mb-4">{content.text}</p>
          <Link
            href="/no-show-cost-calculator"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer"
          >
            Try the Calculator →
          </Link>
        </div>
      )

    case 'source':
      return (
        <div key={index} className="flex items-start gap-3 py-2">
          <span className="text-muted-foreground">•</span>
          <div>
            <a
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline font-medium"
            >
              {content.title}
            </a>
            {content.publisher && (
              <span className="text-muted-foreground"> — {content.publisher}</span>
            )}
          </div>
        </div>
      )

    default:
      return null
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const categoryLabels = {
    research: 'Research',
    guides: 'Guides',
    industry: 'Industry',
  }

  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        {/* Navigation */}
        <nav className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Blog
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-2.5 py-1 bg-muted rounded-md text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {categoryLabels[post.category]}
            </span>
            <span className="text-sm text-muted-foreground">{post.readingTime}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-6">{post.description}</p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>By {post.author.name}</span>
            <span>•</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>
        </header>

        {/* Content */}
        <div className="space-y-4">{post.content.map((block, i) => renderContent(block, i))}</div>

        {/* CTA */}
        <section className="mt-12 bg-foreground text-background rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Start Reducing No-Shows Today</h2>
          <p className="text-background/70 mb-6">
            7-day free trial • 20 SMS included • No credit card required
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-8 py-3 text-base font-semibold text-foreground bg-background rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
          >
            Start Free Trial →
          </Link>
        </section>

        <Footer />
      </article>
    </main>
  )
}
