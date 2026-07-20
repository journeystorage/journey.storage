// POST /api/nectar/account/lookup   { email } or { phone }
// -> { spaces: AccountSpaceView[] } across all facilities/tenants for that person.
//
// SECURITY: the Nectar API does not verify identity — anyone with a tenant's
// email could see balances. Put this behind a one-time-code email verification
// (see verifyIdentity stub) before exposing balances in production.

import { NextRequest, NextResponse } from "next/server";
import { OWNER_ID, facilityById } from "@/lib/nectar/facilities";
import { findCustomers, getTenant } from "@/lib/nectar/tenants";
import { toAccountView, type AccountSpaceView } from "@/lib/nectar/types";

async function verifyIdentity(_req: NextRequest): Promise<boolean> {
  // TODO: check a signed session cookie set after email OTP verification.
  return process.env.NODE_ENV !== "production" || process.env.ACCOUNT_LOOKUP_OPEN === "true";
}

export async function POST(req: NextRequest) {
  if (!(await verifyIdentity(req))) return NextResponse.json({ error: "Verification required" }, { status: 401 });
  const { email, phone } = await req.json();
  if (!email && !phone) return NextResponse.json({ error: "email or phone required" }, { status: 400 });

  const customers = await findCustomers(OWNER_ID, { email, phone });
  const spaces: AccountSpaceView[] = [];
  for (const customer of customers) {
    for (const [facilityId, tenants] of Object.entries(customer.items ?? {})) {
      for (const tenantId of Object.keys(tenants)) {
        try {
          const tenant = await getTenant(facilityId, tenantId);
          const cfgSlug = facilityById(facilityId)?.slug;
          spaces.push(...toAccountView(facilityId, tenant).map((v) => ({ ...v, facilitySlug: cfgSlug }) as AccountSpaceView & { facilitySlug?: string }));
        } catch {
          // Skip tenants we cannot read; do not fail the whole lookup.
        }
      }
    }
  }
  return NextResponse.json({ spaces });
}
