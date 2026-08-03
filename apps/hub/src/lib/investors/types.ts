export interface HubDeal {
  id: string
  name: string
  description: string | null
  working_notes: string | null
  created_at: string
}

export interface HubInvestor {
  id: string
  legacy_id: number | null
  name: string
  investor_group: string | null
  introducer: string | null
  emails: string[]
  roles: string[]
  has_thank_you: boolean
  thank_you_email: boolean
  thank_you_card: boolean
  thank_you_gift: boolean
  thank_you_notes: string | null
  created_at: string
  updated_at: string
}

export type Stage =
  | 'funded'
  | 'committed'
  | 'engaged'
  | 'lead'
  | 'backup'
  | 'finder'
  | 'connector'
  | 'gatekept'
  | 'needs_contact'
  | 'finder_inactive'
  | 'out'

export interface HubDealInvestor {
  id: string
  deal_id: string
  investor_id: string
  stage: Stage
  amount: number | null
  funded: boolean
  last_outreach: string | null
  last_connection: string | null
  next_follow_up: string | null
  notes: string | null
  backup_amount: number | null
  created_at: string
  updated_at: string
}

export interface HubFamilyOffice {
  id: string
  office: string
  contacts: string | null
}

export interface HubFinderBroker {
  id: string
  affiliation: string | null
  contacts: string | null
  type: string | null
  comments: string | null
}

export interface HubSlDirectoryRow {
  id: string
  name: string | null
  subcategory: string | null
  org: string | null
  dba: string | null
  city: string | null
  state: string | null
  facilities: string | null
  email: string | null
  phone: string | null
}

export const STAGES: Record<Stage, { label: string; order: number }> = {
  funded: { label: 'Funded', order: 1 },
  committed: { label: 'Committed', order: 2 },
  engaged: { label: 'In Conversation', order: 3 },
  lead: { label: 'Active Lead', order: 4 },
  backup: { label: 'Backup Plan', order: 5 },
  finder: { label: 'Finder — Active', order: 6 },
  connector: { label: 'Connector', order: 7 },
  gatekept: { label: 'Gatekept', order: 8 },
  needs_contact: { label: 'Needs Contact Info', order: 9 },
  finder_inactive: { label: 'Finder — Inactive', order: 10 },
  out: { label: 'Out', order: 11 },
}

// Kanban board columns — finder_inactive folds into the "finder" column
// (matches the old app's board grouping), needs_contact has no "false"
// filter quirk to replicate here since that was dead logic in the original.
export const BOARD_COLUMNS: Stage[] = [
  'funded',
  'committed',
  'engaged',
  'lead',
  'backup',
  'finder',
  'connector',
  'gatekept',
  'needs_contact',
  'out',
]
