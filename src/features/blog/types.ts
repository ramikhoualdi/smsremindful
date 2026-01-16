import { z } from 'zod'

export const blogPostSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  author: z.object({
    name: z.string(),
    role: z.string().optional(),
  }),
  category: z.enum(['research', 'guides', 'industry']),
  readingTime: z.string(),
  featured: z.boolean().default(false),
})

export type BlogPost = z.infer<typeof blogPostSchema>

export interface BlogPostWithContent extends BlogPost {
  content: BlogContent[]
}

export type BlogContent =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'stat'; value: string; label: string; source?: string }
  | { type: 'quote'; text: string; author?: string; source?: string }
  | { type: 'callout'; title: string; text: string }
  | { type: 'source'; title: string; url: string; publisher?: string }
