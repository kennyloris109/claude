import { getEntries } from 'astro:content';
import { getArticles, articleUrl } from '../lib/site';
import { SITE } from '../site.config.mjs';

export async function GET() {
  const articles = await getArticles();
  const parts = await Promise.all(
    articles.map(async (a) => {
      const picks = await Promise.all(a.data.picks.map(async (p) => `- ${p.useCase}: ${(await getEntries([p.tool]))[0].data.name}. ${p.why}`));
      return [
        `# ${a.data.title}`,
        `URL: ${SITE.url}${articleUrl(a)}`,
        `Updated: ${a.data.updatedDate.toISOString().slice(0, 10)} (prices last checked ${a.data.lastVerified.toISOString().slice(0, 10)})`,
        '',
        `Short answer: ${a.data.verdict}`,
        '',
        picks.length ? 'Picks by use case:\n' + picks.join('\n') : '',
        '',
        a.body ?? '',
        '',
        a.data.faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n'),
      ].join('\n');
    })
  );
  return new Response(`# ${SITE.name}: full content\n\n` + parts.join('\n\n---\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
