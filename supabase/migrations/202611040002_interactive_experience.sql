-- Migration: 202611040002_interactive_experience.sql
-- Upgrades experience table to support multi-role organizations, documentation galleries, and external links

-- 1. Add interactive organization columns to public.experience
alter table if exists public.experience
    add column if not exists slug text,
    add column if not exists organization_type text default 'Organization',
    add column if not exists website_url text,
    add column if not exists linkedin_url text,
    add column if not exists roles jsonb not null default '[]'::jsonb,
    add column if not exists gallery jsonb not null default '[]'::jsonb,
    add column if not exists links jsonb not null default '[]'::jsonb;

-- 2. Backfill slug from organization name if null
update public.experience
set slug = lower(regexp_replace(organization, '[^a-zA-Z0-9]+', '-', 'g'))
where slug is null or slug = '';

-- 3. Create index for fast slug lookups
create index if not exists experience_slug_idx
    on public.experience(slug);

-- 4. Create child relational table for roles (normalized support)
create table if not exists public.experience_roles (
    id uuid primary key default gen_random_uuid(),
    experience_id uuid not null references public.experience(id) on delete cascade,
    position text not null,
    start_date date,
    end_date date,
    is_current boolean not null default false,
    description text not null default '',
    responsibilities text[] not null default '{}',
    achievements text[] not null default '{}',
    technologies text[] not null default '{}',
    display_order integer not null default 0,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists experience_roles_exp_idx
    on public.experience_roles(experience_id, display_order asc);

-- 5. Create child relational table for media & documentation gallery
create table if not exists public.experience_media (
    id uuid primary key default gen_random_uuid(),
    experience_id uuid not null references public.experience(id) on delete cascade,
    role_id uuid references public.experience_roles(id) on delete set null,
    media_url text not null,
    media_type text not null default 'image',
    caption text,
    display_order integer not null default 0,
    created_at timestamptz not null default timezone('utc', now())
);

create index if not exists experience_media_exp_idx
    on public.experience_media(experience_id, display_order asc);

-- 6. Create child relational table for external links
create table if not exists public.experience_links (
    id uuid primary key default gen_random_uuid(),
    experience_id uuid not null references public.experience(id) on delete cascade,
    title text not null,
    url text not null,
    display_order integer not null default 0,
    created_at timestamptz not null default timezone('utc', now())
);

create index if not exists experience_links_exp_idx
    on public.experience_links(experience_id, display_order asc);

-- 7. Row Level Security policies
alter table public.experience_roles enable row level security;
alter table public.experience_media enable row level security;
alter table public.experience_links enable row level security;

-- Public can view roles, media, and links if parent experience is published
drop policy if exists "public can view published experience roles" on public.experience_roles;
create policy "public can view published experience roles"
    on public.experience_roles for select
    using (
        exists (
            select 1 from public.experience
            where public.experience.id = public.experience_roles.experience_id
            and (public.experience.is_published = true or public.is_admin())
        )
    );

drop policy if exists "admins manage experience roles" on public.experience_roles;
create policy "admins manage experience roles"
    on public.experience_roles for all
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "public can view published experience media" on public.experience_media;
create policy "public can view published experience media"
    on public.experience_media for select
    using (
        exists (
            select 1 from public.experience
            where public.experience.id = public.experience_media.experience_id
            and (public.experience.is_published = true or public.is_admin())
        )
    );

drop policy if exists "admins manage experience media" on public.experience_media;
create policy "admins manage experience media"
    on public.experience_media for all
    using (public.is_admin())
    with check (public.is_admin());

drop policy if exists "public can view published experience links" on public.experience_links;
create policy "public can view published experience links"
    on public.experience_links for select
    using (
        exists (
            select 1 from public.experience
            where public.experience.id = public.experience_links.experience_id
            and (public.experience.is_published = true or public.is_admin())
        )
    );

drop policy if exists "admins manage experience links" on public.experience_links;
create policy "admins manage experience links"
    on public.experience_links for all
    using (public.is_admin())
    with check (public.is_admin());
