import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { i18n } from '@/lib/i18n';

export async function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default async function Layout({ params, children }: LayoutProps<'/[lang]/docs'>) {
  const { lang } = await params;

  return (
    <DocsLayout tree={source.getPageTree(lang)} {...baseOptions(lang)}>
      {children}
    </DocsLayout>
  );
}
