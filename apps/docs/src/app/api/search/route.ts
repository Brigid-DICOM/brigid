import { createFromSource } from 'fumadocs-core/search/server';
import { source } from '@/lib/source';
import { createTokenizer } from '@orama/tokenizers/mandarin';

export const revalidate = false;

export const { staticGET: GET } = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  localeMap: {
    'zh-TW': {
      components: {
        tokenizer: createTokenizer()
      },
      search: {
        threshold: 0,
        tolerance: 0
      }
    }
  }
});
