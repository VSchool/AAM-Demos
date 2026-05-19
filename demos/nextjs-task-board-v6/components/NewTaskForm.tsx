"use client";

import { useState } from "react";
import type { TaskPriority, TaskStatus } from "@/lib/tasks";
import { useTaskStore } from "@/lib/task-store";

export default function NewTaskForm() {
  const { createTask } = useTaskStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("P2");
  const [assignee, setAssignee] = useState("MP");
  const [due, setDue] = useState("today");

  function reset() {
    setTitle("");
    setDescription("");
    setStatus("todo");
    setPriority("P2");
    setAssignee("MP");
    setDue("today");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    createTask({
      title: title.trim(),
      description: description.trim() || "(no description)",
      status,
      priority,
      assignee: assignee.trim().slice(0, 2).toUpperCase() || "??",
      due: due.trim() || "—",
      labels: [],
    });
    reset();
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        className="cn-newtask-trigger"
        onClick={() => setOpen(true)}
      >
        + New task
      </button>
    );
  }

  return (
    <form className="cn-newtask-form" onSubmit={submit}>
      <div className="cn-newtask-head">
        <span className="cn-newtask-tag">Create task</span>
        <button
          type="button"
          className="cn-newtask-close"
          onClick={() => {
            reset();
            setOpen(false);
          }}
          aria-label="Cancel"
        >
          ×
        </button>
      </div>
      <div className="cn-newtask-grid">
        <label className="cn-newtask-field cn-newtask-field-wide">
          <span className="cn-newtask-label">Title *</span>
          <input
            className="cn-newtask-input"
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
            placeholder="MP"
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
      <div className="cn-newtask-actions">
        <button type="submit" className="cn-newtask-submit">
          Add task
        </button>
        <button
          type="button"
          className="cn-newtask-cancel"
          onClick={() => {
            reset();
            setOpen(false);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
