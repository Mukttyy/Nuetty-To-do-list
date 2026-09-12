ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_project_check;

ALTER TABLE tasks
  ADD CONSTRAINT tasks_project_check
  CHECK (project IN ('none', 'personal', 'work'));
