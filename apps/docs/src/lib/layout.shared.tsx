import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { i18n } from './i18n';

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    i18n,
    nav: {
      title: locale === 'en' ? "Brigid Docs" : "Brigid 文件",
    },
    githubUrl: "https://github.com/Brigid-DICOM/brigid"
  };
}
