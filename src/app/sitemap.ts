import type { MetadataRoute } from 'next'

const BASE = 'https://journey.storage'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // The /legal/* pages are intentionally excluded — they're still placeholder
  // stubs. Add them here once they carry real content.
  return [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE}/size-guide`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
