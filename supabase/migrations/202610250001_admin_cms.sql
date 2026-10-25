create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
    user_id uuid primary key references auth.users(id) on delete cascade,
    role text not null default 'admin' check (role = 'admin'),
    created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text not null unique,
    tagline text not null default '',
    short_description text not null default '',
    full_description text not null default '',
    category text not null default 'data-science',
    technologies text[] not null default '{}',
    thumbnail_url text,
    gallery_urls text[] not null default '{}',
    github_url text,
    live_url text,
    project_role text,
    start_date date,
    end_date date,
    is_featured boolean not null default false,
    is_published boolean not null default false,
    display_order integer not null default 0,
    metrics jsonb not null default '[]'::jsonb,
    overview text not null default '',
    challenge text not null default '',
    solution text not null default '',
    process jsonb not null default '[]'::jsonb,
    learnings text[] not null default '{}',
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.certificates (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    issuer text not null default '',
    platform text,
    issued_at date,
    expires_at date,
    credential_id text,
    credential_url text,
    image_url text,
    description text not null default '',
    skills text[] not null default '{}',
    featured boolean not null default false,
    category text,
    level text,
    duration text,
    overview jsonb,
    is_published boolean not null default false,
    display_order integer not null default 0,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.experience (
    id uuid primary key default gen_random_uuid(),
    position text not null,
    organization text not null,
    employment_type text,
    start_date date,
    end_date date,
    is_current boolean not null default false,
    description text not null default '',
    achievements text[] not null default '{}',
    technologies text[] not null default '{}',
    logo_url text,
    display_order integer not null default 0,
    is_published boolean not null default false,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.education (
    id uuid primary key default gen_random_uuid(),
    institution text not null,
    degree text not null,
    field_of_study text,
    start_date date,
    end_date date,
    description text not null default '',
    display_order integer not null default 0,
    is_published boolean not null default false,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.skills (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    category text not null,
    icon text,
    display_order integer not null default 0,
    is_published boolean not null default true,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    unique (name, category)
);

create table if not exists public.profiles (
    id boolean primary key default true check (id),
    name text not null,
    professional_title text not null default '',
    bio text not null default '',
    profile_photo_url text,
    cv_url text,
    email text,
    phone text,
    location text,
    github_url text,
    linkedin_url text,
    availability_status text,
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.site_settings (
    id boolean primary key default true check (id),
    site_name text not null default 'Kevin Adiputra Portfolio',
    logo_url text,
    favicon_url text,
    seo_title text,
    seo_description text,
    og_image_url text,
    footer_text text,
    social_links jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists projects_published_order_idx on public.projects (is_published, display_order);
create index if not exists certificates_published_order_idx on public.certificates (is_published, display_order);
create index if not exists experience_published_order_idx on public.experience (is_published, display_order);
create index if not exists education_published_order_idx on public.education (is_published, display_order);
create index if not exists skills_published_order_idx on public.skills (is_published, display_order);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1 from public.admin_profiles
        where user_id = auth.uid() and role = 'admin'
    );
$$;

grant execute on function public.is_admin() to anon, authenticated;

alter table public.admin_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.certificates enable row level security;
alter table public.experience enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;

create policy "published projects are public" on public.projects for select using (is_published = true or public.is_admin());
create policy "admins manage projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());
create policy "published certificates are public" on public.certificates for select using (is_published = true or public.is_admin());
create policy "admins manage certificates" on public.certificates for all using (public.is_admin()) with check (public.is_admin());
create policy "published experience is public" on public.experience for select using (is_published = true or public.is_admin());
create policy "admins manage experience" on public.experience for all using (public.is_admin()) with check (public.is_admin());
create policy "published education is public" on public.education for select using (is_published = true or public.is_admin());
create policy "admins manage education" on public.education for all using (public.is_admin()) with check (public.is_admin());
create policy "published skills are public" on public.skills for select using (is_published = true or public.is_admin());
create policy "admins manage skills" on public.skills for all using (public.is_admin()) with check (public.is_admin());
create policy "published profile is public" on public.profiles for select using (public.is_admin() or true);
create policy "admins manage profile" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
create policy "site settings are public" on public.site_settings for select using (public.is_admin() or true);
create policy "admins manage site settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "admins can read their admin profile" on public.admin_profiles for select using (public.is_admin());

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

do $$
declare
    table_name text;
begin
    foreach table_name in array array['projects', 'certificates', 'experience', 'education', 'skills', 'profiles', 'site_settings']
    loop
        execute format('drop trigger if exists set_%s_updated_at on public.%I', table_name, table_name);
        execute format('create trigger set_%s_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
    end loop;
end;
$$;
