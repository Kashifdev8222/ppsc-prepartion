-- PPSC Prep Coach — database setup
-- Paste this whole file into: Supabase Dashboard → SQL Editor → New query → Run

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists day_progress (
  user_id uuid references auth.users on delete cascade,
  global_day int not null,
  completed boolean default false,
  completed_at timestamptz,
  primary key (user_id, global_day)
);

create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  lesson_id text not null,
  score int not null,
  total int not null,
  answers jsonb,
  seconds int,
  created_at timestamptz default now()
);

create table if not exists routine_checks (
  user_id uuid references auth.users on delete cascade,
  date text not null,
  checks jsonb not null default '[]',
  primary key (user_id, date)
);

create table if not exists mistakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  lesson_id text not null,
  q text not null,
  options jsonb,
  given int,
  correct int,
  explain text,
  resolved boolean default false,
  created_at timestamptz default now()
);

create table if not exists notes (
  user_id uuid references auth.users on delete cascade,
  date text not null,
  text text default '',
  primary key (user_id, date)
);

alter table profiles enable row level security;
alter table day_progress enable row level security;
alter table quiz_attempts enable row level security;
alter table routine_checks enable row level security;
alter table mistakes enable row level security;
alter table notes enable row level security;

drop policy if exists "own profiles" on profiles;
drop policy if exists "own day_progress" on day_progress;
drop policy if exists "own quiz_attempts" on quiz_attempts;
drop policy if exists "own routine_checks" on routine_checks;
drop policy if exists "own mistakes" on mistakes;
drop policy if exists "own notes" on notes;

create policy "own profiles" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own day_progress" on day_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own quiz_attempts" on quiz_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own routine_checks" on routine_checks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own mistakes" on mistakes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own notes" on notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
