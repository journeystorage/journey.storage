// GET /api/nectar/spaces/:facility
// Cached availability + pricing feed for a facility page.
// Returns browser-safe pricing cards derived from GET /facilities/{fid}/space-types.

import { NextRequest, NextResponse } from "next/server";
import { facilityBySlug } from "@/lib/nectar/facilities";
import { getSpaceTypes } from "@/lib/nectar/spaces";
import { NectarError } from "@/lib/nectar/client";
import { costArrayTotal, type SpaceType } from "@/lib/nectar/types";

export const revalidate = 120;

function toCard(t: SpaceType) {
  const street = t.costs.find((c) => c.costType === "rent");
  const web = t.costs.find((c) => c.costType === "discountedRent");
  return {
    spaceTypeId: t.id,
    name: t.name,
    category: t.category,
    description: t.description,
    width: t.dimension?.width?.value ?? null,
    length: t.dimension?.length?.value ?? null,
    streetRate: street?.amount ?? costArrayTotal(t.costs),
    webRate: web?.amount ?? null, // promotional online rate when present
    available: t.spaceCount.available,
    total: t.spaceCount.total,
    features: (t.features ?? []).map((f) => f.name),
    discounts: t.discounts.filter((d) => d.visible).map((d) => ({ id: d.id, name: d.name, value: d.value, valueType: d.valueType })),
    insurance: t.insurance.map((i) => ({ id: i.id, coverage: i.coverage, premium: i.premium, description: i.description })),
  };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ facility: string }> }) {
  const { facility } = await params;
  const cfg = facilityBySlug(facility);
  if (!cfg) return NextResponse.json({ error: "Unknown facility" }, { status: 404 });
  try {
    const spaceTypes = await getSpaceTypes(cfg.gdsFacilityId);
    return NextResponse.json({
      facility: cfg.slug,
      updatedAt: Date.now(),
      spaceTypes: spaceTypes.map(toCard).sort((a, b) => (a.streetRate ?? 0) - (b.streetRate ?? 0)),
    });
  } catch (e) {
    const status = e instanceof NectarError && e.isAuthError ? 502 : 502;
    return NextResponse.json({ error: "Live pricing temporarily unavailable" }, { status });
  }
}
