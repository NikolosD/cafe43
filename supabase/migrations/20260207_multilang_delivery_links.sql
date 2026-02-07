-- Create delivery_links table for multilanguage support
create table if not exists delivery_links (
  id uuid primary key default gen_random_uuid(),
  platform text check (platform in ('glovo', 'wolt')) not null,
  lang text check (lang in ('ru','en','ge')) not null,
  url text not null,
  updated_at timestamp with time zone default now(),
  unique(platform, lang)
);

-- Enable RLS
alter table delivery_links enable row level security;

-- Policies
create policy "Public delivery_links are viewable by everyone"
on delivery_links for select
to anon, authenticated
using (true);

create policy "Authenticated users can modify delivery_links"
on delivery_links for all
to authenticated
using (true)
with check (true);

-- Insert initial data for Cafe 43
insert into delivery_links (platform, lang, url) values
  ('glovo', 'ge', 'https://glovoapp.com/ka/ge/tbilisi/stores/cafe-43-tbi'),
  ('glovo', 'ru', 'https://glovoapp.com/ru/ge/tbilisi/stores/cafe-43-tbi'),
  ('glovo', 'en', 'https://glovoapp.com/en/ge/tbilisi/stores/cafe-43-tbi'),
  ('wolt', 'ge', 'https://wolt.com/ka/geo/tbilisi/venue/cafe-43'),
  ('wolt', 'ru', 'https://wolt.com/ru/geo/tbilisi/venue/cafe-43'),
  ('wolt', 'en', 'https://wolt.com/en/geo/tbilisi/venue/cafe-43')
on conflict (platform, lang) do nothing;
