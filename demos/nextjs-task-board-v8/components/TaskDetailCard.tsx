"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { TaskPriority, TaskStatus } from "@/lib/tasks";
import { STATUS_LABEL, labelClass, avatarClass } from "@/lib/tasks";
import { useTaskStore } from "@/lib/task-store";
import TagPicker from "./TagPicker";

const FLAG_CLASS: Record<TaskStatus, string> = {
  backlog: "cn-flag cn-flag-backlog",
  todo: "cn-flag cn-flag-todo",
  in_progress: "cn-flag cn-flag-doing",
  blocked: "cn-flag cn-flag-blocked",
  done: "cn-flag cn-flag-done",
  canceled: "cn-flag cn-flag-canceled",
};

const PRIO_COLOR: Record<TaskPriority, string> = {
  P0: "#FF7BF5",
  P1: "#FFE066",
  P2: "#7DD3FC",
  P3: "rgba(10,10,10,0.30)",
};

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In progress" },
  { value: "blocked", label: "Blocked" },
  { value: "done", label: "Done" },
  { value: "canceled", label: "Canceled" },
];

export default function TaskDetailCard({ taskId }: { taskId: string }) {
  const router = useRouter();
  const { tasks, getTask, updateTask, deleteTask, hydrated } = useTaskStore();
  const task = getTask(taskId);

  const assigneeOptions = useMemo(
    () =>
      Array.from(new Set(tasks.map((t) => t.assignee).filter(Boolean))).sort(),
    [tasks],
  );
  const labelOptions = useMemo(
    () => Array.from(new Set(tasks.flatMap((t) => t.labels))).sort(),
    [tasks],
  );

  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("P2");
  const [due, setDue] = useState("");
  const [assignee, setAssignee] = useState("");
  const [labelsValue, setLabelsValue] = useState<string[]>([]);

  // Still loading the board from the API.
  if (!task && !hydrated) {
    return (
      <section className="cn-detail-card">
        <div className="cn-skel" style={{ width: 110, height: 22, marginBottom: 14 }} />
        <div className="cn-skel" style={{ width: "70%", height: 38 }} />
      </section>
    );
  }

  // Hydrated but no such task — not found, or it was deleted. In V8 deletes
  // are real: the row is gone from the database, for good.
  if (!task) {
    return (
      <section className="cn-detail-card cn-detail-card-deleted">
        <div className="cn-banner cn-banner-pink" style={{ margin: 0 }}>
          <div className="cn-banner-meta">not found</div>
          <p>
            <code>{taskId}</code> isn&apos;t on your board. If you just deleted it,
            that delete was real — the record is gone from the database, not just
            this screen. Refreshing won&apos;t bring it back.
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

  const startEdit = () => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority);
    setDue(task.due);
    setAssignee(task.assignee);
    setLabelsValue(task.labels);
    setConfirmingDelete(false);
    setEditing(true);
  };

  const save = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || saving) return;
    setSaving(true);
    await updateTask(task.id, {
      title: trimmedTitle,
      description: description.trim(),
      status,
      priority,
      due: due.trim(),
      assignee: assignee.trim() || task.assignee,
      labels: labelsValue,
    });
    setSaving(false);
    setEditing(false);
  };

  const confirmDelete = async () => {
    if (saving) return;
    setSaving(true);
    await deleteTask(task.id);
    // task disappears from the store; this component re-renders into the
    // not-found state above.
    setConfirmingDelete(false);
    setSaving(false);
  };

  return (
    <section
      className={`cn-detail-card${editing ? " cn-detail-card-editing" : ""}`}
      aria-label={`Task ${task.id}`}
    >
      <div className="cn-detail-card-head">
        {editing ? (
          <span className="cn-detail-card-editing-tag">Editing</span>
        ) : (
          <span className={FLAG_CLASS[task.status]}>
            {STATUS_LABEL[task.status]}
          </span>
        )}

        <div className="cn-detail-card-actions">
          {editing ? (
            <>
              <button
                type="button"
                className="cn-newtask-submit cn-detail-action-btn"
                onClick={save}
                disabled={!title.trim() || saving}
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                className="cn-newtask-cancel cn-detail-action-btn"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Cancel
              </button>
            </>
          ) : confirmingDelete ? (
            <>
              <button
                type="button"
                className="cn-newtask-danger cn-detail-action-btn"
                onClick={confirmDelete}
                disabled={saving}
              >
                {saving ? "Deleting…" : "Confirm delete"}
              </button>
              <button
                type="button"
                className="cn-newtask-cancel cn-detail-action-btn"
                onClick={() => setConfirmingDelete(false)}
                disabled={saving}
              >
                Keep
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="cn-detail-action-btn cn-detail-action-btn-ghost"
                onClick={startEdit}
              >
                ✎ Edit
              </button>
              <button
                type="button"
                className="cn-detail-action-btn cn-detail-action-btn-ghost cn-detail-action-btn-danger"
                onClick={() => setConfirmingDelete(true)}
              >
                ✕ Delete
              </button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <input
          className="cn-detail-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          autoFocus
          required
        />
      ) : (
        <h1 className="cn-h1 cn-detail-card-title">{task.title}</h1>
      )}

      <div className="cn-detail-layout">
        <article className="cn-detail-main">
          <section>
            <h2 className="cn-detail-h2">Description</h2>
            {editing ? (
              <textarea
                className="cn-newtask-input cn-newtask-textarea cn-detail-desc-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Describe the task"
              />
            ) : (
              <p className="cn-detail-body">{task.description}</p>
            )}
          </section>
        </article>

        <aside className="cn-detail-side">
          <h3 className="cn-detail-side-h">Details</h3>
          <dl className="cn-detail-meta">
            <div className="cn-detail-row">
              <dt>Status</dt>
              <dd>
                {editing ? (
                  <select
                    className="cn-newtask-input"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={FLAG_CLASS[task.status]}>
                    {STATUS_LABEL[task.status]}
                  </span>
                )}
              </dd>
            </div>
            <div className="cn-detail-row">
              <dt>Priority</dt>
              <dd>
                {editing ? (
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
                ) : (
                  <span className="cn-prio">
                    <span
                      className="cn-prio-dot"
                      style={{ background: PRIO_COLOR[task.priority] }}
                      aria-hidden="true"
                    />
                    {task.priority}
                  </span>
                )}
              </dd>
            </div>
            <div className="cn-detail-row">
              <dt>Due</dt>
              <dd className={editing ? undefined : "cn-detail-mono"}>
                {editing ? (
                  <input
                    className="cn-newtask-input"
                    value={due}
                    onChange={(e) => setDue(e.target.value)}
                    placeholder="e.g. Fri 24"
                  />
                ) : (
                  task.due
                )}
              </dd>
            </div>
            <div className="cn-detail-row">
              <dt>Assignee</dt>
              <dd>
                {editing ? (
                  <TagPicker
                    options={assigneeOptions}
                    value={assignee}
                    onChange={(next) => setAssignee(next)}
                    placeholder="Find or add initials…"
                    maxLength={3}
                    renderChip={(v) => (
                      <span className={avatarClass(v)} aria-label={v}>
                        {v}
                      </span>
                    )}
                  />
                ) : (
                  <span className={avatarClass(task.assignee)} aria-label={task.assignee}>
                    {task.assignee}
                  </span>
                )}
              </dd>
            </div>
            <div className="cn-detail-row">
              <dt>Labels</dt>
              <dd className="cn-detail-labels">
                {editing ? (
                  <TagPicker
                    multi
                    options={labelOptions}
                    value={labelsValue}
                    onChange={(next) => setLabelsValue(next)}
                    placeholder="Find or add a label…"
                    addLabel="+ Add label"
                    renderChip={(v, { onRemove }) => (
                      <span
                        className={labelClass(v)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {v}
                        <button
                          type="button"
                          onClick={onRemove}
                          aria-label={`Remove ${v}`}
                          style={{
                            display: "inline-grid",
                            placeContent: "center",
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            background: "rgba(10,10,10,0.18)",
                            border: 0,
                            color: "inherit",
                            cursor: "pointer",
                            fontSize: "11px",
                            lineHeight: 1,
                            padding: 0,
                          }}
                        >
                          ×
                        </button>
                      </span>
                    )}
                  />
                ) : task.labels.length === 0 ? (
                  <span className="cn-detail-mono">—</span>
                ) : (
                  task.labels.map((l) => (
                    <span key={l} className={labelClass(l)}>
                      {l}
                    </span>
                  ))
                )}
              </dd>
            </div>
            <div className="cn-detail-row">
              <dt>Updated</dt>
              <dd className="cn-detail-mono">{task.updated}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
