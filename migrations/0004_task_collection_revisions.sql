CREATE TABLE IF NOT EXISTS task_collections (
  user_id uuid PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  revision bigint NOT NULL DEFAULT 0 CHECK (revision >= 0),
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO task_collections (user_id)
SELECT DISTINCT user_id FROM tasks
ON CONFLICT (user_id) DO NOTHING;

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS position integer NOT NULL DEFAULT 0;

WITH ranked AS (
  SELECT id, user_id,
    row_number() OVER (PARTITION BY user_id ORDER BY created_at, id) - 1 AS position
  FROM tasks
)
UPDATE tasks
SET position = ranked.position
FROM ranked
WHERE tasks.id = ranked.id AND tasks.user_id = ranked.user_id;

ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_position_nonnegative;
ALTER TABLE tasks
  ADD CONSTRAINT tasks_position_nonnegative CHECK (position >= 0);

CREATE INDEX IF NOT EXISTS tasks_user_position_idx ON tasks (user_id, position, id);
