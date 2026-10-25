# Architecture audit and admin CMS boundary

## Current state

- Next.js App Router 16 with React 19 and Tailwind CSS.
- Public content is currently hardcoded in client-side React Context providers under `context/`.
- There is no database client, authentication provider, API route, server action, or middleware in the original repository.
- Vercel is configured as the deployment target through `vercel.json` and the repository remote.
- `public/profile-picture.jpg` is now the supplied `_GDG1787_1b1.jpg` asset; the duplicate source asset remains for traceability and should be removed before the first CMS release.

## Implemented boundary

- Added Supabase SSR/browser clients and session-refresh middleware.
- Added server-side `requireAdmin()` protection for `/admin` and its nested routes.
- Added a real Supabase password login flow; no password is hardcoded in source.
- Added an admin dashboard shell and database-backed snapshot queries.
- Added a reviewable Supabase migration for content tables, indexes, admin membership, and RLS policies.

## Required configuration

Set these values in local `.env.local` and Vercel Project Settings without committing secret values:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Create the owner account in Supabase Auth, insert that user UUID into `public.admin_profiles`, and apply `supabase/migrations/202610250001_admin_cms.sql` before using the dashboard. The admin role is checked against that table on the server; an email allow-list is not used as an authorization shortcut.

## Deliberate limitation

The original repository has no existing persistence model to migrate from. The dashboard routes are therefore protected and production-shaped, but CRUD editors and public content reads should only be wired after the migration is applied to the target Supabase project. This avoids a fake dashboard that writes to local state or exposes draft content.
