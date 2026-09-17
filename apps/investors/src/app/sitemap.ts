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
    // The Granbury investor deck at /deck/granbury was deleted — the raise is
    // closed and funded. Do not re-add it.
  ]

  const insightsPages: MetadataRoute.Sitemap = []

  return [...staticPages, ...insightsPages]
}
