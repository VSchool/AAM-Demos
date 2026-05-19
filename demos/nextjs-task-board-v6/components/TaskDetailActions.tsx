"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Task, TaskPriority, TaskStatus } from "@/lib/tasks";
import { STATUS_LABEL } from "@/lib/tasks";
import { useTaskStore } from "@/lib/task-store";

const FLAG_CLASS: Record<TaskStatus, string> = {
  backlog: "cn-flag cn-flag-open",
  todo: "cn-flag cn-flag-open",
  in_progress: "cn-flag cn-flag-doing",
  blocked: "cn-flag cn-flag-blocked",
  done: "cn-flag cn-flag-done",
  canceled: "cn-flag cn-flag-canceled",
};

export default function TaskDetailActions({ initialTask }: { initialTask: Task }) {
  const router = useRouter();
  const { getTask, updateTask, deleteTask } = useTaskStore();
  const liveTask = getTask(initialTask.id);
  const task = liveTask ?? initialTask;
  const deleted = !liveTask;

  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [due, setDue] = useState(task.due);

  if (deleted) {
    return (
      <section className="cn-detail-actions cn-detail-actions-deleted">
        <div className="cn-banner cn-banner-pink" style={{ margin: 0 }}>
          <div className="cn-banner-meta">deleted in this session</div>
          <p>
            <code>{initialTask.id}</code> was removed from the in-memory store. Refresh
            the page and it&apos;ll come back — because the persistence is fake. W6
            makes deletes real.
          </p>
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <button
            type="button"
            className="cn-newtask-submit"
            onClick={() => router.push("/tasks")}
          >
            Back to /tasks
          </button>
        </div>
      </section>
    );
  }

  if (editing) {
    return (
      <section className="cn-detail-actions">
        <h2 className="cn-detail-h2">Edit task</h2>
        <form
          className="cn-newtask-form"
          style={{ marginTop: 12 }}
          onSubmit={(e) => {
            e.preventDefault();
            updateTask(task.id, {
              title: title.trim(),
              description: description.trim(),
              status,
              priority,
              due: due.trim(),
            });
            setEditing(false);
          }}
        >
          <div className="cn-newtask-grid">
            <label className="cn-newtask-field cn-newtask-field-wide">
              <span className="cn-newtask-label">Title</span>
              <input
                className="cn-newtask-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
            <label className="cn-newtask-field cn-newtask-field-wide">
              <span className="cn-newtask-label">Description</span>
              <textarea
                className="cn-newtask-input cn-newtask-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                <option value="canceled">Canceled</option>
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
              <span className="cn-newtask-label">Due</span>
              <input
                className="cn-newtask-input"
                value={due}
                onChange={(e) => setDue(e.target.value)}
              />
            </label>
          </div>
          <div className="cn-newtask-actions">
            <button type="submit" className="cn-newtask-submit">
              Save changes
            </button>
            <button
              type="button"
              className="cn-newtask-cancel"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="cn-detail-actions">
      <div className="cn-detail-live-state">
        <span className="cn-detail-live-tag">live state</span>
        <span className={FLAG_CLASS[task.status]}>{STATUS_LABEL[task.status]}</span>
        <span className="cn-detail-live-id">{task.id}</span>
      </div>
      <h2 className="cn-detail-h2">Actions</h2>
      <div className="cn-detail-action-buttons">
        <button
          type="button"
          className="cn-newtask-submit"
          onClick={() => {
            setTitle(task.title);
            setDescription(task.description);
            setStatus(task.status);
            setPriority(task.priority);
            setDue(task.due);
            setEditing(true);
          }}
        >
          ✎ Edit task
        </button>
        {!confirmingDelete ? (
          <button
            type="button"
            className="cn-newtask-danger"
            onClick={() => setConfirmingDelete(true)}
          >
            ✕ Delete
          </button>
        ) : (
          <>
            <button
              type="button"
              className="cn-newtask-danger"
              onClick={() => {
                deleteTask(task.id);
                setConfirmingDelete(false);
              }}
            >
              Confirm delete
            </button>
            <button
              type="button"
              className="cn-newtask-cancel"
              onClick={() => setConfirmingDelete(false)}
            >
              Keep
            </button>
          </>
        )}
      </div>
      <p className="cn-aside" style={{ marginTop: 14, fontSize: 13 }}>
        Edits and deletes update local in-memory state via React Context. Real
        persistence (API route + database) is Week 6 territory — refresh this page and
        the changes vanish.
      </p>
    </section>
  );
}
