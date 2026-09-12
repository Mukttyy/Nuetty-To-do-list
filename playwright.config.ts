import { defineConfig, devices } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const testEnvironment = {
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? "",
  BETTER_AUTH_URL: "http://localhost:3000",
  DEMO_MODE: "true",
  DEMO_NAME: "Demo User",
  DEMO_EMAIL: "demo@nuetty.test",
  DEMO_PASSWORD: "NuettyDemo!2026",
  NEXT_DIST_DIR: ".next-test",
  NODE_ENV: "development",
};

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: "line",
  expect: { timeout: 15_000 },
  use: {
    baseURL: "http://localhost:3107",
    channel: process.env.CI ? undefined : "chrome",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev -- --port 3107",
    url: "http://localhost:3107",
    reuseExistingServer: false,
    env: testEnvironment,
    timeout: 120_000,
  },
});
