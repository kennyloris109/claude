import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const tools = defineCollection({
  loader: file('src/data/tools.json'),
  schema: z.object({
    name: z.string(),
    vendor: z.string(),
    category: z.enum(['assistants', 'coding', 'image', 'search', 'meetings']),
    url: z.string().url(),
    pricingUrl: z.string().url(),
    startingPrice: z.string(), // human readable, e.g. "Free · paid from $20/mo"
    freeTier: z.boolean(),
    bestFor: z.string(),
    summary: z.string(),
    color: z.string(), // brand-neutral accent used for the monogram badge
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
    category: z.enum(['assistants', 'coding', 'image', 'search', 'meetings']),
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
    draft: z.boolean().default(false),
  }),
});

export const collections = { tools, articles };
