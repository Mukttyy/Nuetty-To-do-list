ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_view_check;

ALTER TABLE tasks
  ADD CONSTRAINT tasks_view_check
  CHECK (view IN ('inbox', 'today', 'upcoming', 'someday', 'unscheduled'));
