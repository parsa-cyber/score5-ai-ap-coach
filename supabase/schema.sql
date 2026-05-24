-- Score5 production schema for Supabase
-- Run this in the Supabase SQL editor.

create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  selected_course text default 'AP Physics 1',
  target_score int default 5,
  exam_date date,
  minutes_per_day int default 35,
  created_at timestamptz default now()
);

create table if not exists public.questions (
  id text primary key,
  course text not null,
  unit text not null,
  topic text not null,
  difficulty text not null,
  type text not null,
  skill text,
  prompt text not null,
  choices jsonb,
  correct_answer text,
  explanation text,
  common_mistake text,
  mistake_type text,
  created_at timestamptz default now()
);

create table if not exists public.attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  question_id text references public.questions(id) on delete set null,
  selected_answer text,
  correct boolean,
  unit text,
  topic text,
  mistake_type text,
  time_spent_seconds int,
  created_at timestamptz default now()
);

create table if not exists public.frq_submissions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  prompt_id text,
  answer_text text,
  score int,
  max_score int,
  feedback text,
  created_at timestamptz default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text default 'free',
  active boolean default false,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.attempts enable row level security;
alter table public.frq_submissions enable row level security;
alter table public.subscriptions enable row level security;

create policy "Profiles are viewable by owner" on public.profiles for select using (auth.uid() = id);
create policy "Profiles are editable by owner" on public.profiles for update using (auth.uid() = id);
create policy "Profiles can be inserted by owner" on public.profiles for insert with check (auth.uid() = id);

create policy "Attempts are viewable by owner" on public.attempts for select using (auth.uid() = user_id);
create policy "Attempts can be inserted by owner" on public.attempts for insert with check (auth.uid() = user_id);

create policy "FRQs are viewable by owner" on public.frq_submissions for select using (auth.uid() = user_id);
create policy "FRQs can be inserted by owner" on public.frq_submissions for insert with check (auth.uid() = user_id);

create policy "Subscriptions are viewable by owner" on public.subscriptions for select using (auth.uid() = user_id);

-- Automatically create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
