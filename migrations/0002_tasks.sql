CREATE TABLE IF NOT EXISTS tasks (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 500),
  completed boolean NOT NULL DEFAULT false,
  status text NOT NULL CHECK (status IN ('todo', 'in_progress', 'review', 'done', 'someday')),
  view text NOT NULL CHECK (view IN ('inbox', 'today', 'upcoming', 'someday')),
  project text NOT NULL CHECK (project IN ('personal', 'work')),
  project_emoji text,
  project_name text,
  section_name text,
  due_date text,
  due_badge text,
  due_badge_variant text CHECK (due_badge_variant IS NULL OR due_badge_variant IN ('today', 'tomorrow', 'upcoming', 'someday', 'overdue')),
  assignee_name text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  notes text NOT NULL DEFAULT '',
  added_ago text,
  category_icon_type text CHECK (category_icon_type IS NULL OR category_icon_type IN ('phone', 'calendar', 'doc', 'palette', 'utensil', 'dog', 'book')),
  show_folder_icon boolean,
  category text,
  is_deleted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (id, user_id)
);

CREATE INDEX IF NOT EXISTS tasks_user_active_idx ON tasks (user_id, is_deleted, view);
CREATE INDEX IF NOT EXISTS tasks_user_project_idx ON tasks (user_id, project);

CREATE TABLE IF NOT EXISTS subtasks (
  id text NOT NULL,
  task_id text NOT NULL,
  user_id uuid NOT NULL,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 500),
  completed boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  PRIMARY KEY (id, task_id),
  FOREIGN KEY (task_id, user_id) REFERENCES tasks(id, user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS subtasks_task_idx ON subtasks (task_id, position);

CREATE TABLE IF NOT EXISTS activities (
  id text NOT NULL,
  task_id text NOT NULL,
  user_id uuid NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actor text NOT NULL,
  description text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  PRIMARY KEY (id, task_id),
  FOREIGN KEY (task_id, user_id) REFERENCES tasks(id, user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS activities_task_idx ON activities (task_id, position);
