'use client';
import SearchDialog from '@/components/search';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { type ReactNode } from 'react';
import { type I18nProviderProps } from 'fumadocs-ui/contexts/i18n';

export function Provider({ children, i18n }: { children: ReactNode, i18n: Omit<I18nProviderProps, 'children'> }) {
  return <RootProvider search={{ SearchDialog }} i18n={i18n}>{children}</RootProvider>;
}
