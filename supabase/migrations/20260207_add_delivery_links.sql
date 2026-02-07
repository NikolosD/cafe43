-- Add delivery links to settings table (deprecated - use delivery_links table instead)
-- Keeping for backwards compatibility
alter table settings add column if not exists glovo_url text;
alter table settings add column if not exists wolt_url text;
