import type { TenantUnit } from './tenant-api'

export interface SizeGroup {
  key: string
  width: number
  length: number
  sqft: number
  label: string
  units: TenantUnit[]
  available: TenantUnit[]
  occupied: TenantUnit[]
  startingPrice: number
  hasClimate: boolean
  hasDriveUp: boolean
}

export function groupUnitsBySize(units: TenantUnit[]): SizeGroup[] {
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
      const available = groupUnits.filter((u) => isAvailable(u))
      const occupied = groupUnits.filter((u) => !isAvailable(u))
      const prices = available.map((u) => u.price).filter((p) => p > 0)

      return {
        key,
        width: w,
        length: l,
        sqft: w * l,
        label: `${w}' × ${l}'`,
        units: groupUnits,
        available,
        occupied,
        startingPrice: prices.length ? Math.min(...prices) : 0,
        hasClimate: groupUnits.some((u) => getAmenity(u, 'Climate Control') === 'Yes'),
        hasDriveUp:
          groupUnits.some((u) => getAmenity(u, 'Drive Up Access') === 'Yes') ||
          groupUnits.some((u) => u.Category?.name?.toLowerCase().includes('drive')),
      }
    })
    .sort((a, b) => a.sqft - b.sqft)
}

export function isAvailable(unit: TenantUnit): boolean {
  return !unit.Lease || Object.keys(unit.Lease).length === 0
}

export function getAmenity(unit: TenantUnit, name: string): string | null {
  for (const category of Object.values(unit.Amenities || {})) {
    const found = category.find((a) => a.name === name)
    if (found) return found.value
  }
  return null
}

export function getSizeAnalogy(sqft: number): { analogy: string; items: string[] } {
  if (sqft <= 25) return {
    analogy: 'Small closet',
    items: ['Boxes & seasonal items', 'Small furniture', 'Sports equipment', 'Holiday decorations'],
  }
  if (sqft <= 50) return {
    analogy: 'Walk-in closet',
    items: ['Queen mattress set', 'Dresser & nightstand', 'Medium boxes', 'Bicycle & gear'],
  }
  if (sqft <= 75) return {
    analogy: 'Large closet',
    items: ['Studio apartment contents', 'Sofa & dining set', 'Appliances', 'Multiple boxes'],
  }
  if (sqft <= 100) return {
    analogy: 'Half a garage',
    items: ['1-bedroom apartment', 'Full living room set', 'Washer & dryer', 'Patio furniture'],
  }
  if (sqft <= 150) return {
    analogy: 'One-car garage',
    items: ['2-bedroom apartment', 'King bedroom set', 'Large appliances', 'Business inventory'],
  }
  if (sqft <= 200) return {
    analogy: 'Standard garage',
    items: ['3-bedroom house', 'Multiple room sets', 'Vehicle storage', 'Commercial equipment'],
  }
  if (sqft <= 300) return {
    analogy: 'Double garage',
    items: ['4-bedroom house', 'Full household', 'Multiple vehicles', 'Large business inventory'],
  }
  return {
    analogy: 'Warehouse space',
    items: ['5+ bedroom house', 'Commercial storage', 'Fleet vehicles', 'Industrial equipment'],
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price)
}
