import nextEnv from "@next/env";
import pg from "pg";

nextEnv.loadEnvConfig(process.cwd());

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const targetUrl = new URL(connectionString);
const databaseName = targetUrl.pathname.slice(1);
if (!/^[a-z0-9_]+_test$/.test(databaseName)) {
  throw new Error("Refusing to reset a database whose name does not end in _test");
}

const adminUrl = new URL(targetUrl);
adminUrl.pathname = "/postgres";
const client = new pg.Client({ connectionString: adminUrl.toString() });
const quotedDatabase = `"${databaseName.replaceAll('"', '""')}"`;

try {
  await client.connect();
  await client.query(`DROP DATABASE IF EXISTS ${quotedDatabase} WITH (FORCE)`);
  await client.query(`CREATE DATABASE ${quotedDatabase}`);
  console.log(`Reset test database: ${databaseName}`);
} finally {
  await client.end();
}
