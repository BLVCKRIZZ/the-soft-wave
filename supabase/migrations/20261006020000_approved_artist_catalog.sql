create table if not exists public.artist_catalog (
  id text primary key,
  name text not null unique check (char_length(name) between 1 and 120),
  group_id text not null default 'g3' check (group_id in ('g1', 'g2', 'g3', 'g4', 'g5')),
  genre text not null,
  about text not null,
  sound text not null,
  moods text[] not null default '{}',
  tracks text[] not null default '{}',
  suggestion_id uuid references public.artist_suggestions(id) on delete set null,
  approved_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.artist_catalog enable row level security;
revoke all on public.artist_catalog from anon;
grant select, insert, update, delete on public.artist_catalog to authenticated;

drop policy if exists "Signed-in users read approved artists" on public.artist_catalog;
create policy "Signed-in users read approved artists"
on public.artist_catalog for select to authenticated
using (true);

drop policy if exists "Admins manage approved artists" on public.artist_catalog;
create policy "Admins manage approved artists"
on public.artist_catalog for all to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) in ('lebea.delmon@gmail.com', 'deleelebea@gmail.com'))
with check (lower(coalesce(auth.jwt() ->> 'email', '')) in ('lebea.delmon@gmail.com', 'deleelebea@gmail.com'));