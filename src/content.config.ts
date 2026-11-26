import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const tools = defineCollection({
  loader: file('src/data/tools.json'),
  schema: z.object({
    name: z.string(),
    vendor: z.string(),
    category: z.enum(['assistants', 'coding', 'image', 'video', 'voice', 'search', 'meetings', 'productivity']),
    url: z.string().url(),
    pricingUrl: z.string().url(),
    startingPrice: z.string(), // human readable, e.g. "Free · paid from $20/mo"
    freeTier: z.boolean(),
    pricing: z.enum(['Free', 'Freemium', 'Paid']),
    bestFor: z.string(),
    summary: z.string(),
    color: z.string(), // brand-neutral accent used for the monogram badge
    // Explainer data: what goes in, what the tool does, what comes out.
    inputs: z.array(z.string()).default([]),
    does: z.string().optional(),
    outputs: z.array(z.string()).default([]),
    strengths: z.array(z.string()).default([]),
    watchOut: z.array(z.string()).default([]),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().min(110).max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    lastVerified: z.coerce.date(), // date prices/features were last checked against vendor pages
    category: z.enum(['assistants', 'coding', 'image', 'video', 'voice', 'search', 'meetings', 'productivity']),
    type: z.enum(['versus', 'best', 'guide']),
    tools: z.array(reference('tools')).min(1),
    verdict: z.string().min(80).max(400), // the 2–3 sentence "short answer" AI engines quote
    picks: z
      .array(z.object({ useCase: z.string(), tool: reference('tools'), why: z.string() }))
      .default([]),
    comparison: z
      .object({
        rows: z.array(z.object({ label: z.string(), values: z.array(z.string()) })),
      })
      .optional(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    sources: z.array(z.object({ title: z.string(), url: z.string().url() })).default([]),
    heroAlt: z.string(),
    // Verified, attributed opinions from named practitioners and reviewers. Quotes must be verbatim from `url`.
    voices: z
      .array(
        z.object({
          tool: reference('tools'),
          quote: z.string().max(320),
          name: z.string(),
          role: z.string(),
          source: z.string(),
          url: z.string().url(),
          date: z.string(),
        })
      )
      .default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { tools, articles };
