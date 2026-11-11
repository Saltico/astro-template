# Astro Static Template

A reusable, SEO-optimized static website template built with Astro, Tailwind CSS v4, and Keystatic CMS.

## Features

- **🚀 Static-first**: Blazing fast performance with Astro's static site generation
- **🎨 Tailwind CSS v4**: CSS-first configuration with design tokens
- **📝 Keystatic CMS**: Edit content locally with markdown + MDX support
- **🔍 SEO Optimized**: Built-in SEO components, structured data, sitemap
- **📊 Analytics**: Google Tag Manager + GA4 with consent mode
- **🎯 WordPress Ready**: Optional headless CMS integration

## Quick Start

```bash
npm install
npm run dev
```

Then visit:
- **Site**: http://localhost:4321
- **CMS Editor**: http://localhost:4321/keystatic (dev mode only)

## Project Structure

```
├── public/              # Solo lo que no se optimiza: favicon, logo (JSON-LD), robots.txt
│   └── img/og-default.jpg  # Default Open Graph image (JPG 1200x630)
├── src/
│   ├── assets/         # img/ (imágenes optimizadas por astro:assets), icons, fonts/ (self-hosted woff2 + OFL)
│   ├── components/     # Reusable components
│   │   ├── layout/     # Header, Footer, Navigation
│   │   ├── seo/        # SEO, JsonLd, Breadcrumbs
│   │   ├── analytics/  # GTM, ConsentBanner
│   │   └── ui/         # Container, Button, Icon, Img (imagen responsive), etc.
│   ├── content/        # Content collections (Keystatic)
│   │   ├── config.ts   # Collection schemas
│   │   ├── posts/      # Blog posts
│   │   └── pages/      # Editable pages
│   ├── data/           # Site configuration
│   │   └── site.ts     # Brand, contact, nav, footer
│   ├── layouts/        # BaseLayout, PostLayout
│   ├── lib/            # Utilities
│   │   ├── seo.ts      # Schema.org builders
│   │   ├── images.ts   # Resuelve '/img/x.avif' → src/assets/img (usado por Img.astro)
│   │   ├── analytics.ts # GTM helpers
│   │   └── wordpress-api.ts # Optional WP integration
│   ├── pages/          # Routes
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   └── blog/
│   │       ├── index.astro
│   │       └── [...slug].astro
│   ├── styles/         # Global styles
│   │   ├── tokens.css  # Design tokens (Tailwind v4)
│   │   └── base.css    # Base styles
│   └── types/          # TypeScript types
├── keystatic.config.ts # CMS configuration
├── astro.config.mjs    # Astro configuration
├── package.json
├── tsconfig.json
└── .env.example
```

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Variables:
- `PUBLIC_SITE_URL`: Canonical site URL (default: https://example.com)
- `PUBLIC_SITE_NAME`: brand name (header, JSON-LD, logo alt). `PUBLIC_CONTACT_ADDRESS` / `PUBLIC_CONTACT_SCHEDULE`: optional real data (empty by default, not rendered if empty).
- `PUBLIC_GTM_ID`: Google Tag Manager ID (optional). Takes priority over GA4.
- `PUBLIC_GA4_ID`: Google Analytics 4 ID (optional). Direct gtag.js is injected ONLY when `PUBLIC_GTM_ID` is empty; if both are set, only GTM is loaded (configure GA4 inside the GTM container to avoid double counting).
- `PUBLIC_I18N_LOCALES`: comma-separated locales (optional). With i18n enabled, `hreflang="x-default"` always points to the default-locale version of the page (e.g. `/en/about` -> `/about`).
- `WP_API_URL`: WordPress API URL (optional, for headless integration)

## Development

```bash
npm run dev          # Start dev server (localhost:4321)
npm run build        # Build for production
npm run preview      # Preview production build
```

## Content Management

### Using Keystatic (Default)

Edit content at `/keystatic` (dev mode only). Content is stored as markdown in `src/content/`.

Collections:
- **Posts**: Blog articles with title, description, publish date, draft flag
- **Pages**: Editable pages with title, description, noindex flag

### Migrating to WordPress

1. Set `WP_API_URL` in `.env`
2. Update blog routes to use `fetchPosts()` from `src/lib/wordpress-api.ts`
3. Map WordPress fields to your view model

See `src/lib/wordpress-api.ts` for the client implementation.

## SEO

Built-in SEO features:
- Auto-generated canonical URLs
- Open Graph meta tags
- Twitter Cards
- JSON-LD structured data (Organization, WebSite, Article)
- Sitemap (auto-generated, excludes legal pages)
- robots.txt

Configure in `src/lib/seo.ts` and `src/data/site.ts`.

### Open Graph por defecto

`public/img/og-default.jpg` (JPG 1200x630, <200 kB) es la og:image por defecto, con `og:image:width/height/type` (en `BaseLayout.astro`). Reemplázala por la imagen de marca del proyecto manteniendo formato JPG/PNG y 1200x630. Nunca uses AVIF/WebP como og:image (muchos scrapers no lo soportan).

### LocalBusiness (opcional)

`localBusinessSchema()` NO se inyecta por defecto y no tiene datos de relleno: devuelve `null` si faltan nombre y dirección reales. Úsalo solo para negocios con local físico o atención presencial (pásale datos reales y agrégalo a `jsonLd` de la página). Para eventos usa Organization + SportsEvent/Event; para negocios online, Organization.

## Fuentes (autoalojadas)

La plantilla incluye Archivo (titulares) e Inter (cuerpo) variables, subset latin, en `src/assets/fonts/` (licencia OFL en `OFL-*.txt`). Se declaran con `@font-face` + `font-display: swap` en `src/styles/base.css` y se precargan (máximo 2) en `BaseLayout.astro` con import `?url`. No hay Google Fonts ni CDN.

Cambiar fuentes en un proyecto:
1. Obtén el woff2 latin sin dejar dependencias: `npm pack @fontsource-variable/<fuente>` (o `@fontsource/<fuente>` para pesos estáticos), extrae el tgz y copia de `package/files/` solo `<fuente>-latin-wght-normal.woff2` (o los `-latin-400/700-normal.woff2` usados) y el `LICENSE` como `OFL-<fuente>.txt`. Alternativa: `npm i -D @fontsource...`, copiar los archivos y `npm uninstall`.
2. Borra las fuentes anteriores, actualiza los `@font-face` (familia, peso, ruta; mantén el `unicode-range` latin) y los imports `?url` del preload en `BaseLayout.astro`.
3. Ajusta `--font-heading` / `--font-body` en `tokens.css`. Incluye solo los pesos que use el CSS.

## Analytics

Conditional loading: analytics scripts only load when IDs are provided in `.env`.

Includes:
- Google Tag Manager
- Google Analytics 4
- Consent Mode v2 support
- Event tracking for clicks, downloads, outbound links

### Consentimiento (cookies)

- No hay página de cookies: `ConsentBanner` explica brevemente qué se guarda (analítica) y para qué.
- Solo se renderiza (banner, default de consentimiento y botón del footer) si hay `PUBLIC_GTM_ID` o `PUBLIC_GA4_ID`.
- El `consent default` (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage` = denied) vive SOLO en el `<head>` de `BaseLayout.astro`, antes de GTM/GA4.
- El banner lee la preferencia (`localStorage['consent-preference']`) y hace `gtag('consent','update',…)`. Aceptar concede `analytics_storage`; las señales de ads siguen denied salvo `grantAds` (prop, `false` por defecto).
- Reabrir: el footer incluye "Preferencias de cookies" (`<button data-consent-open>`); también `window.openConsentPreferences()` o cualquier elemento con `data-consent-open`.
- Textos: props de `ConsentBanner` (`title`, `message`, `accept`, `decline`, `statusAccepted`, `statusDeclined`, `closeLabel`, `grantAds`) y `consentPreferencesLabel` del Footer. Defaults en español. La plantilla no tiene singleton Keystatic de textos comunes; se personalizan por props.

## Styling

Tailwind CSS v4 with CSS-first configuration:
- Design tokens in `src/styles/tokens.css`
- Custom properties for colors, spacing, typography
- Dark mode support via `[data-theme="dark"]`
- No magic numbers - all values come from tokens

## Imágenes

- **Dónde**: todas las imágenes de contenido y diseño van en `src/assets/img/` (JPG, PNG, WebP o AVIF, **máx. 2560 px de ancho**; ~5 MB como tope razonable). En `public/` solo quedan `favicon.svg`, `logo.png` (lo referencia el JSON-LD) y `img/og-default.jpg` (Open Graph, JPG 1200x630).
- **Componente**: `src/components/ui/Img.astro` renderiza `<picture>` con avif + webp, `srcset` (480/768/1024/1440/1920, descartando anchos mayores al original), `sizes`, `width`/`height` y `decoding="async"`. Acepta `ImageMetadata` (import o campo de colección) o una ruta `'/img/x.avif'` que se resuelve contra `src/assets/img`.

  ```astro
  ---
  import Img from '@/components/ui/Img.astro';
  import hero from '@/assets/img/hero.jpg';
  ---
  <Img src={hero} alt="..." sizes="100vw" priority />          <!-- imagen LCP -->
  <Img src="/img/equipo.avif" alt="..." sizes="(min-width: 768px) 50vw, 100vw" />
  ```

- **`sizes`**: indica el ancho real que ocupa la imagen según el layout (p. ej. `(min-width: 1024px) 33vw, 100vw`); con el default `100vw` el navegador puede descargar variantes más grandes de lo necesario.
- **Carga**: `priority` (eager + `fetchpriority="high"`) SOLO en la imagen LCP de cada página (`HeroSection` ya lo aplica a su `backgroundImage`). El resto es lazy.
- **Fondos**: usa `<Img class="...">` posicionado de forma absoluta con `object-fit: cover`. No uses `background: url()` para imágenes grandes ni `background-attachment: fixed` (no se optimizan y fuerzan repintados).
- **Colecciones Keystatic con imágenes**: usa `fields.image({ directory: 'src/assets/img', publicPath: '../../../assets/img/' })` (el `publicPath` es relativo desde el JSON/MDX de la colección hasta `src/assets/img`; ajusta la profundidad) y en el schema de Astro `schema: ({ image }) => z.object({ cover: image() })`. Así `image()` entrega `ImageMetadata` listo para `<Img>`. Con Keystatic en storage cloud cada subida es un commit y requiere rebuild. El campo `ogImage` de posts sigue siendo texto: la imagen OG debe ser JPG en `public/`.
- **Originales**: Astro 5 deja en `dist/_astro` el original de cada imagen importada; una integración en `astro.config.mjs` (`prune-unreferenced-originals`) borra los no referenciados tras el build.

## Rendimiento y caché de build

- CSS: `build.inlineStylesheets: 'auto'` (con `vite.build.assetsInlineLimit: 8192`, que inlinea el CSS propio pequeño de cada página) deja **una sola hoja externa por página** con hash en `/_astro/`, cacheable e inmutable (sirve con `Cache-Control: immutable`), en vez de repetir el CSS en cada HTML. Las fuentes son autoalojadas.
- `prefetch: { prefetchAll: true, defaultStrategy: 'hover' }`: precarga el HTML destino al pasar el cursor por un enlace.
- La optimización de imágenes es lo más lento del build. Astro cachea las variantes en `node_modules/.astro`; en CI conserva esa carpeta. Ejemplo para GitHub Actions (antes de `npm run build`):

  ```yaml
  - name: Cache Astro image optimizations
    uses: actions/cache@v4
    with:
      path: node_modules/.astro
      key: astro-assets-${{ runner.os }}-${{ hashFiles('src/assets/**', 'package-lock.json') }}
      restore-keys: |
        astro-assets-${{ runner.os }}-
  ```

## Deployment

Build static files:
```bash
npm run build
```

**`build.format`**: la plantilla usa el default de Astro (`'directory'`, `ruta/index.html`) con `trailingSlash: 'never'`, que sirve `/ruta` con 200 también con el adapter `@astrojs/node` (Hostinger). Con `'file'` (`ruta.html`) el handler estático de `@astrojs/node` NO resuelve las rutas: si necesitas `'file'` en hosting estático (p. ej. para evitar el 301 `/ruta` → `/ruta/` de GitHub Pages), aplícalo solo en el target estático (`format: isNode ? 'directory' : 'file'`) y copia `<locale>.html` → `<locale>/index.html` en un hook `astro:build:done`.

Deploy `dist/` folder to:
- Netlify
- Vercel
- Cloudflare Pages
- GitHub Pages
- Any static hosting

## License

MIT
