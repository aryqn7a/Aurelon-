-- Only needed if you already ran an earlier schema.sql. Safe to run twice.
alter table public.applications add column if not exists applicant_name text check (length(applicant_name) <= 120);
alter table public.applications add column if not exists additional text check (length(additional) <= 3000);
-- also needed if you skipped upgrade_v1_to_v2.sql:
alter table public.projects add column if not exists roblox_url text check (length(roblox_url) <= 500);
alter table public.inquiries add column if not exists roblox_game_url text check (length(roblox_game_url) <= 500);
update storage.buckets set file_size_limit = 52428800, allowed_mime_types = array['image/png','image/jpeg','image/webp','video/mp4','video/webm'] where id = 'portfolio';
