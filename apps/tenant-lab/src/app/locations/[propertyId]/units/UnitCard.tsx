'use client'

import { Thermometer, Car, Zap, DoorOpen, ExternalLink } from 'lucide-react'
import type { ConsumerUnit } from '@/lib/consumer-data'
import { formatPrice } from '@/lib/consumer-data'

interface Props {
  unit: ConsumerUnit
  facilityName: string
  checkoutUrl: string | null
}

export function UnitCard({ unit, facilityName, checkoutUrl }: Props) {
  return (
    <div
      className="flex flex-col gap-6 transition-all duration-150 hover:-translate-y-0.5 sm:flex-row sm:items-center"
      style={{
        padding: '24px 32px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px 16px 8px 16px',
        boxShadow: '0 1px 2px rgba(24,24,24,0.05)',
      }}
    >
      <div className="flex-1">
        {/* Access type as the primary differentiator (not unit number) */}
        <div className="flex flex-wrap items-center gap-2">
          {unit.isClimate && (
            <span className="flex items-center gap-1 font-bold" style={{ fontSize: '0.9375rem', color: '#E8622A' }}>
              <Thermometer className="h-4 w-4" /> Climate controlled
            </span>
          )}
          {unit.isDriveUp && (
            <span className="flex items-center gap-1 font-bold" style={{ fontSize: '0.9375rem', color: '#D4956A' }}>
              <Car className="h-4 w-4" /> Drive-up access
            </span>
          )}
          {!unit.isClimate && !unit.isDriveUp && (
            <span className="font-bold" style={{ fontSize: '0.9375rem', color: '#181818' }}>
              Interior unit
            </span>
          )}
        </div>

        {/* Secondary features */}
        <div className="mt-2 flex flex-wrap gap-2">
          {unit.doorType && <Tag icon={DoorOpen}>{unit.doorType}</Tag>}
          {unit.hasPower && <Tag icon={Zap}>Power outlet</Tag>}
          {unit.topPromotion && (
            <Tag accent>{unit.topPromotion.name}</Tag>
          )}
        </div>
      </div>

      {/* Pricing + CTA */}
      <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
        <div className="text-right">
          <div className="flex items-baseline gap-1">
            <span className="font-bold" style={{ fontSize: '2rem', lineHeight: 1.08, color: '#181818' }}>
              {formatPrice(unit.price)}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#888680' }}>/mo</span>
          </div>
          {unit.savingsPercent > 0 && (
            <div className="flex items-center gap-2">
              <span className="line-through" style={{ fontSize: '0.8125rem', color: '#888680' }}>
                {formatPrice(unit.standardPrice)}
              </span>
              <span className="font-bold" style={{ fontSize: '0.75rem', color: '#7AAF6E' }}>
                Save {unit.savingsPercent}%
              </span>
            </div>
          )}
        </div>

        {/* Direct link to Tenant SuperLease checkout */}
        {checkoutUrl && (
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-bold transition-colors duration-150 hover:brightness-110 active:scale-[0.98]"
            style={{
              padding: '12px 28px',
              fontSize: '0.9375rem',
              color: '#FFFFFF',
              backgroundColor: '#E8622A',
              borderRadius: 24,
              whiteSpace: 'nowrap',
            }}
          >
            Reserve for free <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  )
}

function Tag({
  children,
  icon: Icon,
  accent,
}: {
  children: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  accent?: boolean
}) {
  return (
    <span
      className="inline-flex items-center gap-1 font-bold"
      style={{
        fontSize: '0.75rem',
        padding: '2px 8px',
        borderRadius: 4,
        color: accent ? '#7AAF6E' : '#888680',
        backgroundColor: accent ? 'rgba(122,175,110,0.1)' : '#F5F0E8',
      }}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  )
}
