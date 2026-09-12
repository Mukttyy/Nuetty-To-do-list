import { auth } from "@/server/auth";
import { taskMutationSchema } from "@/lib/task-schema";
import {
  getTaskCollection,
  saveTaskCollection,
  TaskRevisionConflictError,
} from "@/server/task-repository";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 5_000_000;

class PayloadTooLargeError extends Error {}

async function getUserId(request: Request): Promise<string | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user.id ?? null;
}

function acceptsMutation(request: Request): boolean {
  const origin = request.headers.get("origin");
  return origin !== null && origin === new URL(request.url).origin;
}

async function readJsonWithLimit(request: Request): Promise<unknown> {
  if (!request.body) throw new SyntaxError("Missing request body");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new PayloadTooLargeError();
    }
    chunks.push(value);
  }

  const body = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body));
}

export async function GET(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const collection = await getTaskCollection(userId);
  return Response.json(collection, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  if (!acceptsMutation(request)) {
    return Response.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const userId = await getUserId(request);
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await readJsonWithLimit(request);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return Response.json({ error: "Payload too large" }, { status: 413 });
    }
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = taskMutationSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid task payload", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  try {
    const revision = await saveTaskCollection(
      userId,
      parsed.data.tasks,
      parsed.data.projects,
      parsed.data.revision
    );
    return Response.json({ ok: true, revision });
  } catch (error) {
    if (error instanceof TaskRevisionConflictError) {
      return Response.json(
        {
          error: "Task data changed in another session.",
          revision: error.currentRevision,
        },
        { status: 409 }
      );
    }
    throw error;
  }
}
