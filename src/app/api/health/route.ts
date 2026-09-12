import { pool } from "@/server/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    await pool.query("SELECT 1");
    return Response.json({ status: "ok", database: "connected" });
  } catch {
    return Response.json(
      { status: "degraded", database: "unavailable" },
      { status: 503 }
    );
  }
}
