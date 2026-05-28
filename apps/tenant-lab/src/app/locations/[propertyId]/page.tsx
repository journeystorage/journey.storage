import { getProperties, getUnits } from '@/lib/tenant-api'
import {
  toConsumerFacility,
  groupByConsumerSize,
  detectFeaturesFromGroups,
  formatPrice,
  SIZE_CATEGORY_LABELS,
  type SizeCategory,
  type ConsumerSizeGroup,
} from '@/lib/consumer-data'
import { MapPin, Phone, Thermometer, Car, ShieldCheck, Clock, ArrowRight, Ruler } from 'lucide-react'
import Link from 'next/link'

export default async function FacilityPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const { propertyId } = await params

  const [propertiesData, unitsData] = await Promise.all([
    getProperties(),
    getUnits(propertyId, { limit: 200 }),
  ])

  const property = propertiesData.properties.find((p) => p.id === propertyId)
  if (!property) {
    return <div className="mx-auto max-w-[1200px] px-5 py-24 text-center" style={{ color: '#888680' }}>Property not found.</div>
  }

  let allUnits = unitsData.units
  if (unitsData.paging.total > 200) {
    const remaining = await getUnits(propertyId, { limit: unitsData.paging.total - 200, offset: 200 })
    allUnits = [...allUnits, ...remaining.units]
  }

  const facility = toConsumerFacility(property)
  const sizeGroups = groupByConsumerSize(allUnits)
  const features = detectFeaturesFromGroups(sizeGroups)
  const totalAvailable = sizeGroups.reduce((sum, g) => sum + g.availableCount, 0)

  // Group sizes into consumer categories
  const categories = new Map<SizeCategory, ConsumerSizeGroup[]>()
  for (const group of sizeGroups) {
    if (!categories.has(group.category)) categories.set(group.category, [])
    categories.get(group.category)!.push(group)
  }

  // Best promotion across all size groups
  const topPromo = sizeGroups.find((g) => g.topPromotion)?.topPromotion

  const FEATURE_CONFIG = {
    'climate-control': { icon: Thermometer, label: 'Climate controlled' },
    'drive-up': { icon: Car, label: 'Drive-up access' },
    'security': { icon: ShieldCheck, label: '24/7 security' },
    'extended-hours': { icon: Clock, label: 'Extended hours' },
    'twenty-four-seven': { icon: Clock, label: '24/7 access' },
  } as const

  return (
    <div style={{ backgroundColor: '#F5F0E8' }}>
      {/* Promo banner */}
      {topPromo && (
        <div
          className="px-5 py-3 text-center font-bold"
          style={{ backgroundColor: '#181818', color: '#F5F0E8', fontSize: '0.9375rem' }}
        >
          <span style={{ color: '#E8622A' }}>Special offer</span> — {topPromo.name}
        </div>
      )}

      {/* Header */}
      <section className="px-5 py-12 lg:py-16" style={{ borderBottom: '1px solid rgba(196,184,154,0.4)' }}>
        <div className="mx-auto max-w-[1200px]">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 font-bold transition-colors duration-150 hover:text-orange"
            style={{ fontSize: '0.9375rem', color: '#888680' }}
          >
            ← All locations
          </Link>

          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="font-black tracking-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1, color: '#181818' }}>
                {facility.name}
              </h1>
              <div className="mt-3 flex items-center gap-2" style={{ fontSize: '0.9375rem', color: '#888680' }}>
                <MapPin className="h-4 w-4" />
                {facility.address}
              </div>
              {facility.phone && (
                <a
                  href={`tel:${facility.phone}`}
                  className="mt-1 flex items-center gap-2 transition-colors duration-150 hover:text-orange"
                  style={{ fontSize: '0.9375rem', color: 'rgba(136,134,128,0.6)' }}
                >
                  <Phone className="h-3.5 w-3.5" />
                  {facility.phone}
                </a>
              )}
            </div>

            {/* Available count — NOT occupancy */}
            <div
              className="shrink-0 px-6 py-4 text-center"
              style={{
                backgroundColor: '#FFF',
                borderRadius: '8px 4px 8px 4px',
                boxShadow: '0 1px 2px rgba(24,24,24,0.05)',
              }}
            >
              <div className="font-bold" style={{ fontSize: '1.75rem', color: '#E8622A' }}>{totalAvailable}</div>
              <div style={{ fontSize: '0.75rem', color: '#888680' }}>Units available</div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {features.map((feat) => {
              const config = FEATURE_CONFIG[feat]
              if (!config) return null
              return <FeatureTag key={feat} icon={config.icon} label={config.label} />
            })}
          </div>
        </div>
      </section>

      {/* Sizes grouped by consumer category */}
      <section className="px-5 py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-bold tracking-tight" style={{ fontSize: '2.5rem', lineHeight: 1.08, color: '#181818' }}>
                Choose your size
              </h2>
              <p className="mt-2" style={{ fontSize: '1.0625rem', color: '#888680' }}>
                {totalAvailable} units available across {sizeGroups.length} sizes
              </p>
            </div>
            <Link
              href="/size-guide"
              className="flex items-center gap-2 font-bold transition-colors duration-150 hover:brightness-110"
              style={{ fontSize: '0.9375rem', color: '#E8622A' }}
            >
              <Ruler className="h-4 w-4" />
              Not sure what size? →
            </Link>
          </div>

          <div className="space-y-12">
            {Array.from(categories.entries()).map(([category, groups]) => (
              <div key={category}>
                <h3
                  className="mb-4 font-bold uppercase"
                  style={{ fontSize: '0.8125rem', letterSpacing: '0.15em', color: '#888680' }}
                >
                  {SIZE_CATEGORY_LABELS[category]}
                </h3>
                <div className="space-y-3">
                  {groups.map((group) => (
                    <Link
                      key={group.key}
                      href={`/locations/${propertyId}/units?size=${group.key}`}
                      className="group flex flex-col gap-4 p-6 transition-all duration-150 hover:-translate-y-0.5 sm:flex-row sm:items-center sm:gap-6"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px 16px 8px 16px',
                        boxShadow: '0 1px 2px rgba(24,24,24,0.05)',
                      }}
                    >
                      {/* Size visual */}
                      <div
                        className="hidden h-14 w-14 shrink-0 items-center justify-center sm:flex"
                        style={{ borderRadius: 8, backgroundColor: '#F5F0E8' }}
                      >
                        <SizeBlock sqft={group.sqft} />
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline gap-3">
                          <h4 className="font-bold tracking-tight" style={{ fontSize: '1.375rem', color: '#181818' }}>
                            {group.label}
                          </h4>
                          <span style={{ fontSize: '0.9375rem', color: '#888680' }}>
                            {group.sqft} sq ft
                          </span>
                        </div>

                        {/* Consumer-friendly analogy + what fits */}
                        <p className="mt-1" style={{ fontSize: '0.9375rem', color: '#E8622A' }}>
                          {group.analogy}
                        </p>
                        <p className="mt-1" style={{ fontSize: '0.8125rem', color: 'rgba(136,134,128,0.7)' }}>
                          Fits: {group.fitsItems.slice(0, 3).join(' · ')}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {group.hasClimate && (
                            <span className="font-bold" style={{ fontSize: '0.75rem', color: '#E8622A', backgroundColor: 'rgba(232,98,42,0.1)', padding: '2px 8px', borderRadius: 4 }}>
                              Climate
                            </span>
                          )}
                          {group.hasDriveUp && (
                            <span className="font-bold" style={{ fontSize: '0.75rem', color: '#D4956A', backgroundColor: 'rgba(212,149,106,0.1)', padding: '2px 8px', borderRadius: 4 }}>
                              Drive-up
                            </span>
                          )}
                          {group.topPromotion && (
                            <span className="font-bold" style={{ fontSize: '0.75rem', color: '#7AAF6E', backgroundColor: 'rgba(122,175,110,0.1)', padding: '2px 8px', borderRadius: 4 }}>
                              {group.topPromotion.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pricing with anchoring */}
                      <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1">
                          <span style={{ fontSize: '0.75rem', color: '#888680' }}>from</span>
                          <span className="font-bold" style={{ fontSize: '1.75rem', color: '#181818' }}>
                            {formatPrice(group.startingPrice)}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#888680' }}>/mo</span>
                        </div>
                        {group.standardPrice > group.startingPrice && (
                          <span className="line-through" style={{ fontSize: '0.8125rem', color: '#888680' }}>
                            {formatPrice(group.standardPrice)}/mo
                          </span>
                        )}
                        <div className="mt-1">
                          <span className="font-bold" style={{ fontSize: '0.75rem', color: '#E8622A' }}>
                            {group.availableCount} available
                          </span>
                        </div>
                      </div>

                      <ArrowRight className="hidden h-5 w-5 shrink-0 transition-all duration-150 group-hover:translate-x-1 group-hover:text-orange sm:block" style={{ color: '#C4B89A' }} />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-[1200px]">
          <div
            className="grid gap-px sm:grid-cols-3"
            style={{ backgroundColor: 'rgba(196,184,154,0.3)', borderRadius: '8px 16px 8px 16px', overflow: 'hidden' }}
          >
            <TrustSignal title="No commitment" description="Reserve for free — no credit card, no obligation. Change your size or date anytime." />
            <TrustSignal title="Secure facility" description="24/7 video surveillance, electronic gate access, and tamper-resistant locks." />
            <TrustSignal title="Month-to-month" description="Flexible leases with no long-term contracts. Cancel anytime with 30-day notice." />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureTag({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <span
      className="flex items-center gap-2 font-bold"
      style={{
        fontSize: '0.75rem',
        color: '#888680',
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(196,184,154,0.4)',
        padding: '8px 12px',
        borderRadius: 4,
        boxShadow: '0 1px 2px rgba(24,24,24,0.05)',
      }}
    >
      <Icon className="h-4 w-4" />
      {label}
    </span>
  )
}

function SizeBlock({ sqft }: { sqft: number }) {
  const scale = Math.min(1, Math.max(0.25, sqft / 300))
  const size = 10 + scale * 26
  return (
    <div
      style={{
        width: size,
        height: size,
        border: '1px solid rgba(232,98,42,0.3)',
        backgroundColor: 'rgba(232,98,42,0.1)',
        borderRadius: '4px 0 4px 0',
      }}
    />
  )
}

function TrustSignal({ title, description }: { title: string; description: string }) {
  return (
    <div className="px-8 py-6" style={{ backgroundColor: '#FFFFFF' }}>
      <h4 className="font-bold" style={{ fontSize: '1rem', color: '#181818' }}>{title}</h4>
      <p className="mt-1" style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: '#888680' }}>{description}</p>
    </div>
  )
}
