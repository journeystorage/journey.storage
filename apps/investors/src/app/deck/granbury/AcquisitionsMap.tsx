'use client'

import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

// Locations acquired/developed by the sponsors
// Source: original acquisitions map from Jonah
const locations = [
  { name: 'WA', coords: [-122.33, 47.61] as [number, number] },
  { name: 'MO-1', coords: [-94.58, 39.10] as [number, number] },
  { name: 'MO-2', coords: [-93.29, 37.21] as [number, number] },
  { name: 'KS', coords: [-95.68, 38.80] as [number, number] },
  { name: 'OK-1', coords: [-97.52, 35.47] as [number, number] },
  { name: 'OK-2', coords: [-96.00, 36.15] as [number, number] },
  { name: 'AR', coords: [-92.29, 34.75] as [number, number] },
  { name: 'TX-1', coords: [-96.80, 32.78] as [number, number] },
  { name: 'TX-2', coords: [-97.33, 32.45] as [number, number] },
  { name: 'TX-3', coords: [-96.63, 33.20] as [number, number] },
  { name: 'TX-4', coords: [-97.75, 30.27] as [number, number] },
  { name: 'TX-5', coords: [-95.37, 29.76] as [number, number] },
  { name: 'TX-6', coords: [-98.49, 29.42] as [number, number] },
  { name: 'TN', coords: [-86.78, 36.16] as [number, number] },
  { name: 'NC', coords: [-80.84, 35.23] as [number, number] },
  { name: 'GA', coords: [-84.39, 33.75] as [number, number] },
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
                fill="rgba(245,240,232,0.06)"
                stroke="rgba(245,240,232,0.12)"
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none' },
                  pressed: { outline: 'none' },
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
            <circle r={3.5} fill="#E8622A" stroke="rgba(245,240,232,0.35)" strokeWidth={1} />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  )
}
