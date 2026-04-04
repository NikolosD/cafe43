-- Multiple images per item (carousel like Cedric Grolet)
create table if not exists item_images (
    id uuid default gen_random_uuid() primary key,
    item_id uuid not null references items(id) on delete cascade,
    image_url text not null,
    sort int not null default 0,
    created_at timestamptz default now()
);

create index idx_item_images_item_sort on item_images(item_id, sort);

-- RLS: public read, authenticated write
alter table item_images enable row level security;

create policy "Anyone can view item images"
    on item_images for select
    to anon, authenticated
    using (true);

create policy "Authenticated users can manage item images"
    on item_images for all
    to authenticated
    using (true)
    with check (true);
