import mongoose from "mongoose";
import { Board } from "@/lib/models/Board";
import type { BoardDoc } from "@/lib/models/Board";
import { Task } from "@/lib/models/Task";
import type { Board as ClientBoard } from "@/lib/boards";

// Convert a stored Board document to the client-facing shape. taskCount is
// supplied by the caller (it's a separate aggregation, not stored on the doc).
export function serializeBoard(doc: BoardDoc, taskCount = 0): ClientBoard {
  return {
    id: String(doc._id),
    name: doc.name,
    color: doc.color,
    taskCount,
    createdAt:
      doc.createdAt instanceof Date ? doc.createdAt.toISOString() : undefined,
  };
}

// Guarantee the user has at least one board, and backfill any board-less tasks
// (created before boards existed, or by an older client) into their first
// board. Returns the user's boards, oldest first. Cheap and idempotent — safe
// to call at the top of any read that depends on board membership.
export async function ensureUserBoards(userId: string): Promise<BoardDoc[]> {
  let boards = await Board.find({ userId }).sort({ createdAt: 1 }).exec();

  if (boards.length === 0) {
    const created = await Board.create({
      userId,
      name: "Cadence",
      color: "neon",
    });
    boards = [created];
  }

  // Attach orphan tasks (no boardId) to the user's first/default board.
  await Task.updateMany(
    { userId, $or: [{ boardId: { $exists: false } }, { boardId: null }] },
    { $set: { boardId: boards[0]._id } },
  ).exec();

  return boards;
}

// Per-board task counts for a user's boards, keyed by board id string.
export async function taskCountsByBoard(
  userId: string,
): Promise<Record<string, number>> {
  const rows = await Task.aggregate<{ _id: unknown; count: number }>([
    { $match: { userId: toObjectId(userId) } },
    { $group: { _id: "$boardId", count: { $sum: 1 } } },
  ]);
  const counts: Record<string, number> = {};
  for (const r of rows) {
    if (r._id) counts[String(r._id)] = r.count;
  }
  return counts;
}

function toObjectId(id: string) {
  return new mongoose.Types.ObjectId(id);
}
