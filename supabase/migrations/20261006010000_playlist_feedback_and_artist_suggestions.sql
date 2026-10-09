create table if not exists public.playlist_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  playlist_key uuid not null,
  playlist_title text not null,
  mood text not null,
  rating smallint not null check (rating between 1 and 5),
  tracks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, playlist_key)
);

alter table public.playlist_feedback enable row level security;
revoke all on public.playlist_feedback from anon;
grant select, insert, update on public.playlist_feedback to authenticated;

drop policy if exists "Users rate their own playlists; admins review all" on public.playlist_feedback;
create policy "Users rate their own playlists; admins review all"
on public.playlist_feedback for select to authenticated
using (
  auth.uid() = user_id
  or lower(coalesce(auth.jwt() ->> 'email', '')) in ('lebea.delmon@gmail.com', 'deleelebea@gmail.com')
);

drop policy if exists "Users submit their own playlist ratings" on public.playlist_feedback;
create policy "Users submit their own playlist ratings"
on public.playlist_feedback for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users update their own playlist ratings" on public.playlist_feedback;
create policy "Users update their own playlist ratings"
on public.playlist_feedback for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create table if not exists public.artist_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  artist_name text not null check (char_length(artist_name) between 1 and 120),
  context text not null check (char_length(context) between 1 and 1000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

alter table public.artist_suggestions enable row level security;
revoke all on public.artist_suggestions from anon;
grant select, insert, update on public.artist_suggestions to authenticated;

drop policy if exists "Users see own suggestions and admins see all" on public.artist_suggestions;
create policy "Users see own suggestions and admins see all"
on public.artist_suggestions for select to authenticated
using (
  auth.uid() = user_id
  or lower(coalesce(auth.jwt() ->> 'email', '')) in ('lebea.delmon@gmail.com', 'deleelebea@gmail.com')
);

drop policy if exists "Users submit pending artist suggestions" on public.artist_suggestions;
create policy "Users submit pending artist suggestions"
on public.artist_suggestions for insert to authenticated
with check (
  auth.uid() = user_id
  and status = 'pending'
  and reviewed_by is null
  and reviewed_at is null
);

drop policy if exists "Admins review artist suggestions" on public.artist_suggestions;
create policy "Admins review artist suggestions"
on public.artist_suggestions for update to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) in ('lebea.delmon@gmail.com', 'deleelebea@gmail.com'))
with check (lower(coalesce(auth.jwt() ->> 'email', '')) in ('lebea.delmon@gmail.com', 'deleelebea@gmail.com'));