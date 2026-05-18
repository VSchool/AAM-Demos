"use client";

import { useEffect, useState } from "react";
import type { Task } from "@/lib/tasks";
import { getTasks } from "@/lib/tasks";
import Progression from "@/components/Progression";
import TaskCard from "@/components/TaskCard";
import TaskListSkeleton from "@/components/TaskListSkeleton";

export default function TasksPage() {
  // The W5D1 React pattern, applied to a Next.js page.
  // v2 will rewrite this entire block as one line of server-component code.
  const [tasks, setTasks] = useState<Task[] | null>(null);

  useEffect(() => {
    // Tiny artificial delay so the loading state is visible to students.
    // In a real client-fetch scenario this would be a fetch() to an API.
    const t = setTimeout(() => {
      setTasks(getTasks());
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const isLoading = tasks === null;
  const counts = !isLoading
    ? tasks!.reduce<Record<string, number>>((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      }, {})
    : null;

  return (
    <main className="cn-page">
      <div className="cn-eyebrow">/tasks · v1 · client-side data</div>
      <h1 className="cn-h1">All tasks.</h1>
      <p className="cn-lede">
        v1 brings the data layer. The page is a <strong>client component</strong> — it
        runs in the browser, uses <code>useState</code> and <code>useEffect</code> to load
        tasks from <code>lib/tasks.ts</code>, and renders them once they arrive. This is
        the W5D1 React pattern you already know, dropped into a Next.js page. v2 collapses
        all of this into a single server-component line.
      </p>

      <Progression current={1} />

      <section className="cn-banner cn-banner-yellow" aria-live="polite">
        <div className="cn-banner-meta">why the loading flicker</div>
        <p>
          The list is empty for ~700 ms while <code>useEffect</code> runs after the page
          hydrates. The browser receives the HTML, mounts React, fires the effect, then
          re-renders with data. This is the trade-off of client-side fetch — v2 eliminates
          the wait entirely by rendering on the server.
        </p>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">
          {isLoading
            ? "loading · useEffect in flight"
            : `${tasks!.length} tasks · loaded via useEffect`}
        </div>
        <h2 className="cn-section-h">
          {isLoading ? "Fetching…" : "Tasks (client-rendered)"}
        </h2>

        {!isLoading && counts && (
          <div className="cn-summary">
            <div className="cn-summary-tile">
              <span className="cn-summary-dot" style={{ background: "#FFE066" }} />
              <span className="cn-summary-count">{counts.in_progress ?? 0}</span>
              <span className="cn-summary-label">in progress</span>
            </div>
            <div className="cn-summary-tile">
              <span className="cn-summary-dot" style={{ background: "#FF7BF5" }} />
              <span className="cn-summary-count">{counts.blocked ?? 0}</span>
              <span className="cn-summary-label">blocked</span>
            </div>
            <div className="cn-summary-tile">
              <span className="cn-summary-dot" style={{ background: "#00FFB2" }} />
              <span className="cn-summary-count">{counts.done ?? 0}</span>
              <span className="cn-summary-label">done</span>
            </div>
            <div className="cn-summary-tile">
              <span
                className="cn-summary-dot"
                style={{ background: "rgba(255,253,245,0.45)" }}
              />
              <span className="cn-summary-count">
                {(counts.todo ?? 0) + (counts.backlog ?? 0)}
              </span>
              <span className="cn-summary-label">todo · backlog</span>
            </div>
          </div>
        )}

        {isLoading ? (
          <TaskListSkeleton count={6} />
        ) : (
          <div className="cn-task-list">
            {tasks!.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">the pattern in pseudocode</div>
        <h2 className="cn-section-h">What this client component is doing</h2>
        <pre className="cn-code">
          <code>{`"use client";

import { useEffect, useState } from "react";
import { getTasks } from "@/lib/tasks";

export default function TasksPage() {
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  if (tasks === null) return <Skeleton />;
  return <List items={tasks} />;
}`}</code>
        </pre>
        <p className="cn-aside">
          Familiar from Day 1. The page renders empty, hydrates, fires the effect, then
          re-renders with data. v2 deletes the <code>&quot;use client&quot;</code>, the{" "}
          <code>useState</code>, the <code>useEffect</code>, and the skeleton — and the
          page loads faster.
        </p>
      </section>
    </main>
  );
}
