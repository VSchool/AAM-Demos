import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Task } from "@/lib/models/Task";
import { getAuthFromRequest } from "@/lib/auth";
import { validateTaskInput } from "@/lib/validation";
import { serializeTask } from "@/lib/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Next human-facing key (CDN-001, CDN-002…) for THIS user's board.
async function nextKeyForUser(userId: string): Promise<string> {
  const tasks = await Task.find({ userId }).select("key").lean();
  let max = 0;
  for (const t of tasks) {
    const m = /^CDN-(\d+)$/.exec(t.key ?? "");
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return `CDN-${String(max + 1).padStart(3, "0")}`;
}

// GET /api/tasks — the read path. Returns ONLY the logged-in user's tasks.
// This is frozen behavior #4: the board's task list arrives as an API
// response (visible in DevTools → Network), not a server-rendered blob.
export async function GET(req: Request) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const docs = await Task.find({ userId: auth.userId })
      .sort({ createdAt: -1 })
      .exec();
    return NextResponse.json({ tasks: docs.map(serializeTask) });
  } catch (err) {
    console.error("[GET /api/tasks]", err);
    return NextResponse.json({ error: "Could not load tasks." }, { status: 500 });
  }
}

// POST /api/tasks — create a task for the logged-in user.
export async function POST(req: Request) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = validateTaskInput(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const key = await nextKeyForUser(auth.userId);
    const doc = await Task.create({
      ...result.value,
      userId: auth.userId,
      key,
    });
    return NextResponse.json({ task: serializeTask(doc) }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/tasks]", err);
    return NextResponse.json({ error: "Could not create the task." }, { status: 500 });
  }
}
