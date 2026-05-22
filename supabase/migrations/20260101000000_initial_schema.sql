-- Enable pgcrypto for UUIDs
create extension if not exists "pgcrypto";

-- Categories Table
create table categories (
  id uuid primary key default gen_random_uuid(),
  sort int default 0,
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Category Translations Table
create table category_translations (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  lang text check (lang in ('ru','en','ge')),
  title text not null,
  unique(category_id, lang)
);

-- Items Table
create table items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  price numeric not null default 0,
  image_url text,
  sort int default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Item Translations Table
create table item_translations (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references items(id) on delete cascade,
  lang text check (lang in ('ru','en','ge')),
  title text not null,
  description text,
  unique(item_id, lang)
);

-- Enable RLS
alter table categories enable row level security;
alter table category_translations enable row level security;
alter table items enable row level security;
alter table item_translations enable row level security;

-- Policies for Categories
create policy "Public categories are viewable by everyone"
on categories for select
to anon, authenticated
using (true);

create policy "Authenticated users can modify categories"
on categories for all
to authenticated
using (true)
with check (true);

-- Policies for Category Translations
create policy "Public category translations are viewable by everyone"
on category_translations for select
to anon, authenticated
using (true);

create policy "Authenticated users can modify category translations"
on category_translations for all
to authenticated
using (true)
with check (true);

-- Policies for Items
create policy "Public items are viewable by everyone"
on items for select
to anon, authenticated
using (true);

create policy "Authenticated users can modify items"
on items for all
to authenticated
using (true)
with check (true);

-- Policies for Item Translations
create policy "Public item translations are viewable by everyone"
on item_translations for select
to anon, authenticated
using (true);

create policy "Authenticated users can modify item translations"
on item_translations for all
to authenticated
using (true)
with check (true);

-- Storage Bucket: menu-images
-- Note: You generally create the bucket in the Supabase UI, but here are the policies if you create it via SQL or need to configure it.
-- Ensure bucket 'menu-images' exists and is public.

-- Storage Policies (Mock logic, apply in Storage > Policies)
-- Policy: "Public Access" -> SELECT for anon
-- Policy: "Auth Upload" -> INSERT for authenticated
-- Policy: "Auth Delete" -> DELETE for authenticated
