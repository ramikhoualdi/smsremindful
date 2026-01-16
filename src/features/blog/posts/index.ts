import { BlogPostWithContent } from '../types'
import { costOfNoShowsPost } from './cost-of-no-shows-dental-practices'
import { smsVsEmailVsPhonePost } from './sms-vs-email-vs-phone-reminders'
import { howToReduceNoShowsPost } from './how-to-reduce-dental-no-shows'

export const blogPosts: BlogPostWithContent[] = [
  costOfNoShowsPost,
  smsVsEmailVsPhonePost,
  howToReduceNoShowsPost,
]

export function getBlogPost(slug: string): BlogPostWithContent | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getAllBlogPosts(): BlogPostWithContent[] {
  return blogPosts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getFeaturedPosts(): BlogPostWithContent[] {
  return blogPosts.filter((post) => post.featured)
}
