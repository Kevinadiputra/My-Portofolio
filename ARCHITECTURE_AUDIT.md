# Architecture Audit & Admin CMS Documentation

## 1. Overview & Stack

- **Framework**: Next.js 16.4.3 (App Router) with React 19 and Tailwind CSS 3.4.
- **Database & Auth**: Supabase PostgreSQL (`@supabase/ssr`, `@supabase/supabase-js`) with Row Level Security (RLS) and Supabase Storage (`portfolio-media` bucket).
- **Deployment Target**: Vercel (`vercel.json`).

## 2. Security & Authentication Architecture

- **Session Refresh**: `proxy.js` invokes `updateSupabaseSession` (`lib/supabase/middleware.js`) to keep server cookies synchronized.
- **Server-Side Authorization (`requireAdmin` / `getAdminContext`)**:
  - Every `/admin/*` page (except `/admin/login`) calls `await requireAdmin()` on the server before rendering.
  - Every `/api/admin/*` route handler validates the session via `getAdminContext()` on the server.
  - Authorization checks both `supabase.auth.getUser()` and membership in `public.admin_profiles` (`role = 'admin'`).
  - No static passwords, hardcoded credentials, or `service_role` keys are exposed to the client.

## 3. Database Schema & Migrations

1. `supabase/migrations/202610250001_admin_cms.sql`:
   - Core tables: `admin_profiles`, `projects`, `certificates`, `experience`, `education`, `skills`, `profiles`, `site_settings`.
   - RLS enabled on all tables with `public.is_admin()` helper function and `set_updated_at()` triggers.
2. `supabase/migrations/202610310002_admin_cms_enhancements.sql`:
   - Adds `show_on_homepage`, `previous_slugs`, `status_label`, `duration` to `public.projects`.
   - Adds `location` to `public.experience` and `public.education`.
   - Adds `proficiency` to `public.skills` and `website_url` to `public.profiles`.
   - Configures the `portfolio-media` Supabase Storage bucket (5 MB limit, image/PDF MIME types) and storage RLS policies.

## 4. Public Website Data Flow & Cache Revalidation

- `lib/portfolio-data.js` (`getPublicPortfolioData`) queries only `is_published = true` rows from Supabase and maps them to the public portfolio structure, falling back to `lib/portfolio-defaults.js` if the database has not been seeded yet.
- Mutations in `/api/admin/content/[collection]` and `/api/admin/seed` trigger `revalidatePath("/", "layout")`, `revalidatePath("/")`, and `revalidatePath("/projects/[slug]", "page")` so published changes immediately reflect on the live site.

## 5. Required Environment Variables

Set these in `.env.local` and Vercel Project Settings:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```
