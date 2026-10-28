// src/lib/wordpress-api.ts
// OPTIONAL: WordPress headless client
// Documented in README migration guide. This file is present but unused by default.

const WP_API_BASE = import.meta.env.WP_API_URL; // e.g. https://cms.example.com/wp-json
const WP_FETCH_TIMEOUT_MS = 2500; // Hard timeout: slow WP must never hang the build

export interface FetchPostsOptions {
  perPage?: number;
  page?: number;
  slug?: string;
  categories?: number[];
  tags?: number[];
}

export async function fetchPosts(options: FetchPostsOptions = {}): Promise<any[]> {
  if (!WP_API_BASE) return [];

  const params = new URLSearchParams({
    _embed: '1',
    per_page: String(options.perPage ?? 10),
    page: String(options.page ?? 1),
    status: 'publish',
  });

  if (options.slug) params.append('slug', options.slug);
  if (options.categories?.length) params.append('categories', options.categories.join(','));
  if (options.tags?.length) params.append('tags', options.tags.join(','));

  try {
    const res = await fetch(`${WP_API_BASE}/wp/v2/posts?${params}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(WP_FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`WordPress API error: ${res.status} ${res.statusText}`);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    return [];
  }
}

export async function fetchAllNews(options: { perPage?: number } = {}): Promise<any[]> {
  const perPage = options.perPage ?? 100;
  let page = 1;
  let allPosts: any[] = [];
  let hasMore = true;

  while (hasMore) {
    const posts = await fetchPosts({ perPage, page });
    if (posts.length === 0) {
      hasMore = false;
    } else {
      allPosts = [...allPosts, ...posts];
      hasMore = posts.length === perPage;
      page++;
    }
  }

  return allPosts;
}
