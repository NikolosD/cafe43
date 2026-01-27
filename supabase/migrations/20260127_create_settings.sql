-- Create settings table
create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  address text,
  google_maps_url text,
  instagram_url text,
  updated_at timestamp with time zone default now()
);

-- Insert initial data if table is empty
insert into settings (address, google_maps_url, instagram_url)
select 
  '189 Davit Aghmashenebeli Ave, Tbilisi 0112',
  'https://maps.app.goo.gl/heGhasZrTALC5Ffm6',
  'https://www.instagram.com/cafe43pastry/'
where not exists (select 1 from settings);

-- Enable RLS
alter table settings enable row level security;

-- Policies
create policy "Public settings are viewable by everyone"
on settings for select
to anon, authenticated
using (true);

create policy "Authenticated users can modify settings"
on settings for all
to authenticated
using (true)
with check (true);
