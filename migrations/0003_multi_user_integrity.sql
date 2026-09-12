ALTER TABLE subtasks DROP CONSTRAINT IF EXISTS subtasks_task_id_user_id_fkey;
ALTER TABLE activities DROP CONSTRAINT IF EXISTS activities_task_id_user_id_fkey;

ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_pkey;
ALTER TABLE tasks ADD CONSTRAINT tasks_pkey PRIMARY KEY (id, user_id);

ALTER TABLE subtasks DROP CONSTRAINT IF EXISTS subtasks_pkey;
ALTER TABLE subtasks ADD CONSTRAINT subtasks_pkey PRIMARY KEY (id, task_id, user_id);
ALTER TABLE subtasks
  ADD CONSTRAINT subtasks_task_owner_fkey
  FOREIGN KEY (task_id, user_id) REFERENCES tasks(id, user_id) ON DELETE CASCADE;

ALTER TABLE activities DROP CONSTRAINT IF EXISTS activities_pkey;
ALTER TABLE activities ADD CONSTRAINT activities_pkey PRIMARY KEY (id, task_id, user_id);
ALTER TABLE activities
  ADD CONSTRAINT activities_task_owner_fkey
  FOREIGN KEY (task_id, user_id) REFERENCES tasks(id, user_id) ON DELETE CASCADE;

ALTER TABLE activities ADD COLUMN IF NOT EXISTS display_time text NOT NULL DEFAULT '';
