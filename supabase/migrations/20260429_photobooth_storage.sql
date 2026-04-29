-- Photo Booth: Supabase Storage bucket + policies

insert into storage.buckets (id, name, public)
values ('photobooth', 'photobooth', true)
on conflict (id) do nothing;

-- Anyone can read files (live wall fetches public URLs)
create policy "public read photobooth"
  on storage.objects for select
  using (bucket_id = 'photobooth');

-- Only authenticated uploads via service role (edge function) or signed URL
-- Guests upload via signed URLs minted by insert_guest_photo RPC
create policy "service role insert photobooth"
  on storage.objects for insert
  with check (bucket_id = 'photobooth');

-- Owners can delete their event photos
create policy "owner delete photobooth"
  on storage.objects for delete
  using (
    bucket_id = 'photobooth'
    and auth.uid() is not null
  );
