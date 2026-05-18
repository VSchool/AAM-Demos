// No "use client" — this is a server component (the App Router default).
// No useState. No useEffect. No skeleton.
// The data is read at build time (static export) and baked into the HTML.

import { getTasks } from "@/lib/tasks";
import Progression from "@/components/Progression";
import TaskCard from "@/components/TaskCard";

export const metadata = {
  title: "Tasks · Cadence v2",
  description:
    "Server-component task list. lib/tasks.ts is read at build time; the HTML the browser receives already contains every task.",
};

export default async function TasksPage() {
  const tasks = getTasks();

  const counts = tasks.reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="cn-page">
      <div className="cn-eyebrow">/tasks · v2 · server component</div>
      <h1 className="cn-h1">All tasks.</h1>
      <p className="cn-lede">
        Same data, same UI, no client-side dance. This page is an{" "}
        <strong>async server component</strong> — <code>getTasks()</code> runs at build
        time, the HTML you&apos;re reading already contains every task card. No{" "}
        <code>&quot;use client&quot;</code>, no <code>useState</code>, no{" "}
        <code>useEffect</code>, no skeleton, no flicker. View source on this page and the
        whole list is there.
      </p>

      <Progression current={2} />

      <section className="cn-banner cn-banner-green">
        <div className="cn-banner-meta">what changed from v1</div>
        <p>
          v1&apos;s entire data-loading block (4 lines of hooks + a skeleton fallback) is
          gone. In its place: one line — <code>const tasks = getTasks()</code> — at the
          top of an <code>async</code> page function. The component runs on the server (at
          build time for this static export), renders to HTML, and ships.
        </p>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">{tasks.length} tasks · server-rendered</div>
        <h2 className="cn-section-h">Tasks (server-rendered)</h2>

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

        <div className="cn-task-list">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">v1 vs v2 · the diff</div>
        <h2 className="cn-section-h">What got deleted</h2>
        <pre className="cn-code">
          <code>{`- "use client";
-
- import { useEffect, useState } from "react";
- import { getTasks } from "@/lib/tasks";
-
- export default function TasksPage() {
-   const [tasks, setTasks] = useState(null);
-
-   useEffect(() => {
-     setTasks(getTasks());
-   }, []);
-
-   if (tasks === null) return <Skeleton />;
-   return <List items={tasks} />;
- }

+ import { getTasks } from "@/lib/tasks";
+
+ export default async function TasksPage() {
+   const tasks = getTasks();
+   return <List items={tasks} />;
+ }`}</code>
        </pre>
        <p className="cn-aside">
          15 lines down to 4. The reason this works: server components run on the server
          (or, for a static export, at build time). They render to HTML and that HTML is
          what the browser receives. No state machine, no loading dance — the data is
          already there.
        </p>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">limit · when you&apos;d reach for v1&apos;s pattern</div>
        <h2 className="cn-section-h">When client components still earn their keep</h2>
        <pre className="cn-code">
          <code>{`Server component  →  data that doesn't change based on user action
                       lists, content, settings read from a source

Client component  →  interactivity, state, effects, browser-only APIs
                       filters, drag-and-drop, animations, forms`}</code>
        </pre>
        <p className="cn-aside">
          v3 keeps this server component as the data source and adds a client component
          on top of it — for the filter. The pattern is: server owns the read, client
          owns the interaction.
        </p>
      </section>
    </main>
  );
}
