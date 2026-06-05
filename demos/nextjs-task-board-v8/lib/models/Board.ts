import mongoose, { Schema, model, models } from "mongoose";
import type { BoardColor } from "@/lib/boards";
import { BOARD_COLOR_LIST } from "@/lib/boards";

// ============================================================
// Board model. A board is USER-SCOPED via `userId` and groups tasks together.
// Every task carries a `boardId` pointing here. Deleting a board deletes its
// tasks (handled in the route), the same way deleting a task is a real delete.
// ============================================================

export interface BoardDoc extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  color: BoardColor;
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema = new Schema<BoardDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    color: {
      type: String,
      enum: BOARD_COLOR_LIST,
      default: "neon",
    },
  },
  { timestamps: true },
);

export const Board =
  (models.Board as mongoose.Model<BoardDoc>) ||
  model<BoardDoc>("Board", BoardSchema);
