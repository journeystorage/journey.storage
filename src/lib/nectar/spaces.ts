import "server-only";
import { nectarV2 } from "./client";
import { COMPANY_ID } from "./facilities";

// Live availability + pricing via the v2 space-mix endpoint:
//   GET companies/{company}/properties/{property}/space-mix
// Each entry is a size grouping with unit counts and price ranges, split into
// all Units and currently-Vacant units — exactly what a facility page needs.

interface RangeBucket {
  count?: number;
  available?: number;
  min_price?: number;
  max_price?: number;
}

interface SpaceMixEntry {
  id: string;
  category_id?: string;
  category?: string;
  description?: string;
  width?: string | number;
  length?: string | number;
  height?: string | number;
  Units?: RangeBucket;
  Vacant?: RangeBucket;
}

/** Browser-safe, normalized availability + pricing for one size grouping. */
export interface SpaceOption {
  id: string;
  category: string | null;
  description: string | null;
  width: number | null;
  length: number | null;
  height: number | null;
  sizeLabel: string | null; // e.g. "10 × 10"
  available: number; // currently rentable count
  totalUnits: number;
  /** Best price to rent right now (vacant), in dollars. Null when none vacant. */
  onlinePrice: number | null;
  /** Lowest listed price across all units of this size, in dollars. */
  fromPrice: number | null;
}

function num(v: string | number | undefined): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.round(n) : null;
}

function toOption(e: SpaceMixEntry): SpaceOption {
  const width = num(e.width);
  const length = num(e.length);
  const vacant = e.Vacant ?? {};
  const units = e.Units ?? {};
  return {
    id: e.id,
    category: e.category ?? null,
    description: e.description ?? null,
    width,
    length,
    height: num(e.height),
    sizeLabel: width && length ? `${width} × ${length}` : null,
    available: vacant.available ?? vacant.count ?? 0,
    totalUnits: units.count ?? 0,
    onlinePrice: vacant.min_price ?? null,
    fromPrice: units.min_price ?? vacant.min_price ?? null,
  };
}

export async function getSpaceMix(propertyId: string, opts?: { revalidate?: number }): Promise<SpaceOption[]> {
  if (!propertyId || !COMPANY_ID) throw new Error("Nectar company/property not configured");
  const { data } = await nectarV2<{ space_mix?: SpaceMixEntry[] }>(
    `companies/${COMPANY_ID}/properties/${propertyId}/space-mix`,
    { next: { revalidate: opts?.revalidate ?? 120, tags: [`spaces-${propertyId}`] } },
  );
  return (data.space_mix ?? []).map(toOption);
}
