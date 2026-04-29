-- Photo Booth: events, photos, drive token storage, RLS, helper RPCs

-- ── Tables ──────────────────────────────────────────────────────────────────

create table if not exists public.events (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid references auth.users(id) on delete cascade not null,
  title           text not null default 'Live event',
  display_token   text not null unique default encode(gen_random_bytes(16), 'hex'),
  drive_folder_id text,
  active          boolean not null default true,
  created_at      timestamptz not null default now(),
  ended_at        timestamptz
);

-- Enforce one active event per owner at the DB level
create unique index if not exists events_one_active_per_owner
  on public.events(owner_id) where (active = true);

create table if not exists public.photos (
  id              uuid primary key default gen_random_uuid(),
  event_id        uuid references public.events(id) on delete cascade not null,
  storage_path    text not null,
  guest_name      text,
  drive_file_id   text,
  drive_synced_at timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists photos_event_created
  on public.photos(event_id, created_at desc);

create table if not exists public.user_drive_tokens (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  refresh_token text not null,
  scope         text,
  updated_at    timestamptz not null default now()
);

-- ── RLS ─────────────────────────────────────────────────────────────────────

alter table public.events          enable row level security;
alter table public.photos          enable row level security;
alter table public.user_drive_tokens enable row level security;

-- events: owners manage their own rows
create policy "owner select"  on public.events for select using (auth.uid() = owner_id);
create policy "owner insert"  on public.events for insert with check (auth.uid() = owner_id);
create policy "owner update"  on public.events for update using (auth.uid() = owner_id);
create policy "owner delete"  on public.events for delete using (auth.uid() = owner_id);

-- photos: owner can read/delete; public insert + select via helper functions
create policy "owner photos select" on public.photos for select using (
  exists (select 1 from public.events e where e.id = event_id and e.owner_id = auth.uid())
);
create policy "owner photos delete" on public.photos for delete using (
  exists (select 1 from public.events e where e.id = event_id and e.owner_id = auth.uid())
);

-- user_drive_tokens: users manage only their own row
create policy "own token select" on public.user_drive_tokens for select using (auth.uid() = user_id);
create policy "own token insert" on public.user_drive_tokens for insert with check (auth.uid() = user_id);
create policy "own token update" on public.user_drive_tokens for update using (auth.uid() = user_id);

-- ── Helper RPCs (SECURITY DEFINER — bypass RLS for anon guests) ─────────────

-- Resolve an active event by its public display_token (no owner_id leakage)
create or replace function public.get_event_by_token(p_token text)
returns table (
  id            uuid,
  title         text,
  display_token text,
  active        boolean,
  created_at    timestamptz
)
language sql
security definer
set search_path = public
as $$
  select id, title, display_token, active, created_at
  from public.events
  where display_token = p_token
  limit 1;
$$;

-- Insert a guest photo + mint a signed upload URL (atomically validates the event)
create or replace function public.insert_guest_photo(
  p_token      text,
  p_path       text,
  p_guest_name text default null
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event public.events;
  v_photo_id uuid;
  v_signed_url text;
begin
  -- Validate event
  select * into v_event
  from public.events
  where display_token = p_token and active = true
  limit 1;

  if v_event.id is null then
    raise exception 'Event not found or inactive';
  end if;

  -- Insert photo row
  insert into public.photos (event_id, storage_path, guest_name)
  values (v_event.id, p_path, p_guest_name)
  returning id into v_photo_id;

  -- Return photo id and event id for the client to complete the upload
  return json_build_object(
    'photo_id',  v_photo_id,
    'event_id',  v_event.id,
    'path',      p_path
  );
end;
$$;

-- Fetch recent photos for a display_token (for initial load on display page)
create or replace function public.get_event_photos(p_token text, p_limit int default 30)
returns table (
  id           uuid,
  storage_path text,
  guest_name   text,
  created_at   timestamptz
)
language sql
security definer
set search_path = public
as $$
  select p.id, p.storage_path, p.guest_name, p.created_at
  from public.photos p
  join public.events e on e.id = p.event_id
  where e.display_token = p_token
  order by p.created_at desc
  limit p_limit;
$$;
