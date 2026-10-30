-- Only needed if you already ran the first version of schema.sql. Safe to run twice.
alter table public.projects add column if not exists roblox_url text check (length(roblox_url) <= 500);
alter table public.inquiries add column if not exists roblox_game_url text check (length(roblox_game_url) <= 500);
