"use client";

import { useMemo, useState } from "react";
import type { DragEvent } from "react";
import type { Task, TaskStatus } from "@/lib/tasks";
import { STATUS_LABEL } from "@/lib/tasks";
import { useTaskStore } from "@/lib/task-store";
import TaskCard from "./TaskCard";

type StatusFilter = TaskStatus | "all";
type SortKey = "priority" | "due" | "updated";
type View = "list" | "board";

const FILTERS: { key: StatusFilter; label: string; dot: string }[] = [
  { key: "all", label: "All", dot: "rgba(255,253,245,0.45)" },
  { key: "in_progress", label: "In progress", dot: "#FFE066" },
  { key: "blocked", label: "Blocked", dot: "#FF7BF5" },
  { key: "done", label: "Done", dot: "#00FFB2" },
  { key: "todo", label: "Todo", dot: "rgba(255,253,245,0.45)" },
  { key: "backlog", label: "Backlog", dot: "rgba(255,253,245,0.30)" },
  { key: "canceled", label: "Canceled", dot: "rgba(255,253,245,0.20)" },
];

const BOARD_COLUMNS: { key: TaskStatus; label: string; dot: string }[] = [
  { key: "backlog", label: "Backlog", dot: "rgba(255,253,245,0.30)" },
  { key: "todo", label: "Todo", dot: "rgba(255,253,245,0.45)" },
  { key: "in_progress", label: "In progress", dot: "#FFE066" },
  { key: "blocked", label: "Blocked", dot: "#FF7BF5" },
  { key: "done", label: "Done", dot: "#00FFB2" },
  { key: "canceled", label: "Canceled", dot: "rgba(255,253,245,0.20)" },
];

const PRIORITY_ORDER: Record<Task["priority"], number> = {
  P0: 0, P1: 1, P2: 2, P3: 3,
};

const DUE_ORDER: Record<string, number> = {
  overdue: -1,
  today: 0,
};

function dueWeight(due: string): number {
  if (DUE_ORDER[due] !== undefined) return DUE_ORDER[due];
  if (due === "—") return 999;
  const m = /^([A-Z][a-z]{2}) (\d+)/.exec(due);
  if (!m) return 500;
  return 1 + parseInt(m[2], 10);
}

export default function TaskFilter({ tasks }: { tasks: Task[] }) {
  const { reorderTask } = useTaskStore();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("priority");
  const [view, setView] = useState<View>("board");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverTask, setDragOverTask] = useState<
    { id: string; pos: "above" | "below" } | null
  >(null);
  const [dragOverColEnd, setDragOverColEnd] = useState<TaskStatus | null>(null);

  const clearDrag = () => {
    setDraggingId(null);
    setDragOverTask(null);
    setDragOverColEnd(null);
  };

  const handleDragStart = (taskId: string) => (e: DragEvent<HTMLAnchorElement>) => {
    setDraggingId(taskId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskId);
  };
  const handleDragEnd = () => clearDrag();

  const handleCardDragOver =
    (taskId: string) => (e: DragEvent<HTMLDivElement>) => {
      if (!draggingId || draggingId === taskId) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      const rect = e.currentTarget.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const pos: "above" | "below" = e.clientY < midY ? "above" : "below";
      setDragOverColEnd(null);
      setDragOverTask((cur) =>
        cur?.id === taskId && cur.pos === pos ? cur : { id: taskId, pos },
      );
    };
  const handleCardDragLeave =
    (taskId: string) => (e: DragEvent<HTMLDivElement>) => {
      if (e.currentTarget.contains(e.relatedTarget as Node)) return;
      setDragOverTask((cur) => (cur?.id === taskId ? null : cur));
    };
  const handleCardDrop =
    (targetTaskId: string, colKey: TaskStatus) =>
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain") || draggingId;
      if (!id || id === targetTaskId) {
        clearDrag();
        return;
      }
      const pos = dragOverTask?.pos ?? "below";
      const colItems = grouped[colKey];
      const idx = colItems.findIndex((t) => t.id === targetTaskId);
      let beforeId: string | null;
      if (pos === "above") {
        beforeId = targetTaskId;
      } else {
        const next = colItems[idx + 1];
        beforeId = next ? next.id : null;
      }
      reorderTask(id, colKey, beforeId);
      setSort("updated");
      clearDrag();
    };

  const handleColEndDragOver =
    (colKey: TaskStatus) => (e: DragEvent<HTMLDivElement>) => {
      if (!draggingId) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverTask(null);
      if (dragOverColEnd !== colKey) setDragOverColEnd(colKey);
    };
  const handleColEndDragLeave =
    (colKey: TaskStatus) => (e: DragEvent<HTMLDivElement>) => {
      if (e.currentTarget.contains(e.relatedTarget as Node)) return;
      setDragOverColEnd((cur) => (cur === colKey ? null : cur));
    };
  const handleColEndDrop =
    (colKey: TaskStatus) => (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain") || draggingId;
      if (id) {
        reorderTask(id, colKey, null);
        setSort("updated");
      }
      clearDrag();
    };

  const visible = useMemo(() => {
    const filtered =
      status === "all" ? tasks : tasks.filter((t) => t.status === status);
    const sorted = [...filtered].sort((a, b) => {
      if (sort === "priority")
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (sort === "due") return dueWeight(a.due) - dueWeight(b.due);
      return 0;
    });
    return sorted;
  }, [tasks, status, sort]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: tasks.length };
    for (const t of tasks) c[t.status] = (c[t.status] || 0) + 1;
    return c;
  }, [tasks]);

  // For board view, group visible tasks by status into columns.
  const grouped = useMemo(() => {
    const g: Record<TaskStatus, Task[]> = {
      backlog: [], todo: [], in_progress: [], blocked: [], done: [], canceled: [],
    };
    for (const t of visible) g[t.status].push(t);
    return g;
  }, [visible]);

  return (
    <div className="cn-filter">
      <div className="cn-filter-bar">
        <div className="cn-filter-group" role="tablist" aria-label="filter by status">
          {FILTERS.map((f) => {
            const active = status === f.key;
            const count = counts[f.key] ?? 0;
            return (
              <button
                key={f.key}
                role="tab"
                aria-selected={active}
                onClick={() => setStatus(f.key)}
                className={`cn-filter-chip${active ? " cn-filter-chip-active" : ""}`}
              >
                <span
                  className="cn-filter-dot"
                  style={{ background: f.dot }}
                  aria-hidden="true"
                />
                {f.label}
                <span className="cn-filter-count">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="cn-filter-right">
          <div
            className="cn-view-toggle"
            role="tablist"
            aria-label="view mode"
          >
            <button
              type="button"
              role="tab"
              aria-selected={view === "list"}
              onClick={() => setView("list")}
              className={`cn-view-btn${view === "list" ? " cn-view-btn-active" : ""}`}
            >
              ☰ List
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "board"}
              onClick={() => setView("board")}
              className={`cn-view-btn${view === "board" ? " cn-view-btn-active" : ""}`}
            >
              ▦ Board
            </button>
          </div>
          <div className="cn-filter-sort">
            <label htmlFor="cn-sort" className="cn-filter-sort-label">Sort</label>
            <select
              id="cn-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="cn-filter-sort-select"
            >
              <option value="priority">Priority</option>
              <option value="due">Due date</option>
              <option value="updated">Recently updated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="cn-filter-status" aria-live="polite">
        Showing <strong>{visible.length}</strong> of {tasks.length} ·{" "}
        {status === "all" ? "all statuses" : STATUS_LABEL[status]} · sorted by {sort} ·{" "}
        {view} view
      </div>

      {visible.length === 0 ? (
        <div className="cn-empty">
          <div className="cn-empty-glyph" aria-hidden="true">&empty;</div>
          <h3>No tasks match this filter.</h3>
          <p>
            There are no tasks with status &quot;{STATUS_LABEL[status as TaskStatus]}&quot;
            right now. Try a different filter, or clear it to see everything.
          </p>
          <button
            className="cn-flag cn-flag-doing"
            onClick={() => setStatus("all")}
            style={{ marginTop: 8, cursor: "pointer", border: 0 }}
          >
            Clear filter
          </button>
        </div>
      ) : view === "list" ? (
        <div className="cn-task-list">
          {visible.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="cn-board">
          {BOARD_COLUMNS.map((col) => {
            const items = grouped[col.key];
            const endOver = dragOverColEnd === col.key;
            return (
              <section
                key={col.key}
                className="cn-board-col"
                aria-label={`${col.label} column`}
              >
                <header className="cn-board-col-head">
                  <span
                    className="cn-board-col-dot"
                    style={{ background: col.dot }}
                    aria-hidden="true"
                  />
                  <h3 className="cn-board-col-title">{col.label}</h3>
                  <span className="cn-board-col-count">{items.length}</span>
                </header>
                <div className="cn-board-col-body">
                  {items.length === 0 ? (
                    <div
                      className={`cn-board-col-empty${endOver ? " cn-board-col-empty-over" : ""}`}
                      onDragOver={handleColEndDragOver(col.key)}
                      onDragLeave={handleColEndDragLeave(col.key)}
                      onDrop={handleColEndDrop(col.key)}
                    >
                      {endOver ? "Drop here" : "—"}
                    </div>
                  ) : (
                    <>
                      {items.map((task) => {
                        const slotPos =
                          dragOverTask?.id === task.id ? dragOverTask.pos : null;
                        const slotCls =
                          "cn-board-card-slot" +
                          (slotPos === "above" ? " cn-board-card-slot-above" : "") +
                          (slotPos === "below" ? " cn-board-card-slot-below" : "");
                        return (
                          <div
                            key={task.id}
                            className={slotCls}
                            onDragOver={handleCardDragOver(task.id)}
                            onDragLeave={handleCardDragLeave(task.id)}
                            onDrop={handleCardDrop(task.id, col.key)}
                          >
                            <TaskCard
                              task={task}
                              draggable
                              isDragging={draggingId === task.id}
                              onDragStart={handleDragStart(task.id)}
                              onDragEnd={handleDragEnd}
                            />
                          </div>
                        );
                      })}
                      <div
                        className={`cn-board-col-trailing${endOver ? " cn-board-col-trailing-over" : ""}`}
                        onDragOver={handleColEndDragOver(col.key)}
                        onDragLeave={handleColEndDragLeave(col.key)}
                        onDrop={handleColEndDrop(col.key)}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
