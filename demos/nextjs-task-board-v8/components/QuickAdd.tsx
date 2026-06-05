"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import type { TaskStatus } from "@/lib/tasks";
import { useTaskStore } from "@/lib/task-store";
import { useAuth } from "@/lib/auth-store";

// Derive 2-letter initials from a display name. "Marcus Peterson" -> "MP".
function initialsOf(name?: string): string {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "??";
}

interface Props {
  // Status the new task lands in — the column's status (board) or the active
  // list filter (list). This is the bit of "important data" we autofill.
  status: TaskStatus;
  variant: "row" | "card";
}

// Quick-add: type a name, hit Enter, done. Everything else is autofilled
// (priority P2, assignee = you, status from context) and the genuinely
// unknowable fields (description, due date) are left blank — fill them in
// later from the detail page or the full "New task" side panel.
export default function QuickAdd({ status, variant }: Props) {
  const { createTask } = useTaskStore();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  async function commit(keepOpen: boolean) {
    const t = title.trim();
    if (!t) {
      setOpen(false);
      return;
    }
    setBusy(true);
    await createTask({
      title: t,
      description: "",
      status,
      priority: "P2",
      assignee: initialsOf(user?.name),
      due: "—",
      labels: [],
    });
    setBusy(false);
    setTitle("");
    if (!keepOpen) setOpen(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      void commit(true); // Asana-style: keep the field open for rapid entry
    } else if (e.key === "Escape") {
      e.preventDefault();
      setTitle("");
      setOpen(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        className={
          variant === "row" ? "cn-quickadd-trigger-row" : "cn-quickadd-trigger-card"
        }
        onClick={() => setOpen(true)}
      >
        <span className="cn-quickadd-plus" aria-hidden="true">
          +
        </span>
        Add task…
      </button>
    );
  }

  return (
    <div className={variant === "row" ? "cn-quickadd-row" : "cn-quickadd-card"}>
      <span className="cn-quickadd-plus" aria-hidden="true">
        +
      </span>
      {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
      <input
        className="cn-quickadd-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => void commit(false)}
        placeholder="Write a task name"
        autoFocus
        disabled={busy}
        aria-label="New task name"
      />
      <span className="cn-quickadd-hint">↵ to add</span>
    </div>
  );
}
