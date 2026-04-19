'use client'

import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

// 32 facilities acquired/developed by the sponsors
// Source: docs/journey.direct/acquired-facilities-addresses
// Geocoded to city-level (national map, dots only — no street precision needed)
const locations: { name: string; coords: [number, number] }[] = [
  // Texas (14)
  { name: 'Mt Pleasant, TX', coords: [-94.968, 33.157] },
  { name: 'Temple, TX', coords: [-97.343, 31.098] },
  { name: 'Hillsboro, TX', coords: [-97.130, 32.011] },
  { name: 'Victoria, TX', coords: [-96.985, 28.805] },
  { name: 'San Angelo, TX', coords: [-100.437, 31.464] },
  { name: 'Atlanta, TX', coords: [-94.164, 33.114] },
  { name: 'Bridgeport, TX', coords: [-97.755, 33.211] },
  { name: 'Wichita Falls, TX', coords: [-98.493, 33.914] },
  { name: 'Hondo, TX', coords: [-99.141, 29.347] },
  { name: 'Port Arthur, TX', coords: [-93.929, 29.899] },
  { name: 'Brownsville, TX', coords: [-97.497, 25.902] },
  { name: 'Waxahachie, TX', coords: [-96.848, 32.387] },
  { name: 'Granbury #1, TX', coords: [-97.794, 32.442] },
  { name: 'Granbury #2, TX', coords: [-97.760, 32.430] },
  // Missouri (6)
  { name: 'Moberly, MO', coords: [-92.438, 39.418] },
  { name: 'Joplin #1, MO', coords: [-94.513, 37.084] },
  { name: 'Joplin #2, MO', coords: [-94.480, 37.070] },
  { name: 'St Robert, MO', coords: [-92.155, 37.828] },
  { name: 'Marshall, MO', coords: [-93.197, 39.122] },
  { name: 'Kirksville, MO', coords: [-92.583, 40.195] },
  { name: 'Smithville, MO', coords: [-94.581, 39.387] },
  { name: 'Dexter, MO', coords: [-89.958, 36.796] },
  // Iowa (3)
  { name: 'Ames, IA', coords: [-93.620, 42.034] },
  { name: 'West Des Moines, IA', coords: [-93.711, 41.577] },
  { name: 'Ankeny, IA', coords: [-93.606, 41.730] },
  // Oklahoma (1)
  { name: 'Spencer, OK', coords: [-97.377, 35.523] },
  // South Carolina (2)
  { name: 'York, SC', coords: [-81.242, 34.994] },
  { name: 'Clover, SC', coords: [-81.227, 35.111] },
  // Washington (1)
  { name: 'Walla Walla, WA', coords: [-118.328, 46.065] },
  // Granbury #3 (current deal)
  { name: 'Granbury #3, TX', coords: [-97.726, 32.418] },
]

export default function AcquisitionsMap() {
  return (
    <div className="relative w-full h-full">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 900 }}
        width={800}
        height={500}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rpiKey}
                geography={geo}
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none', fill: 'var(--color-deck-text)', fillOpacity: 0.06, stroke: 'var(--color-deck-text)', strokeOpacity: 0.12 },
                  hover: { outline: 'none', fill: 'var(--color-deck-text)', fillOpacity: 0.06, stroke: 'var(--color-deck-text)', strokeOpacity: 0.12 },
                  pressed: { outline: 'none', fill: 'var(--color-deck-text)', fillOpacity: 0.06, stroke: 'var(--color-deck-text)', strokeOpacity: 0.12 },
                }}
              />
            ))
          }
        </Geographies>
        {locations.map((loc, i) => (
          <Marker key={i} coordinates={loc.coords}>
            {/* Glow */}
            <circle r={8} fill="rgba(232,98,42,0.15)" />
            {/* Pin */}
            <circle r={3.5} fill="#E8622A" strokeWidth={1} style={{ stroke: 'var(--color-deck-text)', strokeOpacity: 0.35 }} />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  )
}
