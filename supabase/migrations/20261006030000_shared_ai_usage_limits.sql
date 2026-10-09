create table if not exists public.ai_daily_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_day date not null,
  request_count integer not null default 0 check (request_count >= 0),
  primary key (user_id, usage_day)
);

alter table public.ai_daily_usage enable row level security;
revoke all on public.ai_daily_usage from public, anon, authenticated;

create or replace function public.claim_ai_request(
  p_user_id uuid,
  p_daily_limit integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_user_id is null or p_daily_limit < 1 then
    raise exception 'Invalid AI usage limit request';
  end if;

  insert into public.ai_daily_usage (user_id, usage_day, request_count)
  values (p_user_id, (now() at time zone 'utc')::date, 1)
  on conflict (user_id, usage_day) do update
  set request_count = public.ai_daily_usage.request_count + 1
  where public.ai_daily_usage.request_count < p_daily_limit;

  return found;
end;
$$;

revoke all on function public.claim_ai_request(uuid, integer) from public, anon, authenticated;
grant execute on function public.claim_ai_request(uuid, integer) to service_role;