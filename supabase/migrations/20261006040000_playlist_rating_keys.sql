alter table public.playlists
  add column if not exists rating_key uuid not null default gen_random_uuid();

create unique index if not exists playlists_rating_key_key
  on public.playlists (rating_key);