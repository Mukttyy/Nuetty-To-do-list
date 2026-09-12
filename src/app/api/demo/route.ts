export const runtime = "nodejs";

export async function GET() {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.DEMO_MODE !== "true"
  ) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const email = process.env.DEMO_EMAIL;
  const password = process.env.DEMO_PASSWORD;
  if (!email || !password) {
    return Response.json({ error: "Demo account is not configured" }, { status: 503 });
  }

  return Response.json(
    { email, password },
    { headers: { "Cache-Control": "no-store" } }
  );
}
