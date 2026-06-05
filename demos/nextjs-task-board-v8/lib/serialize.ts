import type { TaskDoc } from "@/lib/models/Task";
import type { Task } from "@/lib/tasks";

// Convert a stored Mongoose Task document into the plain client-facing shape
// the UI already expects (id = the human key, `updated` = a relative string).
// The Mongo _id and userId never reach the client.
export function serializeTask(doc: TaskDoc): Task {
  return {
    id: doc.key,
    boardId: doc.boardId ? String(doc.boardId) : null,
    title: doc.title,
    description: doc.description,
    status: doc.status,
    priority: doc.priority,
    assignee: doc.assignee,
    due: doc.due,
    labels: doc.labels ?? [],
    updated: relativeTime(doc.updatedAt),
  };
}

// Lightweight relative-time formatter so the board reads "just now",
// "5 min ago", "yesterday", etc. — matching v7's `updated` strings.
export function relativeTime(date: Date | string | undefined): string {
  if (!date) return "just now";
  const then = new Date(date).getTime();
  const diffSec = Math.max(0, Math.floor((Date.now() - then) / 1000));

  if (diffSec < 45) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;
  if (diffDay < 14) return "last week";
  return new Date(then).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
