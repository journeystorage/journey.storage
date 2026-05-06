-- Journey.Storage — leads table
-- Run this once in Supabase Studio → SQL editor for project tlqfdgqwjbmhqubdckzi.
-- Captures all lead form submissions from the 3 production sites.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  source_app          text not null check (source_app in ('main', 'consulting', 'investors')),
  form_source         text not null,
  name                text not null,
  email               text not null,
  phone               text,
  company             text,
  accredited_investor text check (accredited_investor in ('yes', 'no', 'not_sure')),
  sms_opt_in          boolean not null default false,
  raw_payload         jsonb,
  user_agent          text,
  ip_hash             text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_source_app_idx on public.leads (source_app);
create index if not exists leads_email_idx       on public.leads (lower(email));

-- Lock down via RLS — only service_role (server-side inserts) can write.
-- No anon/authenticated reads. Manage via Supabase Studio for now.
alter table public.leads enable row level security;

-- Optional: a view-only policy for a future admin/team role can be added later.
