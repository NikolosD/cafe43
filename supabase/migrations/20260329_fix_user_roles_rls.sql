-- Fix overly permissive RLS policies on user_roles
-- Previously ALL authenticated users could insert/update/delete roles (privilege escalation)

-- Drop existing permissive policies
drop policy if exists "Superadmin can view all roles" on user_roles;
drop policy if exists "Superadmin can insert roles" on user_roles;
drop policy if exists "Superadmin can update roles" on user_roles;
drop policy if exists "Superadmin can delete roles" on user_roles;

-- Recreate with proper restrictions

-- All authenticated users can read roles (needed for role checks)
create policy "Authenticated can view roles"
  on user_roles for select
  to authenticated
  using (true);

-- Only superadmins can insert new roles
create policy "Superadmin can insert roles"
  on user_roles for insert
  to authenticated
  with check (
    exists (
      select 1 from user_roles
      where user_id = auth.uid() and role = 'superadmin'
    )
  );

-- Only superadmins can update roles
create policy "Superadmin can update roles"
  on user_roles for update
  to authenticated
  using (
    exists (
      select 1 from user_roles
      where user_id = auth.uid() and role = 'superadmin'
    )
  )
  with check (
    exists (
      select 1 from user_roles
      where user_id = auth.uid() and role = 'superadmin'
    )
  );

-- Only superadmins can delete roles
create policy "Superadmin can delete roles"
  on user_roles for delete
  to authenticated
  using (
    exists (
      select 1 from user_roles
      where user_id = auth.uid() and role = 'superadmin'
    )
  );

-- Allow the trigger function to bypass RLS (it runs as security definer)
-- The handle_new_user() function already has SECURITY DEFINER, so it can insert regardless of policies
