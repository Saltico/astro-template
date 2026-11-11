// src/lib/seo.ts
// Schema.org builders + getSiteUrl(). localBusinessSchema is OPT-IN (never injected by default).

import type { SiteConfig } from '@/types/seo';

const DEFAULT_CONFIG: SiteConfig = {
  siteUrl: import.meta.env.PUBLIC_SITE_URL ?? 'https://example.com',
  siteName: import.meta.env.PUBLIC_SITE_NAME ?? 'Site Name',
  defaultLocale: import.meta.env.PUBLIC_SITE_LANG ?? 'es',
  phone: import.meta.env.PUBLIC_CONTACT_PHONE ?? '+1 (555) 000-0000',
  email: import.meta.env.PUBLIC_CONTACT_EMAIL ?? 'contact@example.com',
  logoPath: '/logo.png',
};

export function getSiteConfig(): SiteConfig {
  return DEFAULT_CONFIG;
}

export function getSiteUrl(path = ''): string {
  const config = getSiteConfig();
  return new URL(path, config.siteUrl).toString();
}

/**
 * URL of the default-locale version of a page (used for hreflang="x-default").
 * - If `hreflang` has an entry for the default locale, that URL wins.
 * - If i18n is enabled (more than one locale in PUBLIC_I18N_LOCALES) and the
 *   canonical path starts with a non-default locale prefix (/en/x), the prefix
 *   is stripped (default locale has no prefix: prefixDefaultLocale = false).
 * - Otherwise (i18n disabled, or already the default version) returns canonical.
 */
export function getDefaultLocaleUrl(canonical: string, hreflang?: Record<string, string>): string {
  const defaultLocale = getSiteConfig().defaultLocale;
  if (hreflang?.[defaultLocale]) return hreflang[defaultLocale];

  const locales = (import.meta.env.PUBLIC_I18N_LOCALES ?? '')
    .split(',')
    .map((l: string) => l.trim())
    .filter(Boolean);
  if (locales.length < 2) return canonical;

  const url = new URL(canonical);
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');
  let path = url.pathname;
  if (base && (path === base || path.startsWith(base + '/'))) path = path.slice(base.length);

  const [, first, ...rest] = path.split('/');
  if (first && first !== defaultLocale && locales.includes(first)) {
    url.pathname = base + '/' + rest.join('/');
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, '');
    return url.toString();
  }
  return canonical;
}

export function organizationSchema(): Record<string, unknown> {
  const config = getSiteConfig();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.siteName,
    url: config.siteUrl,
    logo: getSiteUrl(config.logoPath),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: config.phone,
      contactType: 'customer service',
      email: config.email,
      availableLanguage: ['English', 'Spanish'],
    },
  };
}

export function websiteSchema(searchUrl?: string): Record<string, unknown> {
  const config = getSiteConfig();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.siteName,
    url: config.siteUrl,
    ...(searchUrl && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${searchUrl}?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
  };
}

/**
 * LocalBusiness JSON-LD. ONLY for businesses with a physical location / in-person service.
 * (Events -> Organization + SportsEvent/Event; online-only -> Organization.)
 * Opt-in: not injected by default. Built exclusively from REAL data passed by the project;
 * there are no placeholder defaults. Returns null if the required real data is missing,
 * so callers must skip it: `const ld = localBusinessSchema({...}); if (ld) schemas.push(ld)`.
 */
export function localBusinessSchema(options: {
  name: string;
  address: { streetAddress: string; addressLocality?: string; addressRegion?: string; postalCode?: string; addressCountry?: string };
  telephone?: string;
  email?: string;
  /** schema.org opening hours, e.g. ['Mo-Fr 09:00-18:00'] (real data only) */
  openingHours?: string[];
  priceRange?: string;
  geo?: { latitude: number; longitude: number };
  image?: string;
  mapsUrl?: string;
}): Record<string, unknown> | null {
  if (!options?.name || !options.address?.streetAddress) return null;
  const config = getSiteConfig();
  const { name, address, telephone, email, openingHours, priceRange, geo, image, mapsUrl } = options;
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    url: config.siteUrl,
    ...(image && { image }),
    ...(telephone && { telephone }),
    ...(email && { email }),
    address: { '@type': 'PostalAddress', ...address },
    ...(openingHours?.length && { openingHours }),
    ...(priceRange && { priceRange }),
    ...(geo && { geo: { '@type': 'GeoCoordinates', ...geo } }),
    ...(mapsUrl && { hasMap: mapsUrl }),
  };
}

export function breadcrumbSchema(items: { label: string; url?: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.url ? getSiteUrl(item.url) : undefined,
    })),
  };
}

export function articleSchema(
  headline: string,
  description: string,
  url: string,
  datePublished: string,
  image?: string
): Record<string, unknown> {
  const config = getSiteConfig();
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url,
    datePublished,
    image: image ?? getSiteUrl('/img/og-default.jpg'),
    author: {
      '@type': 'Organization',
      name: config.siteName,
    },
    publisher: organizationSchema(),
  };
}

export function blogPostingSchema(
  headline: string,
  description: string,
  url: string,
  datePublished: string,
  image?: string
): Record<string, unknown> {
  const config = getSiteConfig();
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    url,
    datePublished,
    image: image ?? getSiteUrl('/img/og-default.jpg'),
    author: {
      '@type': 'Organization',
      name: config.siteName,
    },
    publisher: organizationSchema(),
  };
}

export function combineSchemas(...schemas: Record<string, unknown>[]): Record<string, unknown>[] {
  return schemas;
}
