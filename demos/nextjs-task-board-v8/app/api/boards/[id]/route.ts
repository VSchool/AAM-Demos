import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Board } from "@/lib/models/Board";
import { Task } from "@/lib/models/Task";
import { getAuthFromRequest } from "@/lib/auth";
import { validateBoardInput } from "@/lib/validation";
import { serializeBoard } from "@/lib/boards-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Both handlers scope by userId so one user can never touch another's board.

// PUT /api/boards/:id — rename or recolor a board.
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = validateBoardInput(body, { partial: true });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const doc = await Board.findOneAndUpdate(
      { _id: id, userId: auth.userId },
      { $set: result.value },
      { new: true, runValidators: true },
    );
    if (!doc) {
      return NextResponse.json({ error: "Board not found." }, { status: 404 });
    }
    const count = await Task.countDocuments({ userId: auth.userId, boardId: id });
    return NextResponse.json({ board: serializeBoard(doc, count) });
  } catch (err) {
    console.error("[PUT /api/boards/:id]", err);
    return NextResponse.json({ error: "Could not update the board." }, { status: 500 });
  }
}

// DELETE /api/boards/:id — remove a board AND its tasks. Refuses to delete the
// user's last board, so there's always somewhere for tasks to live.
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const { id } = await params;

  try {
    await connectToDatabase();
    const total = await Board.countDocuments({ userId: auth.userId });
    if (total <= 1) {
      return NextResponse.json(
        { error: "You can't delete your only board." },
        { status: 400 },
      );
    }
    const doc = await Board.findOneAndDelete({ _id: id, userId: auth.userId });
    if (!doc) {
      return NextResponse.json({ error: "Board not found." }, { status: 404 });
    }
    // The board's tasks are deleted with it — a real, permanent delete.
    const { deletedCount } = await Task.deleteMany({
      userId: auth.userId,
      boardId: id,
    });
    return NextResponse.json({ ok: true, id, deletedTasks: deletedCount ?? 0 });
  } catch (err) {
    console.error("[DELETE /api/boards/:id]", err);
    return NextResponse.json({ error: "Could not delete the board." }, { status: 500 });
  }
}
