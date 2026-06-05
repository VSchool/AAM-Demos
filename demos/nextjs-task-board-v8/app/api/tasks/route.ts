import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Task } from "@/lib/models/Task";
import { getAuthFromRequest } from "@/lib/auth";
import { validateTaskInput } from "@/lib/validation";
import { serializeTask } from "@/lib/serialize";
import { ensureUserBoards } from "@/lib/boards-server";

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
    // Backfill any board-less tasks into a default board so every task we
    // return carries a boardId the client can group by.
    await ensureUserBoards(auth.userId);

    // Optional ?board=<id> filter (the board view passes this); without it we
    // return every task the user owns, across all boards.
    const url = new URL(req.url);
    const boardId = url.searchParams.get("board");
    const query: Record<string, unknown> = { userId: auth.userId };
    if (boardId) query.boardId = boardId;

    const docs = await Task.find(query).sort({ createdAt: -1 }).exec();
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
    // Resolve the target board: use the requested boardId if the user owns it,
    // otherwise fall back to their default (first) board.
    const boards = await ensureUserBoards(auth.userId);
    const requested =
      body && typeof body === "object" && "boardId" in body
        ? String((body as { boardId: unknown }).boardId)
        : null;
    const match = boards.find((b) => String(b._id) === requested);
    const boardId = match ? match._id : boards[0]._id;

    const key = await nextKeyForUser(auth.userId);
    const doc = await Task.create({
      ...result.value,
      userId: auth.userId,
      boardId,
      key,
    });
    return NextResponse.json({ task: serializeTask(doc) }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/tasks]", err);
    return NextResponse.json({ error: "Could not create the task." }, { status: 500 });
  }
}
