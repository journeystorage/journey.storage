-- Journey.storage — Hub: Supabase setup.
-- Run in the Supabase SQL editor (project uwncchrmdotateyditjc — same
-- project as the investors CRM and portal, per apps/portal/config.js).
-- Two-person allowlist (lyvia + jonah) — every policy is scoped to that
-- pair, enforced at the database level (defense in depth, not just the
-- app's proxy gate — see src/proxy.ts). Idempotent — safe to re-run after
-- edits, whether or not an earlier version of this file already ran.

create table if not exists public.hub_tasks (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  notes      text,
  status     text not null default 'open' check (status in ('open', 'doing', 'done')),
  priority   text check (priority in ('low', 'normal', 'high')),
  due_date   date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hub_notes (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  content    text not null default '',
  tags       text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Fixed five departments — enforced here and in src/lib/departments.ts.
-- Keep both in sync if this list ever changes.
create table if not exists public.hub_ai_employees (
  id           uuid primary key default gen_random_uuid(),
  department   text not null check (department in ('finance', 'marketing', 'investor-relations', 'acquisitions', 'development', 'operations')),
  name         text not null,
  role         text not null,
  system_prompt text not null default '',
  created_at   timestamptz not null default now()
);

update public.hub_ai_employees set department = 'finance' where department = 'accounting';
-- Development & Construction are one real vertical (Journey.Contractors) — merged.
update public.hub_ai_employees set department = 'development' where department = 'construction';

alter table public.hub_ai_employees drop constraint if exists hub_ai_employees_department_check;
alter table public.hub_ai_employees
  add constraint hub_ai_employees_department_check
  check (department in ('finance', 'marketing', 'investor-relations', 'acquisitions', 'development', 'operations'));

create table if not exists public.hub_chat_messages (
  id         uuid primary key default gen_random_uuid(),
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamptz not null default now()
);

-- One row per chat turn — real Anthropic token usage, not an estimate.
-- employee_id null = Jarvis. Kept even if the employee is later deleted
-- (set null, not cascade) since this is financial history.
create table if not exists public.hub_api_usage (
  id                            uuid primary key default gen_random_uuid(),
  employee_id                   uuid references public.hub_ai_employees(id) on delete set null,
  model                         text not null,
  input_tokens                  integer not null default 0,
  output_tokens                 integer not null default 0,
  cache_creation_input_tokens   integer not null default 0,
  cache_read_input_tokens       integer not null default 0,
  cost_usd                      numeric(10, 4) not null default 0,
  created_at                    timestamptz not null default now()
);

-- Append-only observations Claude generates on demand from real hub data.
create table if not exists public.hub_insights (
  id         uuid primary key default gen_random_uuid(),
  content    text not null,
  category   text check (category in ('risk', 'opportunity', 'note')),
  created_at timestamptz not null default now()
);

-- Additive columns for department-scoping (nullable = "unassigned"/Jarvis-general).
alter table public.hub_tasks add column if not exists department text;
alter table public.hub_notes add column if not exists department text;
alter table public.hub_chat_messages add column if not exists employee_id uuid references public.hub_ai_employees(id) on delete cascade;

-- Accounting was renamed to Finance, and Construction was merged into
-- Development (one real vertical, Journey.Contractors) — migrate any
-- existing rows before the constraints below get tightened.
update public.hub_tasks set department = 'finance' where department = 'accounting';
update public.hub_notes set department = 'finance' where department = 'accounting';
update public.hub_tasks set department = 'development' where department = 'construction';
update public.hub_notes set department = 'development' where department = 'construction';

alter table public.hub_tasks drop constraint if exists hub_tasks_department_check;
alter table public.hub_tasks
  add constraint hub_tasks_department_check
  check (department is null or department in ('finance', 'marketing', 'investor-relations', 'acquisitions', 'development', 'operations'));

alter table public.hub_notes drop constraint if exists hub_notes_department_check;
alter table public.hub_notes
  add constraint hub_notes_department_check
  check (department is null or department in ('finance', 'marketing', 'investor-relations', 'acquisitions', 'development', 'operations'));

alter table public.hub_tasks enable row level security;
alter table public.hub_notes enable row level security;
alter table public.hub_ai_employees enable row level security;
alter table public.hub_chat_messages enable row level security;
alter table public.hub_api_usage enable row level security;
alter table public.hub_insights enable row level security;

drop policy if exists hub_tasks_all on public.hub_tasks;
create policy hub_tasks_all on public.hub_tasks
  for all to authenticated
  using ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'))
  with check ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'));

drop policy if exists hub_notes_all on public.hub_notes;
create policy hub_notes_all on public.hub_notes
  for all to authenticated
  using ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'))
  with check ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'));

drop policy if exists hub_ai_employees_all on public.hub_ai_employees;
create policy hub_ai_employees_all on public.hub_ai_employees
  for all to authenticated
  using ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'))
  with check ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'));

drop policy if exists hub_chat_messages_all on public.hub_chat_messages;
create policy hub_chat_messages_all on public.hub_chat_messages
  for all to authenticated
  using ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'))
  with check ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'));

drop policy if exists hub_api_usage_all on public.hub_api_usage;
create policy hub_api_usage_all on public.hub_api_usage
  for all to authenticated
  using ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'))
  with check ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'));

drop policy if exists hub_insights_all on public.hub_insights;
create policy hub_insights_all on public.hub_insights
  for all to authenticated
  using ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'))
  with check ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'));

-- Live sync across tabs/devices, same as investor_db.
do $$ begin
  alter publication supabase_realtime add table public.hub_tasks;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.hub_notes;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.hub_ai_employees;
exception when duplicate_object then null; end $$;

create index if not exists hub_tasks_status_idx on public.hub_tasks (status, due_date);
create index if not exists hub_tasks_department_idx on public.hub_tasks (department);
create index if not exists hub_notes_department_idx on public.hub_notes (department);
create index if not exists hub_ai_employees_department_idx on public.hub_ai_employees (department);
create index if not exists hub_chat_messages_created_idx on public.hub_chat_messages (created_at);
create index if not exists hub_chat_messages_employee_idx on public.hub_chat_messages (employee_id);
create index if not exists hub_api_usage_created_idx on public.hub_api_usage (created_at);
create index if not exists hub_api_usage_employee_idx on public.hub_api_usage (employee_id);
create index if not exists hub_insights_created_idx on public.hub_insights (created_at);

-- ============================================================
-- Investors CRM — ported from apps/portal/investors.html into
-- the Acquisitions department. Relational tables, not the old
-- single JSON blob (investor_db, left untouched as a safety net
-- until this is confirmed trustworthy).
-- ============================================================

create table if not exists public.hub_deals (
  id            text primary key,
  name          text not null,
  description   text,
  working_notes text,
  created_at    timestamptz not null default now()
);

create table if not exists public.hub_investors (
  id              uuid primary key default gen_random_uuid(),
  legacy_id       integer,  -- links back to investor_db's numeric id; migration-only, unused by app code
  name            text not null,
  investor_group  text,
  introducer      text,
  emails          text[] not null default '{}',
  roles           text[] not null default '{}',
  has_thank_you   boolean not null default false,
  thank_you_email boolean not null default false,
  thank_you_card  boolean not null default false,
  thank_you_gift  boolean not null default false,
  thank_you_notes text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.hub_deal_investors (
  id              uuid primary key default gen_random_uuid(),
  deal_id         text not null references public.hub_deals(id) on delete cascade,
  investor_id     uuid not null references public.hub_investors(id) on delete cascade,
  stage           text not null check (stage in ('funded','committed','engaged','lead','backup','finder','connector','gatekept','needs_contact','finder_inactive','out')),
  amount          numeric,
  funded          boolean not null default false,
  last_outreach   date,
  last_connection date,
  next_follow_up  date,
  notes           text,
  backup_amount   numeric,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (deal_id, investor_id)
);

create table if not exists public.hub_family_offices (
  id         uuid primary key default gen_random_uuid(),
  office     text not null,
  contacts   text,
  created_at timestamptz not null default now()
);

create table if not exists public.hub_finders_brokers (
  id          uuid primary key default gen_random_uuid(),
  affiliation text,
  contacts    text,
  type        text,
  comments    text,
  created_at  timestamptz not null default now()
);

-- facilities kept as text, not integer — the old UI never does arithmetic
-- on it, just displays it, and not worth risking a cast failure on data
-- this migration hasn't fully inspected.
create table if not exists public.hub_sl_directory (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  subcategory text,
  org         text,
  dba         text,
  city        text,
  state       text,
  facilities  text,
  email       text,
  phone       text
);

alter table public.hub_deals enable row level security;
alter table public.hub_investors enable row level security;
alter table public.hub_deal_investors enable row level security;
alter table public.hub_family_offices enable row level security;
alter table public.hub_finders_brokers enable row level security;
alter table public.hub_sl_directory enable row level security;

drop policy if exists hub_deals_all on public.hub_deals;
create policy hub_deals_all on public.hub_deals
  for all to authenticated
  using ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'))
  with check ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'));

drop policy if exists hub_investors_all on public.hub_investors;
create policy hub_investors_all on public.hub_investors
  for all to authenticated
  using ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'))
  with check ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'));

drop policy if exists hub_deal_investors_all on public.hub_deal_investors;
create policy hub_deal_investors_all on public.hub_deal_investors
  for all to authenticated
  using ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'))
  with check ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'));

drop policy if exists hub_family_offices_all on public.hub_family_offices;
create policy hub_family_offices_all on public.hub_family_offices
  for all to authenticated
  using ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'))
  with check ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'));

drop policy if exists hub_finders_brokers_all on public.hub_finders_brokers;
create policy hub_finders_brokers_all on public.hub_finders_brokers
  for all to authenticated
  using ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'))
  with check ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'));

drop policy if exists hub_sl_directory_all on public.hub_sl_directory;
create policy hub_sl_directory_all on public.hub_sl_directory
  for all to authenticated
  using ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'))
  with check ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'));

-- Live sync between Lyvia's and Jonah's sessions, same reason investor_db had it.
do $$ begin
  alter publication supabase_realtime add table public.hub_deal_investors;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.hub_investors;
exception when duplicate_object then null; end $$;

create index if not exists hub_deal_investors_deal_idx on public.hub_deal_investors (deal_id);
create index if not exists hub_deal_investors_investor_idx on public.hub_deal_investors (investor_id);
create index if not exists hub_deal_investors_next_follow_up_idx on public.hub_deal_investors (next_follow_up);
create index if not exists hub_investors_legacy_id_idx on public.hub_investors (legacy_id);

-- ============================================================
-- One-time migration from the old investor_db JSON blob. Guarded
-- to run only if hub_investors is still empty, so this file stays
-- safe to re-run. Source data (investor_db) is left untouched.
-- ============================================================
do $$
begin
  if not exists (select 1 from public.hub_investors limit 1) then

    insert into public.hub_deals (id, name, description, working_notes)
    select d->>'id', d->>'name', d->>'description', d->>'workingNotes'
    from public.investor_db
    cross join lateral jsonb_array_elements(investor_db.data->'deals') as d
    where investor_db.id = 'main'
    on conflict (id) do nothing;

    insert into public.hub_investors (legacy_id, name, investor_group, introducer, emails, roles,
      has_thank_you, thank_you_email, thank_you_card, thank_you_gift, thank_you_notes)
    select
      (p->>'id')::integer,
      p->>'name',
      p->>'group',
      p->>'introducer',
      coalesce((select array_agg(x) from jsonb_array_elements_text(coalesce(p->'emails','[]'::jsonb)) x), '{}'),
      coalesce((select array_agg(x) from jsonb_array_elements_text(coalesce(p->'roles','[]'::jsonb)) x), '{}'),
      (p->'thankYou') is not null,
      coalesce((p->'thankYou'->>'email')::boolean, false),
      coalesce((p->'thankYou'->>'card')::boolean, false),
      coalesce((p->'thankYou'->>'gift')::boolean, false),
      p->'thankYou'->>'notes'
    from public.investor_db
    cross join lateral jsonb_array_elements(investor_db.data->'people') as p
    where investor_db.id = 'main';

    insert into public.hub_deal_investors (deal_id, investor_id, stage, amount, funded,
      last_outreach, last_connection, next_follow_up, notes, backup_amount)
    select
      d.deal_key,
      hi.id,
      d.deal_val->>'stage',
      nullif(d.deal_val->>'amount','')::numeric,
      coalesce((d.deal_val->>'funded')::boolean, false),
      nullif(d.deal_val->>'lastOutreach','')::date,
      nullif(d.deal_val->>'lastConnection','')::date,
      nullif(d.deal_val->>'nextFollowUp','')::date,
      d.deal_val->>'notes',
      nullif(d.deal_val->>'backupAmount','')::numeric
    from public.investor_db
    cross join lateral jsonb_array_elements(investor_db.data->'people') as p
    cross join lateral jsonb_each(p->'deals') as d(deal_key, deal_val)
    join public.hub_investors hi on hi.legacy_id = (p->>'id')::integer
    where investor_db.id = 'main'
    on conflict (deal_id, investor_id) do nothing;

    insert into public.hub_family_offices (office, contacts)
    select f->>'office', f->>'contacts'
    from public.investor_db
    cross join lateral jsonb_array_elements(investor_db.data->'familyOffices') as f
    where investor_db.id = 'main';

    insert into public.hub_finders_brokers (affiliation, contacts, type, comments)
    select f->>'affiliation', f->>'contacts', f->>'type', f->>'comments'
    from public.investor_db
    cross join lateral jsonb_array_elements(investor_db.data->'findersBrokers') as f
    where investor_db.id = 'main';

    insert into public.hub_sl_directory (name, subcategory, org, dba, city, state, facilities, email, phone)
    select r->>'name', r->>'subcategory', r->>'org', r->>'dba', r->>'city', r->>'state',
           r->>'facilities', r->>'email', r->>'phone'
    from public.investor_db
    cross join lateral jsonb_array_elements(investor_db.data->'slDirectory') as r
    where investor_db.id = 'main';

  end if;
end $$;
