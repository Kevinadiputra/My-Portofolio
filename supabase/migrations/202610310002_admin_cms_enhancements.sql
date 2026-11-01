-- Migration: 202610310002_admin_cms_enhancements.sql
-- Safe, non-destructive schema enhancements, storage policies, and indexes for Portfolio Admin CMS

alter table if exists public.projects
    add column if not exists show_on_homepage boolean not null default true,
    add column if not exists previous_slugs text[] not null default '{}',
    add column if not exists status_label text not null default 'Completed',
    add column if not exists duration text;

alter table if exists public.experience
    add column if not exists location text;

alter table if exists public.education
    add column if not exists location text,
    add column if not exists gpa text;

alter table if exists public.skills
    add column if not exists proficiency text;

alter table if exists public.profiles
    add column if not exists website_url text;

create index if not exists projects_homepage_featured_idx
    on public.projects (is_published, show_on_homepage, is_featured, display_order);

create index if not exists projects_previous_slugs_idx
    on public.projects using gin (previous_slugs);

create index if not exists skills_category_order_idx
    on public.skills (is_published, category, display_order);

-- Configure Supabase Storage bucket for portfolio media (certificates, project thumbnails, logos, CV)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'portfolio-media',
    'portfolio-media',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf']
)
on conflict (id) do update
set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view portfolio media" on storage.objects;
create policy "Public can view portfolio media"
on storage.objects for select
using (bucket_id = 'portfolio-media');

drop policy if exists "Admins can upload portfolio media" on storage.objects;
create policy "Admins can upload portfolio media"
on storage.objects for insert
with check (bucket_id = 'portfolio-media' and public.is_admin());

drop policy if exists "Admins can update portfolio media" on storage.objects;
create policy "Admins can update portfolio media"
on storage.objects for update
using (bucket_id = 'portfolio-media' and public.is_admin())
with check (bucket_id = 'portfolio-media' and public.is_admin());

drop policy if exists "Admins can delete portfolio media" on storage.objects;
create policy "Admins can delete portfolio media"
on storage.objects for delete
using (bucket_id = 'portfolio-media' and public.is_admin());
