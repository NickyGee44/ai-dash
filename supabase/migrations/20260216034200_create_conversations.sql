create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.conversations enable row level security;

create policy "Users can read their conversations"
  on public.conversations
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their conversations"
  on public.conversations
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their conversations"
  on public.conversations
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
