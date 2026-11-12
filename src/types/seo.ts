// src/types/seo.ts

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export interface SiteConfig {
  siteUrl: string;
  siteName: string;
  defaultLocale: string;
  phone?: string;
  email?: string;
  logoPath?: string;
}
