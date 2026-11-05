// src/data/site.ts
// Single source of truth for all shared site data.
// Contact data reads from env vars (PUBLIC_CONTACT_*) with fallbacks.
// In Fase 2 (Keystatic CMS), these values can be overridden by the site-settings collection.

import type { NavItem } from '@/types/navigation';
import type { FooterColumn, FooterLink, SocialLink } from '@/types/layout';

// ─── Branding ────────────────────────────────────────────────────────
export const siteBrand = {
  name: 'Astro Template',
  tagline: 'A reusable, SEO-optimized static site template.',
  description:
    'A reusable static website template built with Astro, Tailwind CSS v4, and Keystatic CMS.',
  logoUrl: '/logo.png',
  siteUrl: import.meta.env.PUBLIC_SITE_URL ?? 'https://example.com',
};

// ─── Language ────────────────────────────────────────────────────────
export const siteLanguage = import.meta.env.PUBLIC_SITE_LANG ?? 'es';

// ─── Contact (from env vars, with fallbacks) ─────────────────────────
export const siteContact = {
  email: import.meta.env.PUBLIC_CONTACT_EMAIL ?? 'contact@example.com',
  phone: import.meta.env.PUBLIC_CONTACT_PHONE ?? '+1 (555) 000-0000',
  address: '123 Main Street, City',
  schedule: 'Monday to Friday, 09:00 – 18:00',
  mapsEmbedUrl: import.meta.env.PUBLIC_MAPS_EMBED_URL ?? '',
};

// ─── TopBar ──────────────────────────────────────────────────────────
export const topbarData = {
  phone: siteContact.phone,
  email: siteContact.email,
  social: [
    { platform: 'linkedin' as const, url: 'https://www.linkedin.com/' },
    { platform: 'github' as const, url: 'https://github.com/' },
  ] satisfies SocialLink[],
  links: [
    { label: 'Blog', url: '/blog' },
  ],
};

// ─── Navigation ──────────────────────────────────────────────────────
export const navigationData: NavItem[] = [
  { label: 'Home', url: '/' },
  { label: 'Blog', url: '/blog' },
  { label: 'Contact', url: '/contact' },
];

// ─── Footer ──────────────────────────────────────────────────────────
export const footerData: {
  columns: FooterColumn[];
  legal: FooterLink[];
} = {
  columns: [
    {
      title: 'Site',
      links: [
        { label: 'Home', url: '/' },
        { label: 'Blog', url: '/blog' },
        { label: 'Contact', url: '/contact' },
      ],
    },
  ],
  legal: [
    { label: 'Privacy Policy', url: '/privacy' },
    { label: 'Legal Notice', url: '/legal' },
  ],
};
