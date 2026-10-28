// src/data/site.ts
// Single source of truth for all shared site data:
// topbar, navigation, footer, branding, contact, social links.
//
// Components receive this data as props (not direct imports) for reusability.

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

// ─── Contact ─────────────────────────────────────────────────────────
export const siteContact = {
  phone: '+1 (555) 000-0000',
  phoneHref: 'tel:+15550000000',
  email: 'contact@example.com',
  address: '123 Main Street, City',
  schedule: 'Monday to Friday, 09:00 – 18:00',
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
  {
    label: 'About',
    url: '/about',
    children: [
      { label: 'Our Team', url: '/about#team' },
      { label: 'Mission', url: '/about#mission' },
    ],
  },
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
        { label: 'About', url: '/about' },
        { label: 'Contact', url: '/contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', url: '/docs' },
        { label: 'Changelog', url: '/changelog' },
      ],
    },
  ],
  legal: [
    { label: 'Privacy Policy', url: '/privacy' },
    { label: 'Legal Notice', url: '/legal' },
    { label: 'Cookies', url: '/cookies' },
  ],
};
