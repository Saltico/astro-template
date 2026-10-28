// src/lib/seo.ts
// Schema.org builders + getSiteUrl()

import type { SiteConfig } from '@/types/seo';

const DEFAULT_CONFIG: SiteConfig = {
  siteUrl: import.meta.env.PUBLIC_SITE_URL ?? 'https://example.com',
  siteName: 'Astro Template',
  defaultLocale: 'en',
  phone: '+1 (555) 000-0000',
  email: 'contact@example.com',
  logoPath: '/logo.png',
};

export function getSiteConfig(): SiteConfig {
  return DEFAULT_CONFIG;
}

export function getSiteUrl(path = ''): string {
  const config = getSiteConfig();
  return new URL(path, config.siteUrl).toString();
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
    image: image ?? getSiteUrl('/og-default.jpg'),
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
    image: image ?? getSiteUrl('/og-default.jpg'),
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
