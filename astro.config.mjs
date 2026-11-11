// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Canonical production domain — override per project via PUBLIC_SITE_URL
const SITE_URL = process.env.PUBLIC_SITE_URL ?? 'https://example.com';

// Keystatic CMS — enabled via env var (dev mode only)
const enableKeystatic = process.env.ASTRO_ENABLE_KEYSTATIC === 'true';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'never',
  build: {
    // Inline ALL CSS in the HTML: avoids render-blocking <link rel="stylesheet"> requests
    // (PageSpeed). Trade-off: HTML grows by the CSS weight; measure it (gzip) after build
    // and revisit to 'auto' if a project's CSS gets large.
    inlineStylesheets: 'always',
  },
  i18n: {
    defaultLocale: process.env.PUBLIC_SITE_LANG ?? 'es',
    locales: (process.env.PUBLIC_I18N_LOCALES ?? 'es').split(',').map(l => l.trim()).filter(Boolean),
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !['/thank-you', '/404', '/500', '/legal', '/privacy', '/cookies', '/keystatic']
          .some((p) => page.includes(p)),
    }),
    // Keystatic integration — only when ASTRO_ENABLE_KEYSTATIC=true
    ...(enableKeystatic
      ? [
          (await import('@keystatic/astro')).default(),
        ]
      : []),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
  },
});
