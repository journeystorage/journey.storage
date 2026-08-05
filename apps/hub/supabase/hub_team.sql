-- Journey.storage — Hub: team expansion + context library + initiative engine.
-- Run in the Supabase SQL editor after hub_setup.sql. Idempotent.

-- ── Per-employee document library ──────────────────────────────────
-- Files Lyvia/Jonah drop into an employee's chat. Text content only —
-- injected into that employee's context on every conversation.
create table if not exists public.hub_employee_docs (
  id          uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.hub_ai_employees(id) on delete cascade,
  filename    text not null,
  content     text not null,
  created_at  timestamptz not null default now()
);

-- ── Initiative engine ──────────────────────────────────────────────
-- Employees propose work on their own; nothing executes until Lyvia or
-- Jonah approves. action_payload holds the concrete task/note to create.
create table if not exists public.hub_proposals (
  id             uuid primary key default gen_random_uuid(),
  employee_id    uuid not null references public.hub_ai_employees(id) on delete cascade,
  title          text not null,
  rationale      text,
  action_type    text not null default 'task' check (action_type in ('task', 'note')),
  action_payload jsonb not null default '{}',
  status         text not null default 'pending' check (status in ('pending', 'approved', 'dismissed')),
  created_at     timestamptz not null default now(),
  decided_at     timestamptz
);

alter table public.hub_employee_docs enable row level security;
alter table public.hub_proposals enable row level security;

drop policy if exists hub_employee_docs_all on public.hub_employee_docs;
create policy hub_employee_docs_all on public.hub_employee_docs
  for all to authenticated
  using ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'))
  with check ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'));

drop policy if exists hub_proposals_all on public.hub_proposals;
create policy hub_proposals_all on public.hub_proposals
  for all to authenticated
  using ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'))
  with check ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'));

-- Department-level library — dropped on the department page, absorbed by
-- every AI employee in that department.
create table if not exists public.hub_department_docs (
  id         uuid primary key default gen_random_uuid(),
  department text not null check (department in ('finance', 'marketing', 'investor-relations', 'acquisitions', 'development', 'operations')),
  filename   text not null,
  content    text not null,
  created_at timestamptz not null default now()
);

alter table public.hub_department_docs enable row level security;

drop policy if exists hub_department_docs_all on public.hub_department_docs;
create policy hub_department_docs_all on public.hub_department_docs
  for all to authenticated
  using ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'))
  with check ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'));

create index if not exists hub_department_docs_department_idx on public.hub_department_docs (department);

create index if not exists hub_employee_docs_employee_idx on public.hub_employee_docs (employee_id);
create index if not exists hub_proposals_status_idx on public.hub_proposals (status, created_at);
create index if not exists hub_proposals_employee_idx on public.hub_proposals (employee_id);
