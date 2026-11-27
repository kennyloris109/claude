import { SITE } from '../site.config.mjs';

// AI crawlers are explicitly welcome: being read by them is how a site gets cited in
// ChatGPT, Claude, Perplexity, Gemini and Google AI Overviews.
const aiBots = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended', 'Bingbot', 'DuckAssistBot', 'Meta-ExternalAgent', 'MistralAI-User', 'CCBot',
];

export function GET() {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    ...aiBots.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
    `Sitemap: ${SITE.url}/sitemap-index.xml`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
