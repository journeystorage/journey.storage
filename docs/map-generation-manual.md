# Map Generation Manual — Pitch Deck

This document covers how to generate and maintain the maps used in the Granbury investor pitch deck.

---

## Overview

The deck uses **two types of maps**:

| Map | Tech | Location in Deck | File |
|-----|------|-----------------|------|
| National Acquisitions Map | React Simple Maps (SVG) | Page 4 — Track Record | Component: `AcquisitionsMap.tsx` |
| Competitor Map (Granbury) | Google Maps Static API (raster) | Page 14 — Competition | Image: `public/images/map/comp-map-dark.webp` |

---

## 1. National Acquisitions Map (React Simple Maps)

### How It Works

A client-side React component renders an SVG map of the US with orange pins at each facility location. No API key required — it uses a free TopoJSON file from CDN.

### Files

- **Component:** `apps/investors/src/app/deck/granbury/AcquisitionsMap.tsx`
- **Client wrapper:** `apps/investors/src/app/deck/granbury/AcquisitionsMapClient.tsx`
- **Data source:** `docs/journey.direct/acquired-facilities-addresses`

### Adding or Removing a Facility

1. Get the city-level coordinates (lat/lng) for the new facility. Street-level precision is not needed — the map is national scale, dots only.
2. Open `AcquisitionsMap.tsx` and add/remove entries in the `locations` array:

```tsx
{ name: 'City, ST', coords: [-longitude, latitude] },
```

**Important:** `coords` format is `[longitude, latitude]` (note: longitude first — this is the GeoJSON standard, opposite of Google Maps).

3. Update `docs/journey.direct/acquired-facilities-addresses` with the full address for reference.

### Styling

- US states: `fill: rgba(245,240,232,0.06)`, `stroke: rgba(245,240,232,0.12)`
- Pin glow: `circle r=8`, `fill: rgba(232,98,42,0.15)`
- Pin dot: `circle r=3.5`, `fill: #E8622A`, `stroke: rgba(245,240,232,0.35)`
- Projection: `geoAlbersUsa`, scale `900`, canvas `800×500`

### Dependencies

```
react-simple-maps (installed in project)
TopoJSON: https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json
```

---

## 2. Competitor Map — Granbury (Google Maps Static API)

### How It Works

A static image generated via the Google Maps Static API URL. The image is saved as WebP and committed to the repo. It is NOT generated at runtime — it's a pre-rendered image.

### Files

- **Image:** `apps/investors/public/images/map/comp-map-dark.webp`
- **Data source:** `docs/journey.direct/competitor-coordinates.md`
- **Used in:** `apps/investors/src/app/deck/granbury/page.tsx` (Page 14 — Competition slide)

### API Key

```
AIzaSyBBzjj-IeIG7AOiUUStGnHy8gGC3R5ShfU
```

Stored in `.env.local` at project root as `GOOGLE_MAPS_API_KEY`.

**Required APIs enabled in Google Cloud Console:**
- Maps Static API
- (Geocoding API — optional, for converting addresses to coordinates)

### Generating a New Map Image

Build a URL with the format below, open it in a browser, and save the image.

**Base URL:**
```
https://maps.googleapis.com/maps/api/staticmap?
```

**Parameters used for the current dark-themed map:**

| Parameter | Value |
|-----------|-------|
| `center` | `32.450,-97.730` (Granbury center) |
| `zoom` | `12` |
| `size` | `800x800` |
| `scale` | `2` (retina — actual output is 1600×1600) |
| `maptype` | `roadmap` |
| `key` | `AIzaSyBBzjj-IeIG7AOiUUStGnHy8gGC3R5ShfU` |

**Dark theme styling:**
```
&style=element:geometry|color:0x1c1c1c
&style=element:labels|visibility:off
&style=feature:road|element:geometry|color:0x333333
&style=feature:road.highway|element:geometry|color:0x444444
&style=feature:water|element:geometry|color:0x111111
&style=feature:landscape.natural|element:geometry|color:0x1a1a1a
```

**Competitor pins (grade-colored, size:small):**

Pins are color-coded by competitive grade (must match deck legend on page 14):
- **A grade:** `0x34D399` (green)
- **B grade:** `0x60A5FA` (blue)
- **C grade:** `0xFBBF24` (yellow)
- **D/F grade:** `0xF87171` (red)

Format: `&markers=color:0xCOLOR|size:small|LAT,LNG`

Example for one B-grade competitor:
```
&markers=color:0x60A5FA|size:small|32.455945,-97.735868
```

**Journey pins (large, on top):**

Journey pins must be listed LAST in the URL so they render on top (z-order).

```
&markers=color:0xE8622A|label:J|32.4666,-97.7148
&markers=color:0xE8622A|label:J|32.4364,-97.7556
&markers=color:0xE8622A|label:J|32.4466,-97.7307
```

### Step-by-Step Process

1. Open `docs/journey.direct/competitor-coordinates.md` for competitor lat/lng values
2. Build the full URL with all markers (competitors first with `size:small`, then Journey pins last without `size:small`)
3. Open the URL in a browser — verify all pins are visible
4. Right-click → Save Image As → save to a temp location
5. Convert to WebP: `cwebp -q 85 input.png -o comp-map-dark.webp`
6. Move to `apps/investors/public/images/map/comp-map-dark.webp`
7. Clear Next.js image cache if needed: `rm -rf apps/investors/.next/cache/images`

### Full Example URL

```
https://maps.googleapis.com/maps/api/staticmap?center=32.450,-97.730&zoom=12&size=800x800&scale=2&maptype=roadmap&style=element:geometry|color:0x1c1c1c&style=element:labels|visibility:off&style=feature:road|element:geometry|color:0x333333&style=feature:road.highway|element:geometry|color:0x444444&style=feature:water|element:geometry|color:0x111111&style=feature:landscape.natural|element:geometry|color:0x1a1a1a&markers=color:0x60A5FA|size:small|32.455945,-97.735868&markers=color:0xFBBF24|size:small|32.469829,-97.716712&markers=color:0x60A5FA|size:small|32.473285,-97.698727&markers=color:0x60A5FA|size:small|32.453595,-97.687540&markers=color:0xF87171|size:small|32.453591,-97.687391&markers=color:0x34D399|size:small|32.452696,-97.727530&markers=color:0x60A5FA|size:small|32.460058,-97.784597&markers=color:0xFBBF24|size:small|32.436231,-97.768597&markers=color:0xF87171|size:small|32.437103,-97.766366&markers=color:0xFBBF24|size:small|32.439743,-97.751424&markers=color:0xFBBF24|size:small|32.442160,-97.728094&markers=color:0xF87171|size:small|32.448939,-97.689223&markers=color:0x60A5FA|size:small|32.446819,-97.686855&markers=color:0xFBBF24|size:small|32.442400,-97.726867&markers=color:0xE8622A|label:J|32.4666,-97.7148&markers=color:0xE8622A|label:J|32.4364,-97.7556&markers=color:0xE8622A|label:J|32.4466,-97.7307&key=AIzaSyBBzjj-IeIG7AOiUUStGnHy8gGC3R5ShfU
```

---

## 3. Light Theme Map Variant

For use cases outside the dark deck (print materials, white-background documents, consulting decks, etc.), use the light theme variant below.

### Light Theme Styling

```
&style=element:geometry|color:0xf5f0e8
&style=element:labels.text.fill|color:0x5A5854
&style=element:labels.text.stroke|color:0xf5f0e8
&style=feature:poi|visibility:off
&style=feature:transit|visibility:off
&style=feature:road|element:geometry|color:0xc4bdb2
&style=feature:road.highway|element:geometry|color:0xb0a89c
&style=feature:water|element:geometry|color:0xc9dde8
&style=feature:landscape.natural|element:geometry|color:0xeae5dc
```

Color rationale:
- **Background (geometry):** `#f5f0e8` — warm white matching brand palette
- **Labels text fill:** `#5A5854` — warm dark gray, readable on light bg
- **Labels text stroke:** `#f5f0e8` — matches background for clean halo
- **POI / Transit:** hidden — no business icons cluttering the map
- **Roads:** `#c4bdb2` — warm gray with enough contrast to read clearly
- **Highways:** `#b0a89c` — darker to differentiate from local roads
- **Water:** `#c9dde8` — muted blue, reads as water without competing with pins
- **Landscape:** `#eae5dc` — slight separation from base geometry

### Light Theme Pin Colors

Same colors as dark theme — they read well on the light background:

- **A grade:** `0x34D399` (green)
- **B grade:** `0x60A5FA` (blue)
- **C grade:** `0xFBBF24` (yellow)
- **D/F grade:** `0xF87171` (red)
- **Journey pins:** `0xE8622A` (brand orange)

### Full Example URL (Light Theme)

```
https://maps.googleapis.com/maps/api/staticmap?center=32.450,-97.730&zoom=12&size=800x800&scale=2&maptype=roadmap&style=element:geometry|color:0xf5f0e8&style=element:labels.text.fill|color:0x5A5854&style=element:labels.text.stroke|color:0xf5f0e8&style=feature:poi|visibility:off&style=feature:transit|visibility:off&style=feature:road|element:geometry|color:0xc4bdb2&style=feature:road.highway|element:geometry|color:0xb0a89c&style=feature:water|element:geometry|color:0xc9dde8&style=feature:landscape.natural|element:geometry|color:0xeae5dc&markers=color:0x60A5FA|size:small|32.455945,-97.735868&markers=color:0xFBBF24|size:small|32.469829,-97.716712&markers=color:0x60A5FA|size:small|32.473285,-97.698727&markers=color:0x60A5FA|size:small|32.453595,-97.687540&markers=color:0xF87171|size:small|32.453591,-97.687391&markers=color:0x34D399|size:small|32.452696,-97.727530&markers=color:0x60A5FA|size:small|32.460058,-97.784597&markers=color:0xFBBF24|size:small|32.436231,-97.768597&markers=color:0xF87171|size:small|32.437103,-97.766366&markers=color:0xFBBF24|size:small|32.439743,-97.751424&markers=color:0xFBBF24|size:small|32.442160,-97.728094&markers=color:0xF87171|size:small|32.448939,-97.689223&markers=color:0x60A5FA|size:small|32.446819,-97.686855&markers=color:0xFBBF24|size:small|32.442400,-97.726867&markers=color:0xE8622A|label:J|32.4666,-97.7148&markers=color:0xE8622A|label:J|32.4364,-97.7556&markers=color:0xE8622A|label:J|32.4466,-97.7307&key=AIzaSyBBzjj-IeIG7AOiUUStGnHy8gGC3R5ShfU
```

### Saving the Light Theme Image

Same process as dark theme:

1. Open the URL in a browser
2. Right-click → Save Image As
3. Convert: `cwebp -q 85 input.png -o comp-map-light.webp`
4. Save to `apps/investors/public/images/map/comp-map-light.webp`

### Side-by-Side Reference

| Property | Dark Theme | Light Theme |
|----------|-----------|-------------|
| Background | `#1c1c1c` | `#f5f0e8` |
| Roads | `#333333` | `#c4bdb2` |
| Highways | `#444444` | `#b0a89c` |
| Water | `#111111` | `#c9dde8` |
| Landscape | `#1a1a1a` | `#eae5dc` |
| A grade pin | `#34D399` (green) | `#34D399` (green) |
| B grade pin | `#60A5FA` (blue) | `#60A5FA` (blue) |
| C grade pin | `#FBBF24` (yellow) | `#FBBF24` (yellow) |
| D/F grade pin | `#F87171` (red) | `#F87171` (red) |
| Journey pin | `#E8622A` | `#E8622A` |

---

## Supporting Documents

| Document | Path | Contents |
|----------|------|----------|
| Competitor data | `docs/journey.direct/competitor-coordinates.md` | 14 competitors with name, address, lat/lng + 3 Journey properties |
| Acquired facilities | `docs/journey.direct/acquired-facilities-addresses` | 32 facility addresses (national portfolio) |
| Design reference | `docs/references/map/notes.md` | BeJet-inspired dark map design concept |

---

## Notes

- The competitor map is a **static image**, not a live component. Every time competitor data changes or grades are updated, the image must be regenerated manually.
- The acquisitions map is a **live React component** that renders at build time. Adding a pin only requires editing the `locations` array.
- Google Maps Static API has a free tier of 25,000 loads/month. Since we only use it for image generation (not runtime), cost is negligible.
- For geocoding addresses to coordinates, use [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/) (free, no API key) or Google Geocoding API (requires enabling in Cloud Console).
