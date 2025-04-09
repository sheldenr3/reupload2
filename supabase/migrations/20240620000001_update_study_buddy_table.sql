-- Add character_id and show_floating_buddy columns to study_buddy table
ALTER TABLE IF EXISTS study_buddy
ADD COLUMN IF NOT EXISTS character_id TEXT,
ADD COLUMN IF NOT EXISTS show_floating_buddy BOOLEAN DEFAULT TRUE;
