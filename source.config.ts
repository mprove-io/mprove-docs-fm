import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { MALLOY_GRAMMAR } from './lib/grammar/malloy-grammar';

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections#define-docs
export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
    rehypeCodeOptions: {
      langs: [
        MALLOY_GRAMMAR as any,
      ],
      themes: {
        light: 'light-plus',
        dark: 'dark-plus'
      },
    },
  },
});
