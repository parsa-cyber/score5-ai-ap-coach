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
  plan text default 'free',
  subscription_status text default 'none',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

alter table public.profiles add column if not exists plan text default 'free';
alter table public.profiles add column if not exists subscription_status text default 'none';
alter table public.profiles add column if not exists stripe_customer_id text;
alter table public.profiles add column if not exists stripe_subscription_id text;
alter table public.profiles add column if not exists current_period_end timestamptz;

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
  stripe_subscription_id text unique,
  plan text default 'free',
  status text default 'none',
  active boolean default false,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.subscriptions add column if not exists status text default 'none';
alter table public.subscriptions add column if not exists updated_at timestamptz default now();
create unique index if not exists subscriptions_stripe_subscription_id_idx on public.subscriptions (stripe_subscription_id);

alter table public.profiles enable row level security;
alter table public.attempts enable row level security;
alter table public.frq_submissions enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Profiles are editable by owner" on public.profiles;
create policy "Profiles are editable by owner" on public.profiles for update using (auth.uid() = id);
drop policy if exists "Profiles can be inserted by owner" on public.profiles;
create policy "Profiles can be inserted by owner" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "Attempts are viewable by owner" on public.attempts;
create policy "Attempts are viewable by owner" on public.attempts for select using (auth.uid() = user_id);
drop policy if exists "Attempts can be inserted by owner" on public.attempts;
create policy "Attempts can be inserted by owner" on public.attempts for insert with check (auth.uid() = user_id);
drop policy if exists "FRQs are viewable by owner" on public.frq_submissions;
create policy "FRQs are viewable by owner" on public.frq_submissions for select using (auth.uid() = user_id);
drop policy if exists "FRQs can be inserted by owner" on public.frq_submissions;
create policy "FRQs can be inserted by owner" on public.frq_submissions for insert with check (auth.uid() = user_id);
drop policy if exists "Subscriptions are viewable by owner" on public.subscriptions;
create policy "Subscriptions are viewable by owner" on public.subscriptions for select using (auth.uid() = user_id);

-- Automatically create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, plan, subscription_status)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), 'free', 'none')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Optional growth/revenue tables for the enhanced Score5 funnel.
create table if not exists public.usage_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  feature text not null,
  count int default 1,
  used_on date default current_date,
  created_at timestamptz default now()
);

create table if not exists public.referrals (
  id uuid primary key default uuid_generate_v4(),
  referrer_id uuid references auth.users(id) on delete cascade,
  referred_user_id uuid references auth.users(id) on delete set null,
  referral_code text not null,
  reward_days int default 0,
  created_at timestamptz default now()
);

create table if not exists public.reminder_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  course text,
  exam_date date,
  frequency text default 'weekly',
  enabled boolean default false,
  updated_at timestamptz default now()
);

alter table public.usage_events enable row level security;
alter table public.referrals enable row level security;
alter table public.reminder_preferences enable row level security;

drop policy if exists "Usage events are owned by user" on public.usage_events;
create policy "Usage events are owned by user" on public.usage_events for select using (auth.uid() = user_id);
drop policy if exists "Usage events can be inserted by owner" on public.usage_events;
create policy "Usage events can be inserted by owner" on public.usage_events for insert with check (auth.uid() = user_id);

drop policy if exists "Referrals are viewable by referrer" on public.referrals;
create policy "Referrals are viewable by referrer" on public.referrals for select using (auth.uid() = referrer_id);
drop policy if exists "Referrals can be inserted by referrer" on public.referrals;
create policy "Referrals can be inserted by referrer" on public.referrals for insert with check (auth.uid() = referrer_id);

drop policy if exists "Reminder prefs are owned by user" on public.reminder_preferences;
create policy "Reminder prefs are owned by user" on public.reminder_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
