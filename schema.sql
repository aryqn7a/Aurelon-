-- Run once in Supabase > SQL Editor.

-- ADMINS: only users listed here can use the admin panel.
create table public.admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.admins enable row level security;
create function public.is_admin() returns boolean language sql security definer stable set search_path = public
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;
create policy "check self" on public.admins for select using (user_id = auth.uid());

-- SETTINGS and CATEGORIES (public read, admin write)
create table public.settings (key text primary key, value text not null default '' check (length(value) <= 2000));
create table public.categories (name text primary key check (length(name) <= 60), sort_order int not null default 0);
alter table public.settings enable row level security;
alter table public.categories enable row level security;
create policy "read" on public.settings for select using (true);
create policy "admin" on public.settings for all using (public.is_admin()) with check (public.is_admin());
create policy "read" on public.categories for select using (true);
create policy "admin" on public.categories for all using (public.is_admin()) with check (public.is_admin());
insert into public.settings(key,value) values ('corp_name','Aurelon Corporation'),('discord_invite',''),('contact_email','');
insert into public.categories(name,sort_order) values ('Building',1),('Modeling',2),('Scripting',3),('VFX',4),('Animation',5),('UI/UX',6),('GFX',7),('Full Game Development',8);

-- PROJECTS (public sees published only)
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(title) between 1 and 120),
  description text not null default '' check (length(description) <= 5000),
  categories text[] not null default '{}',
  cover_url text, gallery text[] not null default '{}', video_url text, roblox_url text check (length(roblox_url) <= 500), links text[] not null default '{}',
  credits text check (length(credits) <= 500), image_credits text check (length(image_credits) <= 500),
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());
alter table public.projects enable row level security;
create policy "public read published" on public.projects for select using (status = 'published');
create policy "admin all" on public.projects for all using (public.is_admin()) with check (public.is_admin());
create function public.touch() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
create trigger projects_touch before update on public.projects for each row execute function public.touch();

-- CLIENT INQUIRIES (public can insert only; only admin can read)
create table public.inquiries (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(), ip_hash text,
  client_name text not null check (length(client_name) between 1 and 120),
  discord text not null check (length(discord) between 2 and 64),
  email text check (length(email) <= 200),
  project_title text not null check (length(project_title) between 1 and 150),
  description text not null check (length(description) between 10 and 5000),
  services text[] not null default '{}' check (cardinality(services) <= 10),
  budget text check (length(budget) <= 50), currency text check (length(currency) <= 10),
  deadline text check (length(deadline) <= 100),
  reference_links text check (length(reference_links) <= 2000), additional text check (length(additional) <= 3000), roblox_game_url text check (length(roblox_game_url) <= 500),
  -- internal fields (admin only)
  status text not null default 'New' check (status in ('New','Reviewing','Quoted','In Progress','Completed','Rejected')),
  admin_notes text, assigned_to text, proposed_budget numeric, agreed_amount numeric,
  commission_pct numeric not null default 30, developer_allocation numeric, expenses numeric not null default 0,
  milestones text, payment_status text not null default 'Unpaid');
alter table public.inquiries enable row level security;
create policy "public submit" on public.inquiries for insert to anon, authenticated
  with check (status = 'New' and admin_notes is null and assigned_to is null and proposed_budget is null and agreed_amount is null
    and developer_allocation is null and milestones is null and payment_status = 'Unpaid' and commission_pct = 30 and expenses = 0);
create policy "admin all" on public.inquiries for all using (public.is_admin()) with check (public.is_admin());

-- DEVELOPER APPLICATIONS (private)
create table public.applications (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(), ip_hash text,
  discord text not null check (length(discord) between 2 and 64),
  skills text not null check (length(skills) between 2 and 1000),
  portfolio_links text not null check (length(portfolio_links) <= 2000),
  experience text not null check (length(experience) <= 3000),
  rates text check (length(rates) <= 300), availability text check (length(availability) <= 300),
  extra_links text check (length(extra_links) <= 2000),
  status text not null default 'Pending' check (status in ('Pending','Approved','Rejected')), admin_notes text);
alter table public.applications enable row level security;
create policy "public submit" on public.applications for insert to anon, authenticated
  with check (status = 'Pending' and admin_notes is null);
create policy "admin all" on public.applications for all using (public.is_admin()) with check (public.is_admin());

-- ABUSE PROTECTION: max 5 submissions per hour per IP (only a hash of the IP is stored)
create function public.throttle() returns trigger language plpgsql security definer set search_path = public as $$
declare ip text; n int;
begin
  ip := coalesce(split_part(coalesce((nullif(current_setting('request.headers', true), '')::json)->>'x-forwarded-for', ''), ',', 1), 'none');
  new.ip_hash := md5(ip || ':aurelon');
  execute format('select count(*) from public.%I where ip_hash = $1 and created_at > now() - interval ''1 hour''', tg_table_name) into n using new.ip_hash;
  if n >= 5 then raise exception 'Too many submissions'; end if;
  return new;
end $$;
create trigger inq_throttle before insert on public.inquiries for each row execute function public.throttle();
create trigger app_throttle before insert on public.applications for each row execute function public.throttle();

-- IMAGE STORAGE: public read, only admin can write, images only, 5 MB max
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio','portfolio',true,5242880,array['image/png','image/jpeg','image/webp']) on conflict (id) do nothing;
create policy "admin upload" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio' and public.is_admin());
create policy "admin update" on storage.objects for update to authenticated using (bucket_id = 'portfolio' and public.is_admin());
create policy "admin delete" on storage.objects for delete to authenticated using (bucket_id = 'portfolio' and public.is_admin());

-- AFTER creating your admin user in Authentication > Users, run (with your email):
-- insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
