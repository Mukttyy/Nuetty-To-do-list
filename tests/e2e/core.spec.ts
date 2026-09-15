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
  await page.locator("form").evaluate((form: HTMLFormElement) => form.requestSubmit());
  await expect(page.getByRole("heading", { name: "Sign in to Nuetty" })).toBeVisible();
  await page.getByLabel("Password", { exact: true }).press("Enter");
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

  await page.getByRole("button", { name: "Create project" }).click();
  await page.getByLabel("Project name").fill("client work");
  await page.getByLabel("Project name").press("Enter");
  await expect(page.getByText("A project with this name already exists.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Cancel project" }).click();

  await page.getByRole("button", { name: /Client Work/ }).click();
  await expect(page.getByRole("heading", { name: "Client Work" })).toBeVisible();

  await page.getByRole("button", { name: "Project options" }).click();
  await page.getByRole("button", { name: "Add section" }).click();
  const sectionDialog = page.getByRole("dialog", { name: "Add section" });
  await sectionDialog.getByLabel("Section name").fill("Delivery");
  const sectionSave = waitForSave(page, "Delivery");
  await sectionDialog.getByRole("button", { name: "Add section" }).click();
  expect((await sectionSave).ok()).toBe(true);
  await expect(page.getByText("Delivery", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Project options" }).click();
  await page.getByRole("button", { name: "Add section" }).click();
  const duplicateSectionDialog = page.getByRole("dialog", { name: "Add section" });
  await duplicateSectionDialog.getByLabel("Section name").fill("delivery");
  await duplicateSectionDialog.getByRole("button", { name: "Add section" }).click();
  await expect(page.getByText("A section with this name already exists.", { exact: true })).toBeVisible();
  await duplicateSectionDialog.getByRole("button", { name: "Cancel" }).click();

  await page.getByRole("button", { name: "Add task to Delivery" }).click();
  const creator = page.getByPlaceholder("Add a task to Delivery...");
  await creator.fill("Ship custom workflow");
  const taskSave = waitForSave(page, "Ship custom workflow");
  await creator.press("Enter");
  expect((await taskSave).ok()).toBe(true);
  await expect(page.getByLabel("Project", { exact: true })).toHaveValue(/project-/);
  await expect(page.getByLabel("Section")).not.toHaveValue("");
  await page.getByRole("button", { name: "Close task details" }).click();

  await page.getByRole("button", { name: "Rename Delivery" }).click();
  const renameDialog = page.getByRole("dialog", { name: "Rename section" });
  await renameDialog.getByLabel("Section name").fill("Execution");
  const renameSectionSave = waitForSave(page, "Execution");
  await renameDialog.getByRole("button", { name: "Save name" }).click();
  await renameSectionSave;
  await expect(page.getByText("Execution", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Delete Execution" }).click();
  const deleteSectionDialog = page.getByRole("dialog", { name: /Delete “Execution”/ });
  await expect(deleteSectionDialog.getByText("Tasks in this section will move to General. No tasks will be deleted.")).toBeVisible();
  const deleteSectionSave = waitForSave(page, "Ship custom workflow");
  await deleteSectionDialog.getByRole("button", { name: "Delete section" }).click();
  await deleteSectionSave;
  await expect(page.getByText("Execution", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Ship custom workflow", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Project options" }).click();
  await page.getByRole("button", { name: "Edit project" }).click();
  await page.getByRole("textbox", { name: "Name", exact: true }).fill("Delivery Ops");
  await page.getByLabel("Description").fill("Client delivery work and handoffs.");
  await page.getByRole("button", { name: "Goal" }).click();
  await page.getByRole("button", { name: "Use color #2563EB" }).click();
  const renameProjectSave = waitForSave(page, "Delivery Ops");
  await page.getByRole("button", { name: "Save changes" }).click();
  await renameProjectSave;
  await expect(page.getByRole("heading", { name: "Delivery Ops" })).toBeVisible();
  await expect(page.getByText("Client delivery work and handoffs.")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Delivery Ops" })).toBeVisible();
  await expect(page.getByText("Client delivery work and handoffs.")).toBeVisible();

  const completeSave = waitForSave(page, '"completed":true');
  await page.getByRole("checkbox", { name: "Complete Ship custom workflow" }).click();
  await completeSave;
  await expect(page.getByText("Ship custom workflow", { exact: true })).toHaveCount(0);
  await page.getByText("Show completed (1)").click();
  await expect(page.getByText("Ship custom workflow", { exact: true })).toBeVisible();

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

test("keeps due dates independent from availability and project deletion", async ({ page }) => {
  await createAccount(page, "Scheduling Rules User");
  await page.getByRole("button", { name: "Create project" }).click();
  await page.getByLabel("Project name").fill("Scheduled Work");
  const projectSave = waitForSave(page, "Scheduled Work");
  await page.getByLabel("Project name").press("Enter");
  await projectSave;

  await page.getByRole("button", { name: /Today/ }).click();
  await createTodayTask(page, "Keep this date");
  const dueDate = await page.getByLabel("Due date").inputValue();

  const availabilitySave = waitForSave(page, '"schedule":"inbox"');
  await page.getByLabel("Availability").selectOption("inbox");
  await availabilitySave;
  await expect(page.getByLabel("Due date")).toHaveValue(dueDate);

  const projectId = await page.getByLabel("Project", { exact: true }).locator("option", { hasText: "Scheduled Work" }).getAttribute("value");
  const moveSave = waitForSave(page, projectId ?? "project-");
  await page.getByLabel("Project", { exact: true }).selectOption({ label: "Scheduled Work" });
  await moveSave;
  await expect(page.getByLabel("Due date")).toHaveValue(dueDate);

  await page.getByRole("button", { name: "Close task details" }).click();
  await page.getByRole("button", { name: /Scheduled Work/ }).click();
  const deleteSave = page.waitForResponse((response) => response.url().endsWith("/api/tasks") && response.request().method() === "PUT");
  await page.getByRole("button", { name: "Project options" }).click();
  await page.getByRole("button", { name: "Delete project" }).click();
  await page.getByRole("dialog", { name: /Delete “Scheduled Work”/ }).getByRole("button", { name: "Delete project" }).click();
  await deleteSave;

  await expect(page.getByRole("heading", { name: "Inbox" })).toBeVisible();
  await page.getByText("Keep this date", { exact: true }).click();
  await expect(page.getByLabel("Due date")).toHaveValue(dueDate);
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
  const permanentSave = page.waitForResponse((response) => response.url().endsWith("/api/tasks") && response.request().method() === "PUT" && !response.request().postData()?.includes("Manual trash task"));
  await page.getByRole("button", { name: "Delete permanently" }).click();
  const permanentDialog = page.getByRole("dialog", { name: /Permanently delete “Manual trash task”/ });
  await permanentDialog.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByText("Manual trash task", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Delete permanently" }).click();
  await page.getByRole("dialog", { name: /Permanently delete “Manual trash task”/ }).getByRole("button", { name: "Delete permanently" }).click();
  await permanentSave;
  await expect(page.getByText("Trash is empty")).toBeVisible();

  await page.getByRole("button", { name: /Today/ }).click();
  await createTodayTask(page, "Empty trash task");
  await page.getByRole("button", { name: "Close task details" }).click();
  const moveToTrashSave = waitForSave(page, "deletedAt");
  await page.getByTitle("Move to trash").click();
  await moveToTrashSave;
  await page.getByRole("button", { name: /Trash/ }).click();
  await page.getByRole("button", { name: "Empty Trash" }).click();
  const emptyDialog = page.getByRole("dialog", { name: "Permanently delete 1 item?" });
  await expect(emptyDialog.getByText("This action cannot be undone. The deleted data cannot be restored from Trash.")).toBeVisible();
  const emptySave = page.waitForResponse((response) => response.url().endsWith("/api/tasks") && response.request().method() === "PUT" && !response.request().postData()?.includes("Empty trash task"));
  await emptyDialog.getByRole("button", { name: "Empty Trash" }).click();
  await emptySave;
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
