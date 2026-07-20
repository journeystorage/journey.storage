// Nectar Core (GDS) types — field names verbatim from tenant.dev data-model guides.
// Docs show casing drift on some fields (pmsId/pmsID, facilityId/facilityID,
// tenantId/tenantID, dimension/dimensions). Parse defensively via the helpers below.

export type CostType =
  | "rent"
  | "insurance"
  | "deposit"
  | "fee"
  | "discount"
  | "merchandise"
  | "tax"
  | "other"
  | "discountedRent" // promotional web rate, seen on spacetype costs
  | "reservation";

export interface CostItem {
  amount: number;
  description: string;
  costType: CostType | string;
  start: number; // unix seconds, 0 = n/a
  end: number;
  tax: number;
  total: number; // amount + tax
  pmsRaw?: unknown;
}

/**
 * Grand-total rule (verbatim from the Cost Array guide):
 * sum `total` of every item EXCEPT costType "discount", then SUBTRACT the
 * `total` of the discount items. Discounts arrive as positive numbers.
 */
export function costArrayTotal(costs: CostItem[] | null | undefined): number {
  if (!costs?.length) return 0;
  const cents = costs.reduce((acc, c) => {
    const t = Math.round((c.total ?? 0) * 100);
    return c.costType === "discount" ? acc - t : acc + t;
  }, 0);
  return cents / 100;
}

export interface Dimensions {
  height?: { unit: string; value: number };
  length?: { unit: string; value: number };
  width?: { unit: string; value: number };
}

export interface Discount {
  id: string;
  facilityId: string;
  name: string;
  description: string;
  pmsID?: string; // capital ID on this model
  value: number;
  valueType: "amount" | "percentage";
  visible: boolean;
  discountType?: { senior: boolean; military: boolean; student: boolean; regular: boolean };
}

export interface Insurance {
  id: string;
  facilityId: string;
  coverage: number;
  percent: number;
  description: string;
  pmsId?: string;
  premium: number; // monthly premium
  provider: string;
  theftCoverage: number;
  start: number;
  end: number;
}

export interface SpaceType {
  id: string; // spt...
  pmsId?: string;
  facilityId: string;
  name: string; // e.g. "10x10"
  description: string;
  category: string; // storage | parking | office | ...
  costs: CostItem[];
  discounts: Discount[];
  insurance: Insurance[];
  features: Array<{ name: string; description: string; fee: unknown }> | null;
  dimension?: Dimensions; // NOTE: singular on spacetype
  spaceCount: { available: number; total: number };
  lastUpdate: number;
}

export interface ContactName {
  first: string;
  last: string;
  middle?: string;
  prefix?: string;
  company?: string;
}

export interface ContactAddress {
  name?: string;
  address1: string;
  address2?: string;
  city: string;
  stateCode: string;
  postalCode: string;
}

export interface Contact {
  type: "primary" | "alternate" | "emergency" | "company" | string;
  email: string;
  name: ContactName;
  address: ContactAddress;
  phones: Array<{ description?: string; number: string; type: string }>; // E.164 numbers
  pmsId?: string;
  description?: string;
  accessAuthorized?: boolean;
}

export interface TenantSpace {
  spaceId: string;
  leaseId: string;
  spaceNumber: string;
  spaceTypeId?: string;
  status: "available" | "unAvailable" | "lockedOut" | "rented" | string;
  lockedOut: boolean;
  allowOnlinePayment: boolean;
  accessCode?: string;
  gateAccess?: { type: "noke" | "default" | string; pin: string };
  billingDate: number;
  billingType?: string;
  paidThrough: number;
  startDate: number;
  balance: CostItem[] | null; // current dues; null/[] when nothing owed
  cost: CostItem[] | null; // recurring monthly breakdown
  autoPay?: {
    enabled: boolean;
    paymentInstrument?: {
      card?: { number: string; expiration: string } | null; // number = last 4
      bankAccount?: unknown;
      address?: unknown;
    };
    dayOfMonth?: number;
  };
  insurance?: Insurance[];
  insuranceId?: string;
  documents?: Array<{ Name?: string; Type?: string; Location?: string; Reference?: string }> | null;
  dimensions?: Dimensions | null;
  lastUpdate?: number;
}

export interface Tenant {
  id: string; // tnt...
  facilityID?: string; // capital ID on this model
  facilityId?: string;
  pmsId?: string;
  customerId?: string;
  contacts: Contact[];
  spaces: TenantSpace[];
  business?: boolean;
  military?: boolean;
  dob?: string;
  ssn?: string; // NEVER forward to the browser
  driversLicense?: unknown; // NEVER forward to the browser
  reservations?: string[] | null;
  lastUpdate?: number;
}

export interface Customer {
  id: string; // cus...
  ownerId: string;
  pmsId?: string;
  /** { facilityId: { tenantId: [spaceId, ...] } } */
  items: Record<string, Record<string, string[]>>;
  contacts: Contact[];
}

export interface PaymentCard {
  name: string;
  number: string;
  cvv: string;
  expiration: string; // "MM/YYYY"
  zip: string;
}

export interface PaymentInstrument {
  card: PaymentCard;
  address: ContactAddress & { name: string }; // billing address is MANDATORY
}

export interface RentalRequest {
  spaceType: string;
  space: string;
  hold: string;
  reservationId?: string;
  paymentAmount: number; // discounts already subtracted (costArrayTotal of the quote)
  paymentInstrument: PaymentInstrument;
  tenantInfo: {
    contacts: Contact[]; // exactly one type:"primary"
    alternateDeclined?: boolean;
    business?: boolean;
    dob?: string;
    ssn?: string;
    driversLicense?: {
      name?: string;
      number?: string;
      state?: string;
      city?: string;
      expiration?: string;
    };
  };
  autopay?: boolean;
  accessCode?: string | null;
  discountIds?: string[];
  insuranceId?: string;
  moveinDate?: number;
  tracking?: {
    visitor_id?: string;
    touchpoints: Array<Record<string, string>>;
  };
}

// Trimmed, browser-safe projection of a tenant for the account UI.
export interface AccountSpaceView {
  facilityId: string;
  tenantId: string;
  spaceId: string;
  spaceNumber: string;
  status: string;
  lockedOut: boolean;
  allowOnlinePayment: boolean;
  paidThrough: number;
  billingDate: number;
  balance: CostItem[];
  balanceDue: number;
  monthlyCost: number;
  autopayEnabled: boolean;
  autopayCardLast4?: string;
}

export function toAccountView(facilityId: string, t: Tenant): AccountSpaceView[] {
  return (t.spaces ?? []).map((s) => ({
    facilityId,
    tenantId: t.id,
    spaceId: s.spaceId,
    spaceNumber: s.spaceNumber,
    status: s.status,
    lockedOut: !!s.lockedOut,
    allowOnlinePayment: !!s.allowOnlinePayment,
    paidThrough: s.paidThrough,
    billingDate: s.billingDate,
    balance: s.balance ?? [],
    balanceDue: costArrayTotal(s.balance),
    monthlyCost: costArrayTotal(s.cost),
    autopayEnabled: !!s.autoPay?.enabled,
    autopayCardLast4: s.autoPay?.paymentInstrument?.card?.number || undefined,
  }));
}
