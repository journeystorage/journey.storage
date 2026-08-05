-- Journey.storage — Hub: all-day agent operation. Idempotent.
-- 1) hub_agent_runs: heartbeat ledger — both engines check it so scheduled
--    triggers can never stampede (each run kind self-limits).
create table if not exists public.hub_agent_runs (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null check (kind in ('standup', 'work')),
  summary    jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.hub_agent_runs enable row level security;

drop policy if exists hub_agent_runs_all on public.hub_agent_runs;
create policy hub_agent_runs_all on public.hub_agent_runs
  for all to authenticated
  using ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'))
  with check ((auth.jwt() ->> 'email') in ('lyvia@journey.storage','jonah@journey.storage'));

create index if not exists hub_agent_runs_kind_idx on public.hub_agent_runs (kind, created_at desc);

-- 2) Schedules — pg_cron + pg_net call the live hub. Times are UTC
--    (Central Time is UTC-5 in summer):
--    * standup 12:00 UTC = 7am CT daily
--    * work cycles every 2h, 14:00-24:00 UTC = 9am-7pm CT
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule(jobname) from cron.job where jobname in ('hub-standup', 'hub-work');

select cron.schedule('hub-standup', '0 12 * * *', $$
  select net.http_post(
    url := 'https://hub.journey.storage/api/agents/standup',
    body := '{}'::jsonb,
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
$$);

select cron.schedule('hub-work', '0 14,16,18,20,22 * * *', $$
  select net.http_post(
    url := 'https://hub.journey.storage/api/agents/work',
    body := '{}'::jsonb,
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
$$);

select jobname, schedule from cron.job order by jobname;
