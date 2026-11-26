import { getCollection, type CollectionEntry } from 'astro:content';

export const CATEGORIES = {
  assistants: { label: 'AI chatbots', blurb: 'General-purpose assistants for writing, research and everyday questions.' },
  coding: { label: 'AI coding tools', blurb: 'Editors, agents and completions that write and change code.' },
  image: { label: 'AI image generators', blurb: 'Tools that turn a prompt into photos, art, posters and graphics.' },
  video: { label: 'AI video generators', blurb: 'Models that turn text or images into video clips.' },
  voice: { label: 'AI voice generators', blurb: 'Text-to-speech, voice cloning and dubbing.' },
  search: { label: 'AI search engines', blurb: 'Answer engines that search the web and cite what they find.' },
  meetings: { label: 'AI meeting notetakers', blurb: 'Bots that record, transcribe and summarise your calls.' },
  productivity: { label: 'AI presentation makers', blurb: 'Tools that build decks and documents from a prompt.' },
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

/** Tool ids that are the #1 pick of a published comparison ("Top pick" badge). */
export async function getPickedToolIds() {
  const articles = await getArticles();
  return new Set(articles.map((a) => a.data.picks[0]?.tool.id).filter(Boolean) as string[]);
}
