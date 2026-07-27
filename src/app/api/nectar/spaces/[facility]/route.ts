// GET /api/nectar/spaces/:facility
// Cached live availability + pricing feed for a facility page.
// Derives browser-safe cards from the v2 space-mix endpoint.

import { NextRequest, NextResponse } from "next/server";
import { facilityBySlug } from "@/lib/nectar/facilities";
import { getSpaceMix, type SpaceOption } from "@/lib/nectar/spaces";

export const revalidate = 120;

function toCard(o: SpaceOption) {
  return {
    id: o.id,
    size: o.sizeLabel,
    width: o.width,
    length: o.length,
    category: o.category,
    description: o.description,
    available: o.available,
    inStock: o.available > 0,
    onlinePrice: o.onlinePrice, // dollars/mo — the bookable rate
    fromPrice: o.fromPrice,
  };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ facility: string }> }) {
  const { facility } = await params;
  const cfg = facilityBySlug(facility);
  if (!cfg) return NextResponse.json({ error: "Unknown facility" }, { status: 404 });
  try {
    const options = await getSpaceMix(cfg.propertyId);
    const spaces = options
      .map(toCard)
      // vacant first, then cheapest bookable rate
      .sort((a, b) => Number(b.inStock) - Number(a.inStock) || (a.onlinePrice ?? Infinity) - (b.onlinePrice ?? Infinity));
    return NextResponse.json({ facility: cfg.slug, updatedAt: Date.now(), spaces });
  } catch {
    return NextResponse.json({ error: "Live pricing temporarily unavailable" }, { status: 502 });
  }
}
