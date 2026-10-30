# Aurelon Corporation website (React + Vite + Supabase)

**Status:** version 3 (full front-end redesign). Tested in a real browser (Chromium) against a mock in-memory backend: 28 checks pass (admin login, project add/publish/feature/reorder, forms, commission calculation, settings, mobile layout, no console errors), and the JavaScript and CSS compile. **Not tested:** the real Supabase connection, the SQL files, the database security rules, and `vite build` itself, because the build environment had no internet. Run the test checklist after setup.

## Architecture
- **Frontend:** React + Vite. Styling is one hand-written CSS design system (no Tailwind). Motion is custom CSS plus a small script (no Framer Motion): intro sequence, word-by-word headline reveals, scroll reveals, parallax, 3D hero cubes, card tilt, page transitions. All of it is switched off for visitors who prefer reduced motion.
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
7. Admin panel: `/admin`. Open **Settings** to set your name, tagline, Discord invite, email, logo and social links.

## Deploy (Vercel)
Push to GitHub, import the repo in Vercel, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables, deploy. `vercel.json` handles page routing. On Netlify, add `public/_redirects` containing `/* /index.html 200`.

## Security notes
- Public visitors can only read published projects, settings and categories, and insert inquiries/applications. They cannot read inquiries or applications, and cannot write anything else.
- Image uploads: admin only, PNG/JPG/WebP, 5 MB (enforced in the storage bucket and in the form).
- Form abuse: hidden honeypot field, field length limits in the database, and a limit of 5 submissions per hour per IP (only a hash of the IP is stored). For stronger protection add Cloudflare Turnstile.
- Privacy: delete old inquiries and applications you no longer need, and add a privacy page before launch.

## Included
Public: Home (animated hero, About, Expertise, Featured projects, Process, Why Aurelon, CTA), Portfolio (large cards, category filters, project view with gallery, video and Roblox link, no developer names), Services (nine services), Start a Project (budget range, deadline, success and error messages), Join Our Team (name, Discord, specialties, experience, portfolio, previous work), About, Contact. Per-page titles and descriptions, robots.txt, Open Graph tags.
Admin (`/admin`): login/logout, 30-minute idle sign-out, dashboard, Portfolio management (images AND video upload, featured, draft/publish, reorder, delete), Inquiries (status, notes, commission tracking), Applications, Settings (name, tagline, intro, Discord, email, socials, logo, favicon, categories).
The portfolio shows only projects you publish. There are no placeholder projects, statistics, testimonials or client logos. Developer names are never shown publicly (the admin "internal credits" field is private).

## Known limits
Deleting a project does not delete its image files. Public changes appear after a page reload.

## Upgrading from version 1
If you already ran an earlier `schema.sql`, run `supabase/upgrade_v2_to_v3.sql` once in the SQL Editor (adds the new application fields, the Roblox link columns, and allows video uploads). New installs just run `schema.sql`.

## Test checklist
1. Admin login works; a non-admin account is rejected; logout works.
2. Add a project as draft: it must NOT appear on /portfolio. Publish it: it appears. Unpublish: it disappears.
3. Upload cover and gallery images; try a PDF and a 10 MB image (both must be refused).
4. Submit an inquiry and an application from a logged-out browser; confirm they appear in the Inquiries and Applications screens, and that a logged-out visitor cannot read them (in Supabase, test with the anon key).
5. Submit 6 inquiries in an hour from one network; the 6th must be refused.
6. Check mobile layout.
