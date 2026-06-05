"use client";

import { useEffect, useState } from "react";
import type { TaskPriority, TaskStatus } from "@/lib/tasks";
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

// The full "expand from the side" editor. Quick-add (type a name) covers the
// fast path; this side panel is for when you want to set description, status,
// priority, assignee, and due date up front.
export default function NewTaskForm() {
  const { createTask } = useTaskStore();
  const { user } = useAuth();
  const me = initialsOf(user?.name);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("P2");
  const [assignee, setAssignee] = useState(me);
  const [due, setDue] = useState("");

  function reset() {
    setTitle("");
    setDescription("");
    setStatus("todo");
    setPriority("P2");
    setAssignee(me);
    setDue("");
  }

  function close() {
    reset();
    setOpen(false);
  }

  // Lock body scroll while the panel is open, and close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await createTask({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assignee: assignee.trim().slice(0, 2).toUpperCase() || "??",
      due: due.trim() || "—",
      labels: [],
    });
    close();
  }

  return (
    <>
      <button
        type="button"
        className="cn-newtask-trigger"
        onClick={() => {
          setAssignee(me);
          setOpen(true);
        }}
      >
        + New task
      </button>

      {open ? (
        <div className="cn-sidepanel-scrim" onClick={close}>
          <form
            className="cn-sidepanel"
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Create task"
          >
            <div className="cn-sidepanel-head">
              <span className="cn-newtask-tag">Create task</span>
              <button
                type="button"
                className="cn-newtask-close"
                onClick={close}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="cn-sidepanel-body">
              <label className="cn-newtask-field cn-newtask-field-wide">
                <span className="cn-newtask-label">Title *</span>
                <input
                  className="cn-newtask-input cn-sidepanel-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  autoFocus
                  required
                />
              </label>
              <label className="cn-newtask-field cn-newtask-field-wide">
                <span className="cn-newtask-label">Description</span>
                <textarea
                  className="cn-newtask-input cn-newtask-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail. Links. AI-conversation refs."
                />
              </label>
              <div className="cn-newtask-grid">
                <label className="cn-newtask-field">
                  <span className="cn-newtask-label">Status</span>
                  <select
                    className="cn-newtask-input"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">Todo</option>
                    <option value="in_progress">In progress</option>
                    <option value="blocked">Blocked</option>
                    <option value="done">Done</option>
                  </select>
                </label>
                <label className="cn-newtask-field">
                  <span className="cn-newtask-label">Priority</span>
                  <select
                    className="cn-newtask-input"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  >
                    <option value="P0">P0 · Urgent</option>
                    <option value="P1">P1 · High</option>
                    <option value="P2">P2 · Medium</option>
                    <option value="P3">P3 · Low</option>
                  </select>
                </label>
                <label className="cn-newtask-field">
                  <span className="cn-newtask-label">Assignee (initials)</span>
                  <input
                    className="cn-newtask-input"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    maxLength={2}
                    placeholder={me}
                  />
                </label>
                <label className="cn-newtask-field">
                  <span className="cn-newtask-label">Due</span>
                  <input
                    className="cn-newtask-input"
                    value={due}
                    onChange={(e) => setDue(e.target.value)}
                    placeholder="today / May 22 / —"
                  />
                </label>
              </div>
            </div>

            <div className="cn-sidepanel-actions">
              <button type="submit" className="cn-newtask-submit">
                Add task
              </button>
              <button type="button" className="cn-newtask-cancel" onClick={close}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
