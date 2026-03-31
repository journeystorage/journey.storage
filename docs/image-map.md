# Image Inventory — journey.storage

> Convention: `[page]-[section]-[description].[ext]`
> All images stored in `/public/images/`

---

## Status

| Symbol | Meaning |
|--------|---------|
| ⬜ | Pending — needs to be sourced or generated |
| ✅ | Ready — file exists and is approved |
| 🔄 | Exists but needs editing (crop, color grade, format) |

---

## Inventory

### Global Assets

| Page | Section | Filename | Type | Dimension | Alt Text | Status | Notes |
|------|---------|----------|------|-----------|----------|--------|-------|
| Global | Header | `logo-white.svg` | Logo | — | Journey.Storage™ logo | ✅ | White version for dark backgrounds / nav |
| Global | Header | `logo-dark.svg` | Logo | — | Journey.Storage™ logo | ✅ | Dark version for light backgrounds |
| Global | — | `favicon.png` | Icon | 32×32 | — | ✅ | JS mark icon for browser tab |
| Global | — | `apple-touch-icon.png` | Icon | 180×180 | — | ✅ | JS mark icon for iOS |
| Global | — | `og-image-default.jpg` | OG Image | 1200×630 | Journey.Storage™ — Space to move on. | ✅ | Social share fallback image |

### Home — Landing Page

| Page | Section | Filename | Type | Dimension | Alt Text | Status | Notes |
|------|---------|----------|------|-----------|----------|--------|-------|
| Home | Hero | `home-hero-bg.jpg` | Photo | 2560×1440 | A woman standing at the threshold between her apartment and a modern storage facility | ✅ | **USE: Image 2 (woman between room and corridor).** Needs dark gradient overlay applied via CSS, not baked into image. May need warm color grade adjustment — the storage corridor side has slightly cool/fluorescent tones. |
| Home | Life Moments | `home-moments-moving.jpg` | Photo | 800×600 | A person packing belongings during a home move | ✅ | Warm, authentic. Person is the focus, not the boxes. |
| Home | Life Moments | `home-moments-newchapter.jpg` | Photo | 800×600 | A person looking forward at a new beginning | ✅ | Reflective, hopeful. Not sad. |
| Home | Life Moments | `home-moments-business.jpg` | Photo | 800×600 | A small business workspace overflowing with inventory | ✅ | Entrepreneurial energy. Creative clutter. |
| Home | Life Moments | `home-moments-cityliving.jpg` | Photo | 800×600 | A cozy but compact city apartment | ✅ | Relatable. "I need more room." |
| Home | Positioning | `home-positioning-bg.jpg` | Photo | 1200×600 | A visual metaphor for transition — a road, bridge, or open doorway | ✅ | Contemplative. Spacious. Warm light. |
| Home | Differentiators | `home-facility-exterior.jpg` | Photo | 1200×800 | Modern self-storage facility exterior at dusk | ✅ | **USE: Image 1 (facility at dusk with orange doors).** Great mood and color. Needs warm color grade — shift slightly warmer. Can be used as a section background with overlay. No people but acceptable here as environmental context. |
| Home | Founded By | `home-jonah-portrait.jpg` | Photo | 600×800 | Jonah M. Hall, Founder of Journey.Storage™ | ✅ | Must be a real photo. Professional but approachable. Not a corporate headshot. |

### Additional Facility Images (background / secondary use)

| Page | Section | Filename | Type | Dimension | Alt Text | Status | Notes |
|------|---------|----------|------|-----------|----------|--------|-------|
| Home | Various | `home-facility-interior-person.jpg` | Photo | 1200×800 | A customer walking through a Journey.Storage™ facility | ✅ | **Image 3 or Image 4 could work here.** Image 4 is better (warmer energy, better smile, more natural). Could use in How It Works or as a secondary visual. Needs color warmth adjustment. The Journey branding on boxes is a plus. |
| Home | Various | `home-facility-exterior-frontal.jpg` | Photo | 1200×600 | Storage facility exterior with orange doors | ❌ | **Image 5 — NOT usable.** Cold blue sky, no people, pure product shot. Breaks brand rules. Discard for website use. |

---

## AI Generation Prompts

> Use these prompts in Gemini, Midjourney, or similar tools.
> After generating, save with the filename from the inventory above.

### home-moments-moving.jpg
```
Editorial lifestyle photograph of a young woman in her late 20s carefully wrapping a framed picture in her living room. Moving boxes partially packed around her, warm afternoon sunlight streaming through a window. The room is half-empty — a moment of transition. She looks focused but calm. Shot on 35mm lens, shallow depth of field, warm color grading with amber highlights and soft shadows. The mood is authentic and contemplative, not staged. No logos, no text. Photorealistic, editorial quality.
```

### home-moments-newchapter.jpg
```
Editorial lifestyle photograph of a man in his early 30s standing in the doorway of a new empty apartment, looking into the sunlit room with a subtle smile. He's holding keys in one hand. The space is bare and full of possibility. Late afternoon golden light fills the room. Shot on 35mm lens, natural lighting, warm tones. The mood is hopeful and reflective — the beginning of something new. No boxes in frame. Photorealistic, editorial quality, documentary style.
```

### home-moments-business.jpg
```
Editorial photograph of a small creative workspace — a garage or spare room converted into a business hub. Shelves packed with products, a worktable covered in materials, a laptop open. A person (mid-30s, casual clothes) is standing amid the creative clutter, arms crossed, looking at their growing inventory with pride and slight overwhelm. Warm lighting, slightly cluttered but intentional. Shot on wide angle lens, natural light. The mood is entrepreneurial energy — things are growing faster than the space allows. Photorealistic, editorial quality.
```

### home-moments-cityliving.jpg
```
Editorial photograph of a compact but stylish city apartment. A person (late 20s) is trying to fit a yoga mat into an already-full closet, laughing at the impossibility. The apartment is small but well-decorated — plants, books, a cozy couch. The vibe is "I love this place but there's literally no room." Warm lighting, shot on 35mm lens. Authentic, slice-of-life feel. Photorealistic, candid energy, not posed.
```

### home-positioning-bg.jpg
```
Cinematic wide-angle photograph of a long straight road at golden hour, stretching toward the horizon. Warm amber sky, gentle hills on either side. No cars, no people — just the road and the light. The image evokes forward motion, possibility, and the space between where you are and where you're going. Shot on wide angle lens, deep depth of field. Warm color grading — golden highlights, deep warm shadows. Aspect ratio 2:1 (wide). Editorial quality, could be a magazine spread.
```

### og-image-default.jpg
```
Dark background (#181818). Journey.Storage™ logo in white, centered. Below the logo: "Space to move on." in light italic text, stone gray color. Subtle brand shape elements (geometric rectangles with asymmetric corner rounding) in charcoal (#3A3835) as background texture. Clean, minimal, premium. Dimensions exactly 1200x630px.
```
> Note: This is better designed in Figma or built in code than AI-generated.

---

## Image Sources

| Source | Images | Notes |
|-------|--------|-------|
| Existing (AI-generated, provided) | Hero bg, facility exterior, facility interior w/ person | Already have these. Need color grading adjustments. |
| AI generation (Gemini/Midjourney) | 4 life moments, positioning bg | Use prompts above. Prioritize photorealistic quality. |
| Real photograph | Jonah portrait | Must be an actual photo. Source from existing materials or arrange a shoot. |
| Designed (Figma/code) | OG image, logos, favicon | Brand assets — designed, not photographed. |
| Built in code | U.S. map, icons, brand shapes | Not images — SVG/CSS components built by Claude Code. |
