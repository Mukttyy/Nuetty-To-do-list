CREATE TABLE IF NOT EXISTS projects (
  id text NOT NULL,
  user_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 100),
  color text NOT NULL DEFAULT '#71717A',
  icon text,
  archived boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id, user_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS projects_user_name_active_idx
  ON projects (user_id, lower(name)) WHERE archived = false;

CREATE TABLE IF NOT EXISTS sections (
  id text NOT NULL,
  project_id text NOT NULL,
  user_id uuid NOT NULL,
  name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 100),
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id, project_id, user_id),
  FOREIGN KEY (project_id, user_id) REFERENCES projects(id, user_id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS sections_project_name_idx
  ON sections (user_id, project_id, lower(name));

ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS project_id text,
  ADD COLUMN IF NOT EXISTS section_id text,
  ADD COLUMN IF NOT EXISTS schedule text NOT NULL DEFAULT 'anytime',
  ADD COLUMN IF NOT EXISTS due_on date,
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz;

ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_schedule_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_schedule_check
  CHECK (schedule IN ('inbox', 'anytime', 'someday'));

ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_priority_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_priority_check
  CHECK (priority IN ('none', 'low', 'medium', 'high'));

INSERT INTO projects (id, user_id, name, color, position)
SELECT legacy_project, user_id, initcap(legacy_project),
       CASE legacy_project WHEN 'personal' THEN '#71717A' ELSE '#52525B' END,
       CASE legacy_project WHEN 'personal' THEN 0 ELSE 1 END
FROM (
  SELECT DISTINCT project AS legacy_project, user_id
  FROM tasks
  WHERE project IN ('personal', 'work')
) existing
ON CONFLICT (id, user_id) DO NOTHING;

INSERT INTO sections (id, project_id, user_id, name, position)
SELECT 'legacy-' || md5(project || ':' || section_name), project, user_id,
       section_name, row_number() OVER (PARTITION BY user_id, project ORDER BY section_name) - 1
FROM (
  SELECT DISTINCT project, user_id, section_name
  FROM tasks
  WHERE project IN ('personal', 'work') AND section_name IS NOT NULL AND trim(section_name) <> ''
) existing
ON CONFLICT (id, project_id, user_id) DO NOTHING;

UPDATE tasks
SET project_id = CASE WHEN project IN ('personal', 'work') THEN project ELSE NULL END,
    section_id = CASE
      WHEN project IN ('personal', 'work') AND section_name IS NOT NULL AND trim(section_name) <> ''
      THEN 'legacy-' || md5(project || ':' || section_name)
      ELSE NULL
    END,
    schedule = CASE view
      WHEN 'inbox' THEN 'inbox'
      WHEN 'someday' THEN 'someday'
      ELSE 'anytime'
    END,
    due_on = CASE
      WHEN view = 'today' THEN CURRENT_DATE
      WHEN view = 'upcoming' AND lower(coalesce(due_date, '')) = 'tomorrow' THEN CURRENT_DATE + 1
      WHEN view = 'upcoming' AND lower(coalesce(due_date, '')) LIKE '%two week%' THEN CURRENT_DATE + 14
      WHEN view = 'upcoming' THEN CURRENT_DATE + 7
      ELSE NULL
    END,
    status = CASE
      WHEN status = 'someday' THEN 'todo'
      WHEN status = 'review' THEN 'in_progress'
      ELSE status
    END,
    completed_at = CASE WHEN completed THEN coalesce(updated_at, CURRENT_TIMESTAMP) ELSE NULL END,
    deleted_at = CASE WHEN is_deleted THEN coalesce(updated_at, CURRENT_TIMESTAMP) ELSE NULL END
WHERE project_id IS NULL;

CREATE INDEX IF NOT EXISTS tasks_user_due_idx ON tasks (user_id, due_on)
  WHERE is_deleted = false AND completed = false;
CREATE INDEX IF NOT EXISTS tasks_user_custom_project_idx ON tasks (user_id, project_id)
  WHERE is_deleted = false;
