-- Migration: 202611040001_achievements.sql
-- Table, indexes, and RLS policies for Achievements management

create table if not exists public.achievements (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    category text not null default 'Technology Competition',
    event_name text not null default '',
    organizer text not null default '',
    level text not null default 'National' check (level in ('University', 'Regional', 'National', 'International')),
    award text not null default '1st Place',
    date_achieved date,
    short_description text not null default '',
    detailed_description text not null default '',
    certificate_image_url text,
    evidence_image_url text,
    credential_url text,
    project_url text,
    display_order integer not null default 0,
    is_featured boolean not null default false,
    is_published boolean not null default true,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists achievements_published_order_idx
    on public.achievements (is_published, display_order);

create index if not exists achievements_featured_order_idx
    on public.achievements (is_published, is_featured, display_order);

create index if not exists achievements_category_level_idx
    on public.achievements (category, level);

alter table public.achievements enable row level security;

drop policy if exists "published achievements are public" on public.achievements;
create policy "published achievements are public"
on public.achievements for select
using (is_published = true or public.is_admin());

drop policy if exists "admins manage achievements" on public.achievements;
create policy "admins manage achievements"
on public.achievements for all
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists set_achievements_updated_at on public.achievements;
create trigger set_achievements_updated_at
before update on public.achievements
for each row execute function public.set_updated_at();
