import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import nextEnv from "@next/env";
import pg from "pg";

nextEnv.loadEnvConfig(process.cwd());

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const pool = new pg.Pool({ connectionString });
const migrationsDirectory = join(process.cwd(), "migrations");
const client = await pool.connect();

try {
  await client.query("SELECT pg_advisory_lock($1)", [728194]);
  await client.query(`
    CREATE TABLE IF NOT EXISTS app_migrations (
      name text PRIMARY KEY,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const migrationNames = (await readdir(migrationsDirectory))
    .filter((name) => name.endsWith(".sql"))
    .sort();

  for (const name of migrationNames) {
    const sql = await readFile(join(migrationsDirectory, name), "utf8");
    const checksum = createHash("sha256").update(sql).digest("hex");
    const applied = await client.query(
      "SELECT checksum FROM app_migrations WHERE name = $1",
      [name]
    );

    if (applied.rowCount) {
      if (applied.rows[0].checksum !== checksum) {
        throw new Error(`Applied migration was modified: ${name}`);
      }
      continue;
    }

    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query(
        "INSERT INTO app_migrations (name, checksum) VALUES ($1, $2)",
        [name, checksum]
      );
      await client.query("COMMIT");
      console.log(`Applied ${name}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }
} finally {
  await client.query("SELECT pg_advisory_unlock($1)", [728194]).catch(() => undefined);
  client.release();
  await pool.end();
}
