import type { PoolClient } from "pg";
import { pool } from "@/server/db";
import type { Project, Task } from "@/types/task";

export interface TaskCollection {
  tasks: Task[];
  projects: Project[];
  revision: number;
}

async function selectProjects(client: PoolClient, userId: string): Promise<Project[]> {
  const result = await client.query<{ project: Project }>(
    `SELECT jsonb_build_object(
      'id', p.id,
      'name', p.name,
      'description', p.description,
      'color', p.color,
      'icon', p.icon,
      'archived', p.archived,
      'position', p.position,
      'sections', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'id', s.id, 'name', s.name, 'position', s.position
        ) ORDER BY s.position, s.id)
        FROM sections s
        WHERE s.project_id = p.id AND s.user_id = p.user_id
      ), '[]'::jsonb)
    ) AS project
    FROM projects p
    WHERE p.user_id = $1
    ORDER BY p.position, p.id`,
    [userId]
  );

  return result.rows.map(({ project }) =>
    Object.fromEntries(Object.entries(project).filter(([, value]) => value !== null)) as unknown as Project
  );
}

export class TaskRevisionConflictError extends Error {
  constructor(public readonly currentRevision: number) {
    super("The task collection changed in another session.");
    this.name = "TaskRevisionConflictError";
  }
}

async function selectTasks(client: PoolClient, userId: string): Promise<Task[]> {
  const result = await client.query<{ task: Task }>(
    `SELECT jsonb_build_object(
      'id', t.id,
      'title', t.title,
      'completed', t.completed,
      'status', t.status,
      'schedule', t.schedule,
      'priority', t.priority,
      'projectId', t.project_id,
      'sectionId', t.section_id,
      'createdAt', t.created_at,
      'updatedAt', t.updated_at,
      'completedAt', t.completed_at,
      'deletedAt', t.deleted_at,
      'view', t.view,
      'project', t.project,
      'projectEmoji', t.project_emoji,
      'projectName', t.project_name,
      'section', t.section_name,
      'dueDate', t.due_on,
      'dueBadge', t.due_badge,
      'dueBadgeVariant', t.due_badge_variant,
      'assigneeName', t.assignee_name,
      'tags', t.tags,
      'notes', t.notes,
      'subtasks', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'id', s.id, 'title', s.title, 'completed', s.completed
        ) ORDER BY s.position, s.id)
        FROM subtasks s WHERE s.task_id = t.id AND s.user_id = t.user_id
      ), '[]'::jsonb),
      'activity', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
          'id', a.id, 'time', a.display_time, 'actor', a.actor,
          'description', a.description
        ) ORDER BY a.position, a.id)
        FROM activities a WHERE a.task_id = t.id AND a.user_id = t.user_id
      ), '[]'::jsonb),
      'addedAgo', t.added_ago,
      'categoryIconType', t.category_icon_type,
      'showFolderIcon', t.show_folder_icon,
      'category', t.category,
      'isDeleted', t.is_deleted
    ) AS task
    FROM tasks t
    WHERE t.user_id = $1
    ORDER BY t.position, t.id`,
    [userId]
  );

  return result.rows.map(({ task }) =>
    Object.fromEntries(Object.entries(task).filter(([, value]) => value !== null)) as unknown as Task
  );
}

export async function getTaskCollection(userId: string): Promise<TaskCollection> {
  await pool.query(
    `INSERT INTO task_collections (user_id) VALUES ($1)
     ON CONFLICT (user_id) DO NOTHING`,
    [userId]
  );

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const state = await client.query<{ revision: string }>(
      "SELECT revision FROM task_collections WHERE user_id = $1 FOR SHARE",
      [userId]
    );
    const tasks = await selectTasks(client, userId);
    const projects = await selectProjects(client, userId);
    await client.query("COMMIT");
    return { tasks, projects, revision: Number(state.rows[0].revision) };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function upsertTask(
  client: PoolClient,
  userId: string,
  task: Task,
  position: number
) {
  const schedule = task.schedule ?? (task.view === "inbox" ? "inbox" : task.view === "someday" ? "someday" : "anytime");
  const legacyView = schedule === "inbox" ? "inbox" : schedule === "someday" ? "someday" : "unscheduled";
  await client.query(
    `INSERT INTO tasks (
      id, user_id, title, completed, status, view, project, project_emoji,
      project_name, section_name, due_date, due_badge, due_badge_variant,
      assignee_name, tags, notes, added_ago, category_icon_type,
      show_folder_icon, category, is_deleted, position, project_id, section_id,
      schedule, due_on, priority, deleted_at, completed_at, created_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
      $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24,
      $25, $26, $27, $28, $29, COALESCE($30, CURRENT_TIMESTAMP)
    )
    ON CONFLICT (id, user_id) DO UPDATE SET
      title = EXCLUDED.title,
      completed = EXCLUDED.completed,
      status = EXCLUDED.status,
      view = EXCLUDED.view,
      project = EXCLUDED.project,
      project_emoji = EXCLUDED.project_emoji,
      project_name = EXCLUDED.project_name,
      section_name = EXCLUDED.section_name,
      due_date = EXCLUDED.due_date,
      due_badge = EXCLUDED.due_badge,
      due_badge_variant = EXCLUDED.due_badge_variant,
      assignee_name = EXCLUDED.assignee_name,
      tags = EXCLUDED.tags,
      notes = EXCLUDED.notes,
      added_ago = EXCLUDED.added_ago,
      category_icon_type = EXCLUDED.category_icon_type,
      show_folder_icon = EXCLUDED.show_folder_icon,
      category = EXCLUDED.category,
      is_deleted = EXCLUDED.is_deleted,
      position = EXCLUDED.position,
      project_id = EXCLUDED.project_id,
      section_id = EXCLUDED.section_id,
      schedule = EXCLUDED.schedule,
      due_on = EXCLUDED.due_on,
      priority = EXCLUDED.priority,
      deleted_at = EXCLUDED.deleted_at,
      completed_at = EXCLUDED.completed_at,
      updated_at = CURRENT_TIMESTAMP`,
    [
      task.id, userId, task.title, task.completed, task.status, legacyView,
      "none", null, null,
      task.section ?? null, task.dueDate ?? null, task.dueBadge ?? null,
      task.dueBadgeVariant ?? null, task.assigneeName, task.tags, task.notes,
      task.addedAgo ?? null, task.categoryIconType ?? null,
      task.showFolderIcon ?? null, task.category ?? null, task.isDeleted ?? false,
      position, task.projectId ?? null, task.sectionId ?? null, schedule,
      task.dueDate ?? null, task.priority ?? "none", task.deletedAt ?? null,
      task.completedAt ?? null, task.createdAt ?? null,
    ]
  );

  for (const [subtaskPosition, subtask] of task.subtasks.entries()) {
    await client.query(
      `INSERT INTO subtasks (id, task_id, user_id, title, completed, position)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id, task_id, user_id) DO UPDATE SET
         title = EXCLUDED.title,
         completed = EXCLUDED.completed,
         position = EXCLUDED.position`,
      [subtask.id, task.id, userId, subtask.title, subtask.completed, subtaskPosition]
    );
  }

  const subtaskIds = task.subtasks.map((subtask) => subtask.id);
  await client.query(
    `DELETE FROM subtasks
     WHERE task_id = $1 AND user_id = $2
       AND NOT (id = ANY($3::text[]))`,
    [task.id, userId, subtaskIds]
  );

  for (const [activityPosition, entry] of task.activity.entries()) {
    await client.query(
      `INSERT INTO activities (
        id, task_id, user_id, display_time, actor, description, position
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id, task_id, user_id) DO UPDATE SET
        display_time = EXCLUDED.display_time,
        actor = EXCLUDED.actor,
        description = EXCLUDED.description,
        position = EXCLUDED.position`,
      [entry.id, task.id, userId, entry.time, entry.actor, entry.description, activityPosition]
    );
  }

  const activityIds = task.activity.map((entry) => entry.id);
  await client.query(
    `DELETE FROM activities
     WHERE task_id = $1 AND user_id = $2
       AND NOT (id = ANY($3::text[]))`,
    [task.id, userId, activityIds]
  );
}

export async function saveTaskCollection(
  userId: string,
  tasks: Task[],
  projects: Project[],
  expectedRevision: number
): Promise<number> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO task_collections (user_id) VALUES ($1)
       ON CONFLICT (user_id) DO NOTHING`,
      [userId]
    );
    const state = await client.query<{ revision: string }>(
      "SELECT revision FROM task_collections WHERE user_id = $1 FOR UPDATE",
      [userId]
    );
    const currentRevision = Number(state.rows[0].revision);
    if (currentRevision !== expectedRevision) {
      throw new TaskRevisionConflictError(currentRevision);
    }

    const projectIds = new Set(projects.map((project) => project.id));
    const sectionIds = new Map(
      projects.flatMap((project) =>
        project.sections.map((section) => [section.id, project.id] as const)
      )
    );
    for (const task of tasks) {
      if (task.projectId && !projectIds.has(task.projectId)) {
        throw new Error(`Task ${task.id} references an unknown project.`);
      }
      if (task.sectionId && sectionIds.get(task.sectionId) !== task.projectId) {
        throw new Error(`Task ${task.id} references an invalid section.`);
      }
    }

    for (const project of projects) {
      await client.query(
        `INSERT INTO projects (id, user_id, name, description, color, icon, archived, position)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id, user_id) DO UPDATE SET
           name = EXCLUDED.name, description = EXCLUDED.description,
           color = EXCLUDED.color, icon = EXCLUDED.icon,
           archived = EXCLUDED.archived, position = EXCLUDED.position,
           updated_at = CURRENT_TIMESTAMP`,
        [project.id, userId, project.name, project.description ?? null, project.color, project.icon ?? null, project.archived, project.position]
      );
      for (const section of project.sections) {
        await client.query(
          `INSERT INTO sections (id, project_id, user_id, name, position)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id, project_id, user_id) DO UPDATE SET
             name = EXCLUDED.name, position = EXCLUDED.position,
             updated_at = CURRENT_TIMESTAMP`,
          [section.id, project.id, userId, section.name, section.position]
        );
      }
    }

    for (const [position, task] of tasks.entries()) {
      await upsertTask(client, userId, task, position);
    }

    const taskIds = tasks.map((task) => task.id);
    await client.query(
      `DELETE FROM tasks
       WHERE user_id = $1 AND NOT (id = ANY($2::text[]))`,
      [userId, taskIds]
    );

    for (const project of projects) {
      const sectionIdsForProject = project.sections.map((section) => section.id);
      await client.query(
        `DELETE FROM sections
         WHERE user_id = $1 AND project_id = $2 AND NOT (id = ANY($3::text[]))`,
        [userId, project.id, sectionIdsForProject]
      );
    }
    await client.query(
      `DELETE FROM projects WHERE user_id = $1 AND NOT (id = ANY($2::text[]))`,
      [userId, projects.map((project) => project.id)]
    );

    const nextState = await client.query<{ revision: string }>(
      `UPDATE task_collections
       SET revision = revision + 1, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1
       RETURNING revision`,
      [userId]
    );
    await client.query("COMMIT");
    return Number(nextState.rows[0].revision);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
