import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function seedDemo() {
  if (process.env.DEMO_MODE !== "true") {
    console.log("Demo account disabled; skipping seed.");
    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("DEMO_MODE must not be enabled in production");
  }

  const name = process.env.DEMO_NAME;
  const email = process.env.DEMO_EMAIL?.trim().toLowerCase();
  const password = process.env.DEMO_PASSWORD;
  if (!name || !email || !password || password.length < 12) {
    throw new Error("Valid DEMO_NAME, DEMO_EMAIL, and DEMO_PASSWORD are required");
  }

  const [{ auth }, { pool }, { INITIAL_TASKS }, repository] = await Promise.all([
    import("../src/server/auth"),
    import("../src/server/db"),
    import("../src/lib/initial-tasks"),
    import("../src/server/task-repository"),
  ]);

  try {
    let userResult = await pool.query<{ id: string }>(
      `SELECT id FROM "user" WHERE email = $1`,
      [email]
    );

    if (userResult.rowCount === 0) {
      await auth.api.signUpEmail({
        body: { name, email, password },
        headers: new Headers({
          Origin: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
        }),
      });
      userResult = await pool.query<{ id: string }>(
        `SELECT id FROM "user" WHERE email = $1`,
        [email]
      );
    }

    const userId = userResult.rows[0]?.id;
    if (!userId) throw new Error("Demo account could not be created");

    const collection = await repository.getTaskCollection(userId);
    if (collection.tasks.length === 0 && collection.projects.length === 0) {
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const projects = [
        {
          id: "personal",
          name: "Personal",
          color: "#71717A",
          archived: false,
          position: 0,
          sections: ["Daily", "Skincare", "Fitness", "Home & Family", "Long-term Goals"].map((name, position) => ({
            id: `personal-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            name,
            position,
          })),
        },
        {
          id: "work",
          name: "Work",
          color: "#52525B",
          archived: false,
          position: 1,
          sections: ["Sprint Q4", "Operations", "Design", "Team", "Executive"].map((name, position) => ({
            id: `work-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            name,
            position,
          })),
        },
      ];
      const demoTasks = INITIAL_TASKS.map((task) => ({
        ...task,
        schedule: task.view === "inbox" ? "inbox" as const : task.view === "someday" ? "someday" as const : "anytime" as const,
        priority: "none" as const,
        projectId: task.project === "none" ? undefined : task.project,
        sectionId: task.section && task.project !== "none"
          ? `${task.project}-${task.section.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
          : undefined,
        dueDate: task.view === "today" ? today : task.view === "upcoming" ? nextWeek.toISOString().slice(0, 10) : undefined,
        status: task.status === "done" ? "done" as const : task.status === "in_progress" || task.status === "review" ? "in_progress" as const : "todo" as const,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        completedAt: task.completed ? now.toISOString() : undefined,
        assigneeName: name,
        activity: task.activity.map((entry) => ({ ...entry, actor: name })),
      }));
      await repository.saveTaskCollection(
        userId,
        demoTasks,
        projects,
        collection.revision
      );
    }

    console.log(`Demo account ready: ${email}`);
  } finally {
    await pool.end();
  }
}

void seedDemo().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
