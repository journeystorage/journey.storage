// Facility slug -> Tenant Inc v2 identifiers for Journey.Storage's Granbury locations.
//
// The live API is v2, app-scoped and company/property-scoped:
//   {NECTAR_BASE_URL}/companies/{company}/properties/{property}/space-mix
//
// Company + property ids are NOT secret (they appear in rental URLs), so the
// live values are baked in as defaults — the only secret is NECTAR_API_KEY,
// which lives in server env only. Production therefore needs just the API key
// set in the host env; everything else resolves from these defaults.
// Env vars still override, so local .env.local can point at the sandbox.

export interface FacilityConfig {
  slug: string;
  displayName: string;
  propertyId: string; // v2 property id (short id like "eBnZmIeKbB")
}

// Live account (journeystorage.tenantinc.com).
const LIVE_COMPANY_ID = "bE2wKVa2XL";
const LIVE_PROPERTY = {
  templehallhwy: "eBnZmIeKbB", // capital I, not lowercase l
  westernhillstrl: "1jJLnFxM9v",
  mccrearyrd: "9j5g1tnM6v",
} as const;

export const COMPANY_ID = process.env.NECTAR_COMPANY_ID ?? LIVE_COMPANY_ID;
export const HB_COMPANY_ID = process.env.HB_COMPANY_ID ?? ""; // Hummingbird company id (move-out)

// Optional sandbox override — set NECTAR_SANDBOX_PROPERTY_ID to route every slug
// to a demo property for testing.
const SANDBOX_PROPERTY_ID = process.env.NECTAR_SANDBOX_PROPERTY_ID ?? "";

function resolve(envId: string | undefined, live: string): string {
  return (envId && envId.trim()) || SANDBOX_PROPERTY_ID || live;
}

export const FACILITIES: Record<string, FacilityConfig> = {
  templehallhwy: {
    slug: "templehallhwy",
    displayName: "Temple Hall Hwy",
    propertyId: resolve(process.env.FACILITY_TEMPLEHALL_ID, LIVE_PROPERTY.templehallhwy),
  },
  westernhillstrl: {
    slug: "westernhillstrl",
    displayName: "Western Hills Trl",
    propertyId: resolve(process.env.FACILITY_WESTERNHILLS_ID, LIVE_PROPERTY.westernhillstrl),
  },
  mccrearyrd: {
    slug: "mccrearyrd",
    displayName: "McCreary Rd",
    propertyId: resolve(process.env.FACILITY_MCCREARY_ID, LIVE_PROPERTY.mccrearyrd),
  },
};

// Returns config for any KNOWN slug (even if its property id isn't configured yet)
// so callers can distinguish "unknown facility" (404) from "known but no live data"
// (handled downstream as 502). A missing property id surfaces when getSpaceMix runs.
/** Reverse lookup: a unit/invoice carries a property_id, we want its name. */
export function facilityByPropertyId(propertyId: string): FacilityConfig | undefined {
  return Object.values(FACILITIES).find((f) => f.propertyId === propertyId);
}

export function facilityBySlug(slug: string): FacilityConfig | undefined {
  return FACILITIES[slug];
}
