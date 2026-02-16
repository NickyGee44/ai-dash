create table if not exists public.chat_rate_limits (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  ip text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_rate_limits_user_ip_created_at_idx
  on public.chat_rate_limits (user_id, ip, created_at desc);

create index if not exists chat_rate_limits_created_at_idx
  on public.chat_rate_limits (created_at);

alter table public.chat_rate_limits enable row level security;

create or replace function public.consume_chat_rate_limit(
  p_user_id uuid,
  p_ip text,
  p_window_seconds integer,
  p_max_requests integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  request_count integer;
begin
  insert into public.chat_rate_limits (user_id, ip)
  values (p_user_id, p_ip);

  select count(*)
  into request_count
  from public.chat_rate_limits
  where user_id = p_user_id
    and ip = p_ip
    and created_at >= now() - make_interval(secs => p_window_seconds);

  delete from public.chat_rate_limits
  where created_at < now() - interval '1 day';

  return request_count <= p_max_requests;
end;
$$;

revoke all on table public.chat_rate_limits from public, anon, authenticated;
revoke all on function public.consume_chat_rate_limit(uuid, text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.consume_chat_rate_limit(uuid, text, integer, integer)
  to service_role;
