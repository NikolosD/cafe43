-- Add new columns to items table
ALTER TABLE items ADD COLUMN IF NOT EXISTS weight text;
ALTER TABLE items ADD COLUMN IF NOT EXISTS is_new boolean DEFAULT false;
ALTER TABLE items ADD COLUMN IF NOT EXISTS is_spicy boolean DEFAULT false;
ALTER TABLE items ADD COLUMN IF NOT EXISTS is_vegan boolean DEFAULT false;
