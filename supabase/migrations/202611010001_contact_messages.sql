-- Migration: 202611010001_contact_messages.sql
-- Contact form inbox: public insert-only submissions, admin-only read/update/delete.

create table if not exists public.contact_messages (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    subject text not null default '',
    message text not null,
    status text not null default 'new' check (status in ('new', 'read', 'archived')),
    source_page text,
    user_agent text,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    read_at timestamptz
);

create index if not exists contact_messages_status_created_idx
    on public.contact_messages (status, created_at desc);

create index if not exists contact_messages_created_idx
    on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

-- Anyone (including anonymous visitors) may submit a message, but only as a
-- fresh, unread record with sane length bounds. No read access is granted.
drop policy if exists "anyone can submit contact messages" on public.contact_messages;
create policy "anyone can submit contact messages"
on public.contact_messages for insert
to anon, authenticated
with check (
    status = 'new'
    and read_at is null
    and char_length(btrim(name)) between 2 and 120
    and char_length(btrim(email)) between 5 and 254
    and char_length(btrim(subject)) between 1 and 160
    and char_length(btrim(message)) between 10 and 5000
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);

drop policy if exists "admins read contact messages" on public.contact_messages;
create policy "admins read contact messages"
on public.contact_messages for select
using (public.is_admin());

drop policy if exists "admins update contact messages" on public.contact_messages;
create policy "admins update contact messages"
on public.contact_messages for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins delete contact messages" on public.contact_messages;
create policy "admins delete contact messages"
on public.contact_messages for delete
using (public.is_admin());

drop trigger if exists set_contact_messages_updated_at on public.contact_messages;
create trigger set_contact_messages_updated_at
before update on public.contact_messages
for each row execute function public.set_updated_at();
