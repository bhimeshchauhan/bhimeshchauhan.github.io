-- Usage counters for the mcp function. Counts only: no content, no IPs (visitors are a salted hash).
-- Run once in the Supabase dashboard SQL editor. Safe to re-run.

create table if not exists public.mcp_usage (
  bucket     text primary key,              -- 'h:<visitor-hash>:<utc-hour>' or 'd:<utc-day>'
  count      int  not null default 0,
  updated_at timestamptz not null default now()
);

-- Locked down: RLS on with NO policies, so only the service role (the edge function) can touch it.
alter table public.mcp_usage enable row level security;
revoke all on public.mcp_usage from anon, authenticated;

create or replace function public.mcp_hit(p_key text, p_hour_limit int, p_day_limit int)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  hb text := 'h:' || p_key || ':' || to_char(now() at time zone 'utc', 'YYYYMMDDHH24');
  db text := 'd:' || to_char(now() at time zone 'utc', 'YYYYMMDD');
  dc int;
  hc int;
begin
  delete from mcp_usage where updated_at < now() - interval '3 days';   -- keep the table tiny

  select count into dc from mcp_usage where bucket = db;
  if coalesce(dc, 0) >= p_day_limit then
    return jsonb_build_object('allowed', false, 'reason', 'daily');
  end if;

  insert into mcp_usage(bucket, count) values (hb, 1)
  on conflict (bucket) do update set count = mcp_usage.count + 1, updated_at = now()
  returning count into hc;
  if hc > p_hour_limit then
    return jsonb_build_object('allowed', false, 'reason', 'hourly');
  end if;

  -- ponytail: check-then-increment is not atomic under heavy concurrency; the daily cap can overshoot by a few. Fine at this scale.
  insert into mcp_usage(bucket, count) values (db, 1)
  on conflict (bucket) do update set count = mcp_usage.count + 1, updated_at = now();
  return jsonb_build_object('allowed', true);
end;
$$;

revoke all on function public.mcp_hit(text, int, int) from public, anon, authenticated;
grant execute on function public.mcp_hit(text, int, int) to service_role;
