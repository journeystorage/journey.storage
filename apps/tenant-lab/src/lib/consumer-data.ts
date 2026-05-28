/**
 * Consumer-facing data layer.
 *
 * Translates raw Tenant API responses into structures that serve
 * the consumer's decision: "What size do I need? How much? Can I reserve?"
 *
 * Rules:
 * - NEVER expose occupancy, lease_count, unit numbers, or floor.
 * - Group by consumer size category (Small / Medium / Large / Vehicle), not raw dimensions.
 * - Surface promotions and price anchoring (promo vs standard).
 * - Flatten amenities into booleans the UI can consume directly.
 */

import type { TenantProperty, TenantUnit, TenantPromotion } from './tenant-api'
import { isAvailable, getAmenity, getSizeAnalogy, formatPrice } from './utils'

export { formatPrice }

// ── Consumer types ──────────────────────────────────────────────

export type SizeCategory = 'small' | 'medium' | 'large' | 'vehicle'

export interface ConsumerFacility {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string | null
  lat: number
  lng: number
  features: FacilityFeature[]
  /** Landing page for Mariposa checkout — null means no online rental. */
  checkoutUrl: string | null
}

export type FacilityFeature =
  | 'climate-control'
  | 'drive-up'
  | 'twenty-four-seven'
  | 'security'
  | 'extended-hours'

export interface ConsumerSizeGroup {
  /** e.g. "10x15" — used for URL routing only */
  key: string
  /** Display-ready label: "10' × 15'" */
  label: string
  sqft: number
  category: SizeCategory
  /** Human-readable analogy: "Half a garage" */
  analogy: string
  /** What fits inside this size */
  fitsItems: string[]
  /** Lowest *available* promo/current price */
  startingPrice: number
  /** Lowest standard rate (for anchoring — shows savings) */
  standardPrice: number
  availableCount: number
  hasClimate: boolean
  hasDriveUp: boolean
  /** Best promotion across units of this size */
  topPromotion: ConsumerPromotion | null
}

export interface ConsumerUnit {
  id: string
  /** Display-ready: "10' × 15'" */
  sizeLabel: string
  sqft: number
  /** Current / promo price */
  price: number
  /** Standard (rack) rate — for price anchoring */
  standardPrice: number
  /** Savings percentage vs standard rate */
  savingsPercent: number
  isClimate: boolean
  isDriveUp: boolean
  hasPower: boolean
  doorType: string | null
  description: string | null
  promotions: ConsumerPromotion[]
  /** Best single promotion for badge display */
  topPromotion: ConsumerPromotion | null
}

export interface ConsumerPromotion {
  id: string
  name: string
}

// ── Size category logic ─────────────────────────────────────────

const CATEGORY_THRESHOLDS: [number, SizeCategory][] = [
  [75, 'small'],   // ≤75 sqft  (5×5, 5×10, 5×15)
  [150, 'medium'], // ≤150 sqft (10×10, 10×15)
  [Infinity, 'large'],  // >150 sqft (10×20, 10×25, 10×30, 10×40+)
]

export function getSizeCategory(sqft: number): SizeCategory {
  for (const [threshold, category] of CATEGORY_THRESHOLDS) {
    if (sqft <= threshold) return category
  }
  return 'large'
}

export const SIZE_CATEGORY_LABELS: Record<SizeCategory, string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  vehicle: 'Vehicle',
}

// ── Transformers ────────────────────────────────────────────────

export function toConsumerFacility(property: TenantProperty): ConsumerFacility {
  return {
    id: property.id,
    name: property.name,
    address: `${property.Address.address}, ${property.Address.city}, ${property.Address.state} ${property.Address.zip}`,
    city: property.Address.city,
    state: property.Address.state,
    zip: property.Address.zip,
    phone: property.Phones?.[0]?.phone || null,
    lat: property.Address.lat,
    lng: property.Address.lng,
    checkoutUrl: property.landing_page ? `https://${property.landing_page}` : null,
    features: extractFacilityFeatures(property),
  }
}

function extractFacilityFeatures(_property: TenantProperty): FacilityFeature[] {
  // Base features all Journey facilities have
  return ['security', 'extended-hours']
}

export function toConsumerUnit(unit: TenantUnit): ConsumerUnit | null {
  if (!isAvailable(unit)) return null

  const w = Number(unit.width)
  const l = Number(unit.length)
  const sqft = w * l
  const price = unit.price
  const standardPrice = unit.set_rate || unit.default_price || price
  const savings = standardPrice > price ? Math.round((1 - price / standardPrice) * 100) : 0

  const climate = getAmenity(unit, 'Climate Control')
  const driveUp = getAmenity(unit, 'Drive Up Access')
  const power = getAmenity(unit, 'Power Outlet')
  const door = getAmenity(unit, 'Door')

  const promotions = (unit.Promotions || []).map(toConsumerPromotion)

  return {
    id: unit.id,
    sizeLabel: `${w}' × ${l}'`,
    sqft,
    price,
    standardPrice,
    savingsPercent: savings,
    isClimate: climate === 'Yes',
    isDriveUp: driveUp === 'Yes' || (unit.Category?.name?.toLowerCase().includes('drive') ?? false),
    hasPower: power === 'Yes',
    doorType: door && door !== 'No' ? door : null,
    description: unit.description || null,
    promotions,
    topPromotion: promotions[0] || null,
  }
}

function toConsumerPromotion(promo: TenantPromotion): ConsumerPromotion {
  return { id: promo.id, name: promo.name }
}

/**
 * Groups available units by size into consumer-friendly categories.
 * Sorts Small → Medium → Large, then by sqft within each category.
 */
export function groupByConsumerSize(units: TenantUnit[]): ConsumerSizeGroup[] {
  const groups = new Map<string, TenantUnit[]>()

  for (const unit of units) {
    const w = Number(unit.width)
    const l = Number(unit.length)
    const key = `${w}x${l}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(unit)
  }

  return Array.from(groups.entries())
    .map(([key, groupUnits]) => {
      const w = Number(groupUnits[0].width)
      const l = Number(groupUnits[0].length)
      const sqft = w * l
      const category = getSizeCategory(sqft)
      const analogy = getSizeAnalogy(sqft)

      const available = groupUnits.filter(isAvailable)
      const prices = available.map((u) => u.price).filter((p) => p > 0)
      const standardPrices = available
        .map((u) => u.set_rate || u.default_price || u.price)
        .filter((p) => p > 0)

      // Best promotion across all units of this size
      const allPromos = available.flatMap((u) => u.Promotions || [])
      const topPromo = allPromos.length > 0 ? toConsumerPromotion(allPromos[0]) : null

      const hasClimate = groupUnits.some((u) => getAmenity(u, 'Climate Control') === 'Yes')
      const hasDriveUp =
        groupUnits.some((u) => getAmenity(u, 'Drive Up Access') === 'Yes') ||
        groupUnits.some((u) => u.Category?.name?.toLowerCase().includes('drive'))

      // Add climate/drive-up to facility-level features detection
      return {
        key,
        label: `${w}' × ${l}'`,
        sqft,
        category,
        analogy: analogy.analogy,
        fitsItems: analogy.items,
        startingPrice: prices.length ? Math.min(...prices) : 0,
        standardPrice: standardPrices.length ? Math.min(...standardPrices) : 0,
        availableCount: available.length,
        hasClimate,
        hasDriveUp,
        topPromotion: topPromo,
      }
    })
    .filter((g) => g.availableCount > 0)
    .sort((a, b) => a.sqft - b.sqft)
}

/**
 * Given size groups, detect which facility-level features exist
 * (useful for feature badges on facility cards without loading all units).
 */
export function detectFeaturesFromGroups(groups: ConsumerSizeGroup[]): FacilityFeature[] {
  const features: FacilityFeature[] = ['security', 'extended-hours']
  if (groups.some((g) => g.hasClimate)) features.unshift('climate-control')
  if (groups.some((g) => g.hasDriveUp)) features.unshift('drive-up')
  return features
}

/**
 * Get available consumer units for a specific size, sorted by price.
 */
export function getAvailableUnitsForSize(
  units: TenantUnit[],
  sizeKey: string,
): ConsumerUnit[] {
  const [w, l] = sizeKey.split('x').map(Number)

  return units
    .filter((u) => Number(u.width) === w && Number(u.length) === l)
    .map(toConsumerUnit)
    .filter((u): u is ConsumerUnit => u !== null)
    .sort((a, b) => a.price - b.price)
}
