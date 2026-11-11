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
├── public/              # Static assets
│   └── img/og-default.jpg  # Default Open Graph image (JPG 1200x630)
├── src/
│   ├── assets/         # Images, icons, logos, fonts/ (self-hosted woff2 + OFL)
│   ├── components/     # Reusable components
│   │   ├── layout/     # Header, Footer, Navigation
│   │   ├── seo/        # SEO, JsonLd, Breadcrumbs
│   │   ├── analytics/  # GTM, ConsentBanner
│   │   └── ui/         # Container, Button, Icon, etc.
│   ├── content/        # Content collections (Keystatic)
│   │   ├── config.ts   # Collection schemas
│   │   ├── posts/      # Blog posts
│   │   └── pages/      # Editable pages
│   ├── data/           # Site configuration
│   │   └── site.ts     # Brand, contact, nav, footer
│   ├── layouts/        # BaseLayout, PostLayout
│   ├── lib/            # Utilities
│   │   ├── seo.ts      # Schema.org builders
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

## Deployment

El CSS se inlinea en el HTML (`build.inlineStylesheets: 'always'`) para evitar CSS bloqueante; mide el peso del HTML tras el build.

Build static files:
```bash
npm run build
```

Deploy `dist/` folder to:
- Netlify
- Vercel
- Cloudflare Pages
- GitHub Pages
- Any static hosting

## License

MIT
