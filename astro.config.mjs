// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import fs from 'node:fs';
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
    // 'auto': una única hoja CSS externa con hash (/_astro/*.css), cacheable e
    // inmutable, en vez de repetir el CSS inline en cada HTML.
    inlineStylesheets: 'auto',
    // format: se deja el default ('directory' → ruta/index.html). Con
    // trailingSlash 'never' sirve /ruta con 200 en Hostinger (adapter node) y
    // hosts estáticos. Con 'file' (ruta.html) el adapter @astrojs/node NO
    // resuelve la ruta (ver README, sección Despliegue).
  },
  // Prefetch entre páginas: al pasar el cursor / tocar el enlace (hover) se
  // precarga el HTML destino; respeta base y Save-Data.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  i18n: {
    defaultLocale: process.env.PUBLIC_SITE_LANG ?? 'es',
    locales: (process.env.PUBLIC_I18N_LOCALES ?? 'es').split(',').map(l => l.trim()).filter(Boolean),
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    mdx(),
    // Parche para Astro 5: conserva en dist/_astro el ORIGINAL de cada imagen
    // importada (aunque solo se sirvan las variantes optimizadas de getImage).
    // Se borran los originales que ningún HTML/CSS/JS referencia, para no
    // publicar fotos de varios MB sin usar. Revisar si se actualiza Astro.
    {
      name: 'prune-unreferenced-originals',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const root = fileURLToPath(dir);
          const assetsDir = path.join(root, '_astro');
          if (!fs.existsSync(assetsDir)) return;
          const textExt = /.(html|css|js|mjs|json|xml|txt|webmanifest|svg)$/i;
          let haystack = '';
          const walk = (d) => {
            for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
              const full = path.join(d, entry.name);
              if (entry.isDirectory()) walk(full);
              else if (textExt.test(entry.name)) haystack += fs.readFileSync(full, 'utf8');
            }
          };
          walk(root);
          for (const name of fs.readdirSync(assetsDir)) {
            if (/.(avif|webp|jpe?g|png)$/i.test(name) && !haystack.includes(name)) {
              fs.rmSync(path.join(assetsDir, name));
            }
          }
        },
      },
    },
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
    // Con inlineStylesheets "auto", el CSS propio de una página menor a este umbral
    // (bytes) se inlinea en su HTML en vez de generar una 2.ª hoja externa (p. ej.
    // contact). Así cada página carga una sola hoja externa (la compartida).
    build: { assetsInlineLimit: 8192 },
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
  },
});
