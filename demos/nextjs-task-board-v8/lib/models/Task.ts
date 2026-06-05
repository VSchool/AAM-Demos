import mongoose, { Schema, model, models } from "mongoose";
import type { TaskStatus, TaskPriority } from "@/lib/tasks";

// ============================================================
// Task model. Every task is USER-SCOPED via `userId`: a user only ever sees
// and edits their own tasks. `key` is the human-facing id (CDN-001, CDN-002…)
// shown in the UI and used in /tasks/[id] URLs; it's unique per user.
// ============================================================

const STATUS_VALUES: TaskStatus[] = [
  "backlog",
  "todo",
  "in_progress",
  "blocked",
  "done",
  "canceled",
];
const PRIORITY_VALUES: TaskPriority[] = ["P0", "P1", "P2", "P3"];

export interface TaskDoc extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  boardId: mongoose.Types.ObjectId;
  key: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  due: string;
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<TaskDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Which board this task belongs to. Optional at the schema level so tasks
    // created before boards existed still load; ensureUserBoards() backfills
    // them into the user's default board.
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      index: true,
    },
    key: { type: String, required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: "", maxlength: 5000 },
    status: { type: String, enum: STATUS_VALUES, default: "todo" },
    priority: { type: String, enum: PRIORITY_VALUES, default: "P2" },
    assignee: { type: String, default: "??", maxlength: 3 },
    due: { type: String, default: "—", maxlength: 40 },
    labels: { type: [String], default: [] },
  },
  { timestamps: true },
);

// A task key is unique within a single user's board (not globally).
TaskSchema.index({ userId: 1, key: 1 }, { unique: true });

export const Task =
  (models.Task as mongoose.Model<TaskDoc>) || model<TaskDoc>("Task", TaskSchema);
