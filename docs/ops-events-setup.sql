-- Table behind the "people" alerts: abandoned checkouts, sign-in codes that
-- were never used, and cards failing repeatedly.
--
-- Run once in the Supabase SQL editor for the journey.storage project.
-- Nothing sensitive is stored: a name, an email or phone, and which space they
-- were looking at. No identification, no card data.

create table if not exists public.ops_events (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null,
  contact     text,
  name        text,
  phone       text,
  detail      jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- The sweep always reads "recent events of these kinds", so index that.
create index if not exists ops_events_kind_created_idx
  on public.ops_events (kind, created_at desc);
create index if not exists ops_events_contact_idx
  on public.ops_events (contact);

-- Only the server (service-role key) touches this table; no browser ever reads
-- it. RLS on with no policies denies everything else by default.
alter table public.ops_events enable row level security;

-- These are short-lived operational signals, not records worth keeping. Delete
-- anything older than 30 days whenever you think of it, or schedule it with
-- pg_cron if that's enabled:
--   delete from public.ops_events where created_at < now() - interval '30 days';
