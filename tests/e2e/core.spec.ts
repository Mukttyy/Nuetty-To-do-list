import { expect, type Page, test } from "@playwright/test";

async function createAccount(page: Page, name = "Audit User") {
  const email = `audit-${Date.now()}-${Math.random().toString(16).slice(2)}@example.test`;
  await page.goto("/");
  await page.getByRole("button", { name: "Create a test account" }).click();
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("Audit-pass-2026!");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
  return email;
}

function waitForSave(page: Page, content: string) {
  return page.waitForResponse((response) => response.url().endsWith("/api/tasks") && response.request().method() === "PUT" && Boolean(response.request().postData()?.includes(content)));
}

async function createTodayTask(page: Page, title: string) {
  await page.getByRole("button", { name: "New task" }).click();
  const creator = page.getByPlaceholder("Add a task for today...");
  await creator.fill(title);
  const save = waitForSave(page, title);
  await creator.press("Enter");
  expect((await save).ok()).toBe(true);
}

test("reports database health and rejects anonymous task access", async ({ request }) => {
  const health = await request.get("/api/health");
  expect(health.ok()).toBe(true);
  await expect(health.json()).resolves.toMatchObject({ status: "ok", database: "connected" });
  expect((await request.get("/api/tasks")).status()).toBe(401);
});

test("keeps sample content exclusive to the demo account", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Nuetty — Everything To Do List");
  await page.getByRole("button", { name: "Use demo" }).click();
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("button", { name: /Personal/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Work/ })).toBeVisible();

  await page.getByRole("button", { name: "Open profile menu" }).click();
  await page.getByRole("menuitem", { name: "Sign out" }).click();
  await createAccount(page, "Empty Workspace User");
  await expect(page.getByText("Nothing due today")).toBeVisible();
  await expect(page.getByText("Create a project when a task needs a home.")).toBeVisible();
  await expect(page.getByRole("button", { name: /Personal/ })).toHaveCount(0);
});

test("creates and persists a dated task", async ({ page }) => {
  await createAccount(page);
  await createTodayTask(page, "Persistent dated task");
  await expect(page.getByLabel("Due date")).toHaveValue(new Date().toLocaleDateString("en-CA"));
  await expect(page.getByLabel("Project", { exact: true })).toHaveValue("");
  await page.reload();
  await expect(page.getByText("Persistent dated task", { exact: true })).toBeVisible();
});

test("creates custom projects and sections and files tasks contextually", async ({ page }) => {
  await createAccount(page, "Custom Workspace User");
  await page.getByRole("button", { name: "Create project" }).click();
  await page.getByLabel("Project name").fill("Client Work");
  const projectSave = waitForSave(page, "Client Work");
  await page.getByLabel("Project name").press("Enter");
  expect((await projectSave).ok()).toBe(true);
  await page.getByRole("button", { name: /Client Work/ }).click();
  await expect(page.getByRole("heading", { name: "Client Work" })).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept("Delivery"));
  const sectionSave = waitForSave(page, "Delivery");
  await page.getByRole("button", { name: "Project options" }).click();
  await page.getByRole("button", { name: "Add section" }).click();
  expect((await sectionSave).ok()).toBe(true);
  await expect(page.getByText("Delivery", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Add task to Delivery" }).click();
  const creator = page.getByPlaceholder("Add a task to Delivery...");
  await creator.fill("Ship custom workflow");
  const taskSave = waitForSave(page, "Ship custom workflow");
  await creator.press("Enter");
  expect((await taskSave).ok()).toBe(true);
  await expect(page.getByLabel("Project", { exact: true })).toHaveValue(/project-/);
  await expect(page.getByLabel("Section")).not.toHaveValue("");
  await page.getByRole("button", { name: "Close task details" }).click();

  page.once("dialog", (dialog) => dialog.accept("Execution"));
  const renameSectionSave = waitForSave(page, "Execution");
  await page.getByRole("button", { name: "Rename Delivery" }).click();
  await renameSectionSave;
  await expect(page.getByText("Execution", { exact: true })).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept("Delivery Ops"));
  const renameProjectSave = waitForSave(page, "Delivery Ops");
  await page.getByRole("button", { name: "Project options" }).click();
  await page.getByRole("button", { name: "Rename project" }).click();
  await renameProjectSave;
  await expect(page.getByRole("heading", { name: "Delivery Ops" })).toBeVisible();

  const archiveSave = waitForSave(page, '"archived":true');
  await page.getByRole("button", { name: "Project options" }).click();
  await page.getByRole("button", { name: "Archive project" }).click();
  await archiveSave;
  await expect(page.getByText("Archived", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Delivery Ops/ }).click();
  const unarchiveSave = waitForSave(page, '"archived":false');
  await page.getByRole("button", { name: "Project options" }).click();
  await page.getByRole("button", { name: "Unarchive project" }).click();
  await unarchiveSave;
});

test("opens anytime project tasks safely from Quick Find", async ({ page }) => {
  await createAccount(page);
  await page.getByRole("button", { name: "Create project" }).click();
  await page.getByLabel("Project name").fill("Research");
  const projectSave = waitForSave(page, "Research");
  await page.getByLabel("Project name").press("Enter");
  await projectSave;
  await page.getByRole("button", { name: /Research/ }).click();
  await page.getByRole("button", { name: "New task" }).click();
  const creator = page.getByPlaceholder("Add a task to Research...");
  await creator.fill("Investigate search routing");
  const taskSave = waitForSave(page, "Investigate search routing");
  await creator.press("Enter");
  await taskSave;
  await page.getByRole("button", { name: "Close task details" }).click();

  await page.keyboard.press("Control+k");
  await page.getByPlaceholder("Quick find tasks, tags, or projects...").fill("Investigate search");
  await page.getByRole("option", { name: /Investigate search routing/ }).click();
  await expect(page.getByRole("heading", { name: "Research" })).toBeVisible();
  await expect(page.getByLabel("Task title")).toHaveValue("Investigate search routing");
});

test("keeps Trash until the user restores or permanently deletes items", async ({ page }) => {
  await createAccount(page);
  await createTodayTask(page, "Manual trash task");
  await page.getByRole("button", { name: "Close task details" }).click();
  const trashSave = waitForSave(page, "deletedAt");
  await page.getByTitle("Move to trash").click();
  await trashSave;
  await expect(page.getByText("Task moved to Trash.")).toBeVisible();
  await page.getByRole("button", { name: /Trash/ }).click();
  await expect(page.getByText("Manual trash task", { exact: true })).toBeVisible();

  const restoreSave = waitForSave(page, '"isDeleted":false');
  await page.getByRole("button", { name: "Restore" }).click();
  await restoreSave;
  await expect(page.getByText("Trash is empty")).toBeVisible();

  await page.getByRole("button", { name: /Today/ }).click();
  const row = page.locator("[data-task-id]", { hasText: "Manual trash task" });
  await row.hover();
  const secondTrashSave = waitForSave(page, "deletedAt");
  await row.getByTitle("Move to trash").click();
  await secondTrashSave;
  await page.getByRole("button", { name: /Trash/ }).click();
  page.once("dialog", (dialog) => dialog.accept());
  const permanentSave = page.waitForResponse((response) => response.url().endsWith("/api/tasks") && response.request().method() === "PUT" && !response.request().postData()?.includes("Manual trash task"));
  await page.getByRole("button", { name: "Delete permanently" }).click();
  await permanentSave;
  await expect(page.getByText("Trash is empty")).toBeVisible();
});

test("isolates workspaces between authenticated users", async ({ browser }) => {
  const first = await browser.newContext();
  const second = await browser.newContext();
  try {
    const firstPage = await first.newPage();
    const secondPage = await second.newPage();
    await createAccount(firstPage, "First User");
    await createTodayTask(firstPage, "Private first-user task");
    await createAccount(secondPage, "Second User");
    await expect(secondPage.getByText("Private first-user task")).toHaveCount(0);
    await expect(firstPage.getByLabel("Task title")).toHaveValue("Private first-user task");
  } finally {
    await first.close();
    await second.close();
  }
});

test("rejects stale workspace revisions and invalid project references", async ({ page }) => {
  await createAccount(page, "Concurrent User");
  const origin = new URL(page.url()).origin;
  const collectionResponse = await page.context().request.get("/api/tasks");
  const collection = await collectionResponse.json();

  const firstSave = await page.context().request.put("/api/tasks", {
    headers: { Origin: origin },
    data: collection,
  });
  expect(firstSave.ok()).toBe(true);

  const staleSave = await page.context().request.put("/api/tasks", {
    headers: { Origin: origin },
    data: collection,
  });
  expect(staleSave.status()).toBe(409);

  const latest = await (await page.context().request.get("/api/tasks")).json();
  const now = new Date().toISOString();
  const invalidSave = await page.context().request.put("/api/tasks", {
    headers: { Origin: origin },
    data: {
      ...latest,
      tasks: [{
        id: `invalid-${Date.now()}`,
        title: "Invalid relation",
        completed: false,
        status: "todo",
        schedule: "anytime",
        priority: "none",
        projectId: "missing-project",
        assigneeName: "Concurrent User",
        tags: [],
        notes: "",
        subtasks: [],
        activity: [],
        createdAt: now,
        updatedAt: now,
        isDeleted: false,
      }],
    },
  });
  expect(invalidSave.status()).toBe(422);
});

test("keeps the task canvas usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await createAccount(page);
  const main = page.getByRole("main");
  expect((await main.boundingBox())?.width).toBeGreaterThanOrEqual(350);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("complementary", { name: "Primary navigation" }).getByRole("button", { name: /Inbox/ }).click();
  await expect(page.getByRole("heading", { name: "Inbox" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
