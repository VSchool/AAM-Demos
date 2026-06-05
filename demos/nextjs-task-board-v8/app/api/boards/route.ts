import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Board } from "@/lib/models/Board";
import { getAuthFromRequest } from "@/lib/auth";
import { validateBoardInput } from "@/lib/validation";
import {
  ensureUserBoards,
  serializeBoard,
  taskCountsByBoard,
} from "@/lib/boards-server";
import { nextBoardColor } from "@/lib/boards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/boards — the logged-in user's boards, each with a live task count.
// Ensures a default board exists and backfills any board-less tasks first, so
// a user upgrading from the single-board version never loses their tasks.
export async function GET(req: Request) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const boards = await ensureUserBoards(auth.userId);
    const counts = await taskCountsByBoard(auth.userId);
    return NextResponse.json({
      boards: boards.map((b) => serializeBoard(b, counts[String(b._id)] ?? 0)),
    });
  } catch (err) {
    console.error("[GET /api/boards]", err);
    return NextResponse.json({ error: "Could not load boards." }, { status: 500 });
  }
}

// POST /api/boards — create a new board for the logged-in user.
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

  const result = validateBoardInput(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const existingCount = await Board.countDocuments({ userId: auth.userId });
    const doc = await Board.create({
      userId: auth.userId,
      name: result.value.name,
      color: result.value.color ?? nextBoardColor(existingCount),
    });
    return NextResponse.json({ board: serializeBoard(doc, 0) }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/boards]", err);
    return NextResponse.json({ error: "Could not create the board." }, { status: 500 });
  }
}
