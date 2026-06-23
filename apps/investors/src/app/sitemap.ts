import type { MetadataRoute } from 'next'

const BASE = 'https://direct.journey.storage'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE}/apply`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // The Granbury investor deck is intentionally excluded from the sitemap and
    // marked noindex (see deck/granbury/layout.tsx) — it's investor material, not
    // SEO content. It remains reachable by direct link.
  ]

  const insightsPages: MetadataRoute.Sitemap = []

  return [...staticPages, ...insightsPages]
}
