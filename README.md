# Aurelon Corporation website (React + Vite + Supabase)

**Status: written but NOT run or tested.** The build environment had no network access, so `npm install`, the build, and every flow below are untested. Follow the test checklist at the end before going live.

## Architecture
- **Frontend:** React + Vite (static files, lightweight, no UI framework).
- **Backend:** Supabase (free tier is enough): Postgres database, Auth, Storage. There is no custom server. Security is enforced in the database with Row Level Security (RLS), not in the browser.
- **Hosting:** Vercel or Netlify (free tier) for the frontend. GitHub Pages cannot do the SPA routing needed here.
- **Accounts needed:** Supabase, a Git host (GitHub), Vercel or Netlify.

## Setup
1. Create a Supabase project. In **SQL Editor**, paste and run `supabase/schema.sql`.
2. **Authentication > Providers > Email:** turn **off** "Allow new users to sign up" (so only you can have an account). Set JWT expiry (Authentication > Sessions) to 3600 seconds or less.
3. **Authentication > Users > Add user:** create your admin email and a strong password.
4. In SQL Editor run (your email): `insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';`
   Only users in the `admins` table can use the admin panel or write to the database, even if someone else gets an account.
5. Copy `.env.example` to `.env` and fill in the Project URL and the **anon** key (Project Settings > API). Never use the `service_role` key anywhere in this project.
6. `npm install` then `npm run dev`, open http://localhost:5173
7. Admin panel: `/admin`. Set your name, Discord invite and email by editing the `settings` table (Table Editor) until the settings screen is added: keys `corp_name`, `tagline`, `intro`, `discord_invite`, `contact_email`.

## Deploy (Vercel)
Push to GitHub, import the repo in Vercel, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables, deploy. `vercel.json` handles page routing. On Netlify, add `public/_redirects` containing `/* /index.html 200`.

## Security notes
- Public visitors can only read published projects, settings and categories, and insert inquiries/applications. They cannot read inquiries or applications, and cannot write anything else.
- Image uploads: admin only, PNG/JPG/WebP, 5 MB (enforced in the storage bucket and in the form).
- Form abuse: hidden honeypot field, field length limits in the database, and a limit of 5 submissions per hour per IP (only a hash of the IP is stored). For stronger protection add Cloudflare Turnstile.
- Privacy: delete old inquiries and applications you no longer need, and add a privacy page before launch.

## Included in this version
Public: Home, Portfolio (filters, detail modal, gallery, video, credits), Services, Hire Us, Join Our Team, About, Contact.
Admin: login/logout with 30-minute idle sign-out, dashboard counts, full portfolio management (add, edit, upload cover and gallery, categories, video and links, credits, featured, draft/publish, reorder, delete with confirmation).
Database (ready): inquiries and applications with status, notes, assigned developer, commission (default 30%), agreed amount, developer allocation, expenses, milestones and payment status.

## Not built yet (next phase)
Admin screens for inquiries, applications, commission tracking and general settings/logo. The data is saved safely; view and edit it in Supabase Table Editor meanwhile. Deleting a project does not delete its image files.

## Test checklist
1. Admin login works; a non-admin account is rejected; logout works.
2. Add a project as draft: it must NOT appear on /portfolio. Publish it: it appears. Unpublish: it disappears.
3. Upload cover and gallery images; try a PDF and a 10 MB image (both must be refused).
4. Submit an inquiry and an application from a logged-out browser; confirm they appear in Supabase and cannot be read from the public site.
5. Submit 6 inquiries in an hour from one network; the 6th must be refused.
6. Check mobile layout.
