import { getCollection, type CollectionEntry } from 'astro:content';

export const CATEGORIES = {
  assistants: { label: 'AI chatbots', blurb: 'General-purpose assistants for writing, research and everyday questions.' },
  coding: { label: 'AI coding tools', blurb: 'Editors, agents and completions that write and change code.' },
  image: { label: 'AI image generators', blurb: 'Tools that turn a prompt into photos, art, posters and graphics.' },
  search: { label: 'AI search engines', blurb: 'Answer engines that search the web and cite what they find.' },
  meetings: { label: 'AI meeting notetakers', blurb: 'Bots that record, transcribe and summarise your calls.' },
} as const;

export type Category = keyof typeof CATEGORIES;

export async function getArticles() {
  const all = await getCollection('articles', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => b.data.updatedDate.valueOf() - a.data.updatedDate.valueOf());
}

export const articleUrl = (a: CollectionEntry<'articles'>) => `/compare/${a.id}/`;
export const heroUrl = (a: CollectionEntry<'articles'>) => `/images/hero/${a.id}.png`;

export function readingMinutes(body = '') {
  return Math.max(1, Math.round(body.split(/\s+/).length / 230));
}

export function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}
