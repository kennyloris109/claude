import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getArticles, articleUrl } from '../lib/site';
import { SITE } from '../site.config.mjs';

export async function GET(context: APIContext) {
  const articles = await getArticles();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site!,
    items: articles.map((a) => ({
      title: a.data.title,
      description: `${a.data.verdict} ${a.data.description}`,
      pubDate: a.data.updatedDate,
      link: articleUrl(a),
    })),
  });
}
