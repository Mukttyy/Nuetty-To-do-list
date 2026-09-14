ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS description text;

ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_description_length_check;
ALTER TABLE projects ADD CONSTRAINT projects_description_length_check
  CHECK (description IS NULL OR char_length(description) <= 280);
