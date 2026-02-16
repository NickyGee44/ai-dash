create index if not exists chat_rate_limits_user_created_at_idx
  on public.chat_rate_limits (user_id, created_at desc);

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
  if p_window_seconds <= 0 or p_max_requests <= 0 then
    raise exception 'p_window_seconds and p_max_requests must be positive';
  end if;

  -- Serialize checks per user to avoid concurrent overrun under burst traffic.
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));

  select count(*)
  into request_count
  from public.chat_rate_limits
  where user_id = p_user_id
    and created_at >= now() - make_interval(secs => p_window_seconds);

  if request_count >= p_max_requests then
    return false;
  end if;

  insert into public.chat_rate_limits (user_id, ip)
  values (p_user_id, coalesce(nullif(trim(p_ip), ''), 'unknown'));

  return true;
end;
$$;

create or replace function public.prune_chat_rate_limits(
  p_retention interval default interval '1 day'
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  delete from public.chat_rate_limits
  where created_at < now() - p_retention;

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.consume_chat_rate_limit(uuid, text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.consume_chat_rate_limit(uuid, text, integer, integer)
  to service_role;

revoke all on function public.prune_chat_rate_limits(interval)
  from public, anon, authenticated;
grant execute on function public.prune_chat_rate_limits(interval)
  to service_role;
