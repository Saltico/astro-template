# Astro Template

A reusable, SEO-optimized website template built with Astro, Tailwind CSS v4, and Keystatic CMS. Includes optional ecommerce functionality with cart, checkout wizard, and order processing.

## Features

- **🚀 Static-first**: Blazing fast performance with Astro's static site generation (hybrid mode for API endpoints)
- **🎨 Tailwind CSS v4**: CSS-first configuration with design tokens
- **📝 Keystatic CMS**: Edit content locally with markdown + MDX support
- **🔍 SEO Optimized**: Built-in SEO components, structured data, sitemap
- **📊 Analytics**: Google Tag Manager + GA4 with consent mode
- **🛒 Ecommerce Ready**: Cart, checkout wizard, order processing (localStorage-based)
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
│   ├── fonts/          # Self-hosted fonts
│   └── og-default.jpg  # Default Open Graph image
├── src/
│   ├── assets/         # Images, icons, logos
│   ├── components/     # Reusable components
│   │   ├── layout/     # Header, Footer, Navigation
│   │   ├── seo/        # MetaTags, JsonLd, Breadcrumbs
│   │   ├── analytics/  # GTM, ConsentBanner
│   │   ├── ecommerce/  # ProductCard, CartSummary, CartBadge, CheckoutWizard
│   │   └── ui/         # Container, Button, Icon, Input, Textarea, etc.
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
│   │   ├── cart.ts     # Cart state management (localStorage)
│   │   ├── checkout.ts # Checkout state management
│   │   └── wordpress-api.ts # Optional WP integration
│   ├── pages/          # Routes
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├── shop.astro          # Product listing
│   │   ├── cart.astro          # Shopping cart
│   │   ├── checkout.astro      # Multi-step checkout
│   │   ├── order-success.astro # Confirmation page
│   │   ├── api/
│   │   │   └── order.ts        # Order endpoint (SSR)
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
- `PUBLIC_GTM_ID`: Google Tag Manager ID (optional)
- `PUBLIC_GA_ID`: Google Analytics 4 ID (optional)
- `WP_API_URL`: WordPress API URL (optional, for headless integration)
- `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS`: SMTP credentials for order emails (optional)
- `ORDER_EMAIL_FROM`: Sender email for order confirmations (optional)
- `ORDER_EMAIL_TO`: Recipient email for new order notifications (optional)

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

## Analytics

Conditional loading: analytics scripts only load when IDs are provided in `.env`.

Includes:
- Google Tag Manager
- Google Analytics 4
- Consent Mode v2 support
- Event tracking for clicks, downloads, outbound links

## Styling

Tailwind CSS v4 with CSS-first configuration:
- Design tokens in `src/styles/tokens.css`
- Custom properties for colors, spacing, typography
- Dark mode support via `[data-theme="dark"]`
- No magic numbers - all values come from tokens

## Ecommerce

The template includes a complete ecommerce system using **localStorage** for state management (no database or auth required).

### Pages

| Route | Description |
|-------|-------------|
| `/shop` | Product grid with add-to-cart buttons |
| `/cart` | Cart summary with remove/clear actions |
| `/checkout` | Multi-step wizard: Shipping → Payment → Review |
| `/order-success` | Order confirmation page |

### Components

| Component | Description |
|-----------|-------------|
| `ProductCard` | Product card with image, price, and add-to-cart |
| `CartSummary` | Cart items list with totals and actions |
| `CartBadge` | Header badge showing cart item count |
| `CheckoutWizard` | Step navigation indicator |
| `CheckoutShippingForm` | Shipping information form (step 1) |
| `CheckoutPaymentForm` | Payment information form (step 2) |
| `CheckoutReview` | Order review and submission (step 3) |

### State Management

Cart and checkout data are persisted in **localStorage**:

| Key | Purpose |
|-----|---------|
| `cart_v1` | Cart items (id, name, price, quantity) |
| `checkout_shipping_v1` | Shipping information |
| `checkout_payment_v1` | Payment information |

The cart uses a **pub/sub pattern** with CustomEvents for cross-component reactivity:
- `subscribe(callback)` — listen to cart changes
- `addItem()`, `removeItem()`, `updateItem()`, `clearCart()` — mutate cart
- `getCart()`, `getItemCount()`, `getCartTotal()` — read cart state

### API Endpoint

`POST /api/order` accepts `{ cart, shipping, payment }` and processes orders server-side.
This endpoint requires the Node adapter (included in the template).

**Integration points** (marked with `TODO` in `src/pages/api/order.ts`):
- Payment provider (Stripe, PayPal, etc.)
- Database persistence
- Email confirmation (via nodemailer)

### Customizing Products

Replace `src/data/products.ts` with your own product data source. The template ships with 8 sample products from Unsplash.

## Deployment

Build for production:
```bash
npm run build
```

The build output (`dist/`) contains:
- **`dist/client/`**: Static assets (HTML, CSS, JS)
- **`dist/server/`**: Node.js server for API endpoints

Deploy to:
- **Node.js hosting**: Run `node dist/server/entry.mjs`
- **Static hosting** (Netlify, Vercel, Cloudflare Pages): Configure to serve `dist/client/` as static files. API endpoints won't work without a serverless adapter.

## License

MIT
