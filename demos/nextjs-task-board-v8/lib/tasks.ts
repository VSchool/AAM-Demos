// ============================================================
// Cadence task types + display helpers.
//
// In v0–v7 this file also held the static task array (read from the client,
// then from a server component, then via generateStaticParams). In V8 the
// tasks live in MongoDB and arrive over the API, so the static data is gone —
// what remains here is the shared Task type and the deterministic
// color-slot helpers used across the UI.
// ============================================================

export type TaskStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "blocked"
  | "done"
  | "canceled";

export type TaskPriority = "P0" | "P1" | "P2" | "P3";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string; // initials
  due: string; // "today" | "May 19" | "overdue" | "—"
  labels: string[];
  updated: string; // relative time, e.g. "2 min ago"
}

// Convenience for chevron flag labels: maps internal status to display text.
export const STATUS_LABEL: Record<TaskStatus, string> = {
  backlog: "Backlog",
  todo: "Todo",
  in_progress: "In progress",
  blocked: "Blocked",
  done: "Done",
  canceled: "Canceled",
};

// Deterministic color slot for a tag label. Same label string -> same color
// everywhere it renders (task card, detail meta, anywhere else).
export function labelClass(label: string): string {
  let h = 0;
  for (let i = 0; i < label.length; i++) {
    h = (h * 31 + label.charCodeAt(i)) | 0;
  }
  const slot = Math.abs(h) % 6;
  return `cn-task-label cn-task-label-c${slot}`;
}

// Deterministic color slot for an assignee avatar. Same assignee string ->
// same color everywhere it renders. Palette deliberately excludes the violet
// canvas family so avatars always pop on the Details aside.
export function avatarClass(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) | 0;
  }
  const slot = Math.abs(h) % 6;
  return `cn-avatar cn-avatar-c${slot}`;
}
