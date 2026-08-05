-- Journey.storage — Hub: Google OAuth tokens (Gmail + Calendar, read-only).
-- Run in the Supabase SQL editor after hub_setup.sql. Idempotent.
-- One row per hub user (lyvia / jonah), same allowlist as everything else.

create table if not exists public.hub_google_tokens (
  user_email    text primary key,
  refresh_token text not null,
  access_token  text,
  expires_at    timestamptz,
  scopes        text[] not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.hub_google_tokens enable row level security;

-- Each user can only touch their own row — tokens are personal credentials,
-- stricter than the shared two-person policy on the other hub tables.
drop policy if exists hub_google_tokens_own on public.hub_google_tokens;
create policy hub_google_tokens_own on public.hub_google_tokens
  for all to authenticated
  using ((auth.jwt() ->> 'email') = user_email)
  with check ((auth.jwt() ->> 'email') = user_email);
