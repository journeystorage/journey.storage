// Facility slug -> Tenant Inc v2 identifiers for Journey.Storage's Granbury locations.
//
// The live API is v2, app-scoped and company/property-scoped:
//   {NECTAR_BASE_URL}/companies/{company}/properties/{property}/space-mix
//
// COMPANY_ID is one value for the whole account (NECTAR_COMPANY_ID).
// Each facility needs its production PROPERTY id (FACILITY_*_ID). Those are not
// yet live under our production company — until they are, every slug falls back
// to NECTAR_SANDBOX_PROPERTY_ID (the "UC Irvine Storage" demo property Tenant Inc
// gave us for testing; it carries real prod codes, so go-live is an ID swap only).

export interface FacilityConfig {
  slug: string;
  displayName: string;
  propertyId: string; // v2 property id (short id like "85B73ubBGy")
}

export const COMPANY_ID = process.env.NECTAR_COMPANY_ID ?? "";
export const HB_COMPANY_ID = process.env.HB_COMPANY_ID ?? ""; // Hummingbird company id (move-out)

// Testing sandbox — all slugs resolve here until the real Granbury property ids exist.
const SANDBOX_PROPERTY_ID = process.env.NECTAR_SANDBOX_PROPERTY_ID ?? "";

function resolve(envId: string | undefined): string {
  return (envId && envId.trim()) || SANDBOX_PROPERTY_ID;
}

export const FACILITIES: Record<string, FacilityConfig> = {
  templehallhwy: {
    slug: "templehallhwy",
    displayName: "Temple Hall Hwy",
    propertyId: resolve(process.env.FACILITY_TEMPLEHALL_ID),
  },
  westernhillstrl: {
    slug: "westernhillstrl",
    displayName: "Western Hills Trl",
    propertyId: resolve(process.env.FACILITY_WESTERNHILLS_ID),
  },
  mccrearyrd: {
    slug: "mccrearyrd",
    displayName: "McCreary Rd",
    propertyId: resolve(process.env.FACILITY_MCCREARY_ID),
  },
};

export function facilityBySlug(slug: string): FacilityConfig | undefined {
  const cfg = FACILITIES[slug];
  if (!cfg || !cfg.propertyId) return undefined;
  return cfg;
}
