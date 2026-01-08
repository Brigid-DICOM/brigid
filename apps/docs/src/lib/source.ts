import { docs } from 'fumadocs-mdx:collections/server';
import { type InferPageType, loader } from 'fumadocs-core/source';
import { i18n } from '@/lib/i18n';
import { icons } from 'lucide-react';
import { createElement } from 'react';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [],
  i18n,
  icon(icon) {
    if (!icon) return null;

    if (icon in icons) {
      return createElement(icons[icon as keyof typeof icons]);
    }
  }
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title}

${processed}`;
}
