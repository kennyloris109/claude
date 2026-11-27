import { getCollection } from 'astro:content';
import { getArticles, articleUrl, CATEGORIES } from '../lib/site';
import { SITE } from '../site.config.mjs';

// llms.txt: a plain-text map of the site for LLM agents and answer engines (llmstxt.org).
export async function GET() {
  const articles = await getArticles();
  const tools = await getCollection('tools');
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    'Each comparison starts with a short verdict, then a pick per use case, a side-by-side table, the reasoning and FAQs. Prices show the date we last checked them against official vendor pages.',
    '',
    '## Comparisons',
    ...articles.map((a) => `- [${a.data.title}](${SITE.url}${articleUrl(a)}): ${a.data.verdict}`),
    '',
    '## Tools',
    ...tools.map((t) => `- [${t.data.name}](${SITE.url}/tools/${t.id}/): ${t.data.summary} Price: ${t.data.startingPrice}.`),
    '',
    '## Categories',
    ...Object.entries(CATEGORIES).map(([id, c]) => `- [${c.label}](${SITE.url}/category/${id}/): ${c.blurb}`),
    '',
    '## Optional',
    `- [Full text of every comparison](${SITE.url}/llms-full.txt)`,
    `- [How we compare](${SITE.url}/methodology/)`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
