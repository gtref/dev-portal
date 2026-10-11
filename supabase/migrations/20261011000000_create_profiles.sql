create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  github text,
  website text,
  blog text,
  bio text,
  languages jsonb not null default '[]'::jsonb,
  tools jsonb not null default '[]'::jsonb,
  stacks jsonb not null default '[]'::jsonb,
  skill_level text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

grant select on table public.profiles to anon, authenticated;
grant insert, update on table public.profiles to authenticated;

drop policy if exists "Profiles are public" on public.profiles;
create policy "Profiles are public"
  on public.profiles for select
  to anon, authenticated
  using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);