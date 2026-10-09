create table if not exists public.music_provider_rate_slots (
  provider text primary key,
  next_allowed_at timestamptz not null default clock_timestamp()
);

alter table public.music_provider_rate_slots enable row level security;
revoke all on public.music_provider_rate_slots from public, anon, authenticated;

create or replace function public.claim_music_provider_slot(
  p_provider text,
  p_interval_ms integer,
  p_max_wait_ms integer default 5000
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_next_allowed_at timestamptz;
  v_slot_at timestamptz;
  v_wait_ms integer;
begin
  if p_provider not in ('musicbrainz', 'lastfm', 'discogs', 'deezer', 'audius', 'creditsfm')
    or p_interval_ms < 1
    or p_max_wait_ms < 0 then
    raise exception 'Invalid provider throttle request';
  end if;

  insert into public.music_provider_rate_slots (provider)
  values (p_provider)
  on conflict (provider) do nothing;

  select next_allowed_at into v_next_allowed_at
  from public.music_provider_rate_slots
  where provider = p_provider
  for update;

  v_slot_at := greatest(v_next_allowed_at, clock_timestamp());
  v_wait_ms := greatest(0, ceil(extract(epoch from (v_slot_at - clock_timestamp())) * 1000)::integer);
  if v_wait_ms > p_max_wait_ms then
    return -v_wait_ms;
  end if;

  update public.music_provider_rate_slots
  set next_allowed_at = v_slot_at + (p_interval_ms * interval '1 millisecond')
  where provider = p_provider;

  return v_wait_ms;
end;
$$;

revoke all on function public.claim_music_provider_slot(text, integer, integer) from public, anon, authenticated;
grant execute on function public.claim_music_provider_slot(text, integer, integer) to service_role;