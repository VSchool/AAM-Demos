import type { TaskStatus, TaskPriority } from "@/lib/tasks";

// ============================================================
// Server-side validation. NEVER trust the client (D2 lesson). Every write
// route runs its body through these before touching the database, and returns
// a 400 with a safe, field-level message — no stack traces, no DB internals.
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

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

// ── Credentials ──

export function validateSignup(body: unknown): ValidationResult<{
  email: string;
  password: string;
  name: string;
}> {
  const b = (body ?? {}) as Record<string, unknown>;
  const email = asString(b.email).trim().toLowerCase();
  const password = asString(b.password);
  const name = asString(b.name).trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }
  if (password.length > 200) {
    return { ok: false, error: "Password is too long." };
  }
  if (!name || name.length > 80) {
    return { ok: false, error: "Enter a name (up to 80 characters)." };
  }
  return { ok: true, value: { email, password, name } };
}

export function validateLogin(body: unknown): ValidationResult<{
  email: string;
  password: string;
}> {
  const b = (body ?? {}) as Record<string, unknown>;
  const email = asString(b.email).trim().toLowerCase();
  const password = asString(b.password);
  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }
  return { ok: true, value: { email, password } };
}

// ── Tasks ──

export interface TaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  due: string;
  labels: string[];
}

// `partial` = true for PUT (only validate provided fields).
export function validateTaskInput(
  body: unknown,
  { partial = false }: { partial?: boolean } = {},
): ValidationResult<Partial<TaskInput>> {
  const b = (body ?? {}) as Record<string, unknown>;
  const out: Partial<TaskInput> = {};

  if (b.title !== undefined || !partial) {
    const title = asString(b.title).trim();
    if (!title) return { ok: false, error: "Title is required." };
    if (title.length > 200) return { ok: false, error: "Title is too long (max 200)." };
    out.title = title;
  }

  if (b.description !== undefined) {
    const description = asString(b.description);
    if (description.length > 5000) {
      return { ok: false, error: "Description is too long (max 5000)." };
    }
    out.description = description;
  } else if (!partial) {
    out.description = "";
  }

  if (b.status !== undefined || !partial) {
    const status = asString(b.status) as TaskStatus;
    if (!STATUS_VALUES.includes(status)) {
      return { ok: false, error: "Invalid status." };
    }
    out.status = status;
  }

  if (b.priority !== undefined || !partial) {
    const priority = asString(b.priority) as TaskPriority;
    if (!PRIORITY_VALUES.includes(priority)) {
      return { ok: false, error: "Invalid priority." };
    }
    out.priority = priority;
  }

  if (b.assignee !== undefined || !partial) {
    const assignee = asString(b.assignee).trim().slice(0, 3).toUpperCase() || "??";
    out.assignee = assignee;
  }

  if (b.due !== undefined || !partial) {
    const due = asString(b.due).trim().slice(0, 40) || "—";
    out.due = due;
  }

  if (b.labels !== undefined) {
    if (!Array.isArray(b.labels)) {
      return { ok: false, error: "Labels must be a list." };
    }
    const labels = b.labels
      .filter((l): l is string => typeof l === "string")
      .map((l) => l.trim().slice(0, 40))
      .filter(Boolean)
      .slice(0, 12);
    out.labels = labels;
  } else if (!partial) {
    out.labels = [];
  }

  return { ok: true, value: out };
}
