-- Restore the categories.icon column that existed in the original project
-- but was missing from the published schema.sql baseline.
alter table categories add column if not exists icon text;
