// Facility slug -> ID map for Journey.Storage's three Granbury locations.
// Fill in the real IDs from your tenant.dev App Dashboard (or GET /facilities/{id}).
// GDS ids are needed for everything; Hummingbird ids only for the move-out passthrough.

export interface FacilityConfig {
  slug: string;
  displayName: string;
  gdsFacilityId: string; // fac...
  hbPropertyId?: string; // Hummingbird short id (move-out / passthrough only)
}

export const OWNER_ID = process.env.NECTAR_OWNER_ID ?? "ownXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
export const HB_COMPANY_ID = process.env.HB_COMPANY_ID ?? ""; // Hummingbird company id (move-out)

export const FACILITIES: Record<string, FacilityConfig> = {
  templehallhwy: {
    slug: "templehallhwy",
    displayName: "Temple Hall Hwy",
    gdsFacilityId: process.env.FACILITY_TEMPLEHALL_ID ?? "facXXXXXXXXXXXXXXXXXXXXXXXXXXXX0001",
  },
  westernhillstrl: {
    slug: "westernhillstrl",
    displayName: "Western Hills Trl",
    gdsFacilityId: process.env.FACILITY_WESTERNHILLS_ID ?? "facXXXXXXXXXXXXXXXXXXXXXXXXXXXX0002",
  },
  mccrearyrd: {
    slug: "mccrearyrd",
    displayName: "McCreary Rd",
    gdsFacilityId: process.env.FACILITY_MCCREARY_ID ?? "facXXXXXXXXXXXXXXXXXXXXXXXXXXXX0003",
  },
};

export function facilityBySlug(slug: string): FacilityConfig | undefined {
  return FACILITIES[slug];
}

export function facilityById(gdsFacilityId: string): FacilityConfig | undefined {
  return Object.values(FACILITIES).find((f) => f.gdsFacilityId === gdsFacilityId);
}
