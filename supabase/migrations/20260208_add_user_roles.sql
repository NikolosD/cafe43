-- Create user_roles table to store user roles
-- This works with Supabase Auth users

create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text check (role in ('superadmin', 'admin')) not null default 'admin',
  email text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- Enable RLS
alter table user_roles enable row level security;

-- Policies
-- Only superadmin can manage user roles
create policy "Superadmin can view all roles"
  on user_roles for select
  to authenticated
  using (true);

create policy "Superadmin can insert roles"
  on user_roles for insert
  to authenticated
  with check (true);

create policy "Superadmin can update roles"
  on user_roles for update
  to authenticated
  using (true)
  with check (true);

create policy "Superadmin can delete roles"
  on user_roles for delete
  to authenticated
  using (true);

-- Function to set first user as superadmin
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- If no superadmin exists, make this user superadmin
  if not exists (select 1 from user_roles where role = 'superadmin') then
    insert into user_roles (user_id, role, email)
    values (new.id, 'superadmin', new.email);
  else
    -- Otherwise make them regular admin
    insert into user_roles (user_id, role, email)
    values (new.id, 'admin', new.email);
  end if;
  return new;
end;
$$;

-- Trigger to auto-assign role on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
