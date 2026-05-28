import { getProperties, getUnits } from '@/lib/tenant-api'
import {
  toConsumerFacility,
  getAvailableUnitsForSize,
  formatPrice,
  getSizeCategory,
  SIZE_CATEGORY_LABELS,
} from '@/lib/consumer-data'
import { getSizeAnalogy } from '@/lib/utils'
import { ArrowLeft, Thermometer, Car, Zap, DoorOpen } from 'lucide-react'
import Link from 'next/link'
import { UnitCard } from './UnitCard'

export default async function UnitsPage({
  params,
  searchParams,
}: {
  params: Promise<{ propertyId: string }>
  searchParams: Promise<{ size?: string }>
}) {
  const { propertyId } = await params
  const { size } = await searchParams

  const [propertiesData, unitsData] = await Promise.all([
    getProperties(),
    getUnits(propertyId, { limit: 500 }),
  ])

  const property = propertiesData.properties.find((p) => p.id === propertyId)
  if (!property) {
    return <div className="p-24 text-center" style={{ color: '#888680' }}>Property not found.</div>
  }

  const facility = toConsumerFacility(property)

  if (!size) {
    return (
      <div className="p-24 text-center" style={{ color: '#888680' }}>
        <p>Please select a size.</p>
        <Link href={`/locations/${propertyId}`} className="mt-4 inline-flex font-bold hover:brightness-110" style={{ fontSize: '0.9375rem', color: '#E8622A' }}>
          ← Back to sizes
        </Link>
      </div>
    )
  }

  const [w, l] = size.split('x').map(Number)
  const sqft = w * l
  const sizeLabel = `${w}' × ${l}'`
  const category = getSizeCategory(sqft)
  const analogy = getSizeAnalogy(sqft)
  const consumerUnits = getAvailableUnitsForSize(unitsData.units, size)

  return (
    <div style={{ backgroundColor: '#F5F0E8' }}>
      {/* Header */}
      <section className="px-5 py-12 lg:py-16" style={{ borderBottom: '1px solid rgba(196,184,154,0.4)' }}>
        <div className="mx-auto max-w-[1200px]">
          <Link
            href={`/locations/${propertyId}`}
            className="mb-8 inline-flex items-center gap-1.5 font-bold transition-colors duration-150 hover:text-orange"
            style={{ fontSize: '0.9375rem', color: '#888680' }}
          >
            <ArrowLeft className="h-4 w-4" /> Back to {facility.name}
          </Link>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
            <h1 className="font-black tracking-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1, color: '#181818' }}>
              {sizeLabel} <span style={{ color: '#E8622A' }}>units</span>
            </h1>
            <span
              className="font-bold uppercase"
              style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: '#888680', backgroundColor: '#FFFFFF', padding: '4px 10px', borderRadius: 4 }}
            >
              {SIZE_CATEGORY_LABELS[category]}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3" style={{ fontSize: '0.9375rem', color: '#888680' }}>
            <span>{sqft} sq ft</span>
            <span style={{ color: '#C4B89A' }}>·</span>
            <span style={{ color: '#E8622A' }}>{analogy.analogy}</span>
            <span style={{ color: '#C4B89A' }}>·</span>
            <span className="font-bold" style={{ color: '#E8622A' }}>{consumerUnits.length} available</span>
          </div>

          {/* What fits — inline */}
          <div className="mt-4 flex flex-wrap gap-2">
            {analogy.items.map((item) => (
              <span
                key={item}
                className="font-bold"
                style={{ fontSize: '0.75rem', color: '#888680', backgroundColor: '#FFFFFF', padding: '4px 10px', borderRadius: 4 }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Units */}
      <section className="px-5 py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px]">
          {consumerUnits.length > 0 ? (
            <div className="space-y-4">
              {consumerUnits.map((unit) => (
                <UnitCard
                  key={unit.id}
                  unit={unit}
                  facilityName={facility.name}
                  checkoutUrl={facility.checkoutUrl}
                />
              ))}
            </div>
          ) : (
            <div className="p-16 text-center" style={{ backgroundColor: '#FFFFFF', borderRadius: '16px 8px 16px 8px', boxShadow: '0 1px 2px rgba(24,24,24,0.05)' }}>
              <p style={{ fontSize: '1.0625rem', color: '#888680' }}>No available units in this size.</p>
              <Link
                href={`/locations/${propertyId}`}
                className="mt-4 inline-flex font-bold hover:brightness-110"
                style={{ fontSize: '0.9375rem', color: '#E8622A' }}
              >
                ← View all sizes
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
