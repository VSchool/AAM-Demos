// Server component — owns the data read.
// TaskFilter is the client component — owns the interaction.
// This is the v3 lesson: the boundary, drawn explicitly.

import { getTasks } from "@/lib/tasks";
import Progression from "@/components/Progression";
import TaskFilter from "@/components/TaskFilter";

export const metadata = {
  title: "Tasks · Cadence v3",
  description:
    "Server-rendered task list with a client-component filter + sort wrapper. Server owns the data read; client owns the interaction.",
};

export default async function TasksPage() {
  // This runs on the server (at build time for static export).
  const tasks = getTasks();

  return (
    <main className="cn-page">
      <div className="cn-eyebrow">/tasks · v3 · client filter wraps server list</div>
      <h1 className="cn-h1">All tasks.</h1>
      <p className="cn-lede">
        The data still comes from <code>getTasks()</code> in this <strong>server
        component</strong> — same as v2. What&apos;s new: a{" "}
        <code>&quot;use client&quot;</code> component called <code>TaskFilter</code>{" "}
        receives the array as a prop and decides which tasks to show, sorted how. Try the
        chips and sort below — the filter logic runs in your browser, but the data was
        rendered on the server.
      </p>

      <Progression current={3} />

      <section className="cn-banner cn-banner-pink">
        <div className="cn-banner-meta">where the boundary is</div>
        <p>
          <code>app/tasks/page.tsx</code> (this page) is a server component — no{" "}
          <code>&quot;use client&quot;</code>, no hooks, top of file says{" "}
          <code>async</code>. It reads <code>lib/tasks.ts</code> and passes the array to{" "}
          <code>&lt;TaskFilter tasks=&#123;tasks&#125; /&gt;</code>.{" "}
          <code>components/TaskFilter.tsx</code> opens with{" "}
          <code>&quot;use client&quot;</code> and uses <code>useState</code> for the
          active filter and sort. Server owns the data; client owns the interaction. If
          you lifted the <code>getTasks()</code> call into TaskFilter, you&apos;d undo
          v2.
        </p>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">{tasks.length} tasks · filter + sort live</div>
        <h2 className="cn-section-h">Filter + sort</h2>
        <TaskFilter tasks={tasks} />
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">the boundary in code</div>
        <h2 className="cn-section-h">Two files. One arrow.</h2>
        <pre className="cn-code">
          <code>{`// app/tasks/page.tsx — SERVER component
import { getTasks } from "@/lib/tasks";
import TaskFilter from "@/components/TaskFilter";

export default async function TasksPage() {
  const tasks = getTasks();              // runs on the server
  return <TaskFilter tasks={tasks} />;   // serializes, sent to client
}

// components/TaskFilter.tsx — CLIENT component
"use client";
import { useState, useMemo } from "react";

export default function TaskFilter({ tasks }) {
  const [status, setStatus] = useState("all");   // runs in the browser
  const visible = useMemo(() => ..., [tasks, status]);
  return <List items={visible} />;
}`}</code>
        </pre>
        <p className="cn-aside">
          The handoff: the server component renders the client component as a JSX tag
          with the data as a prop. Next.js serializes the prop, ships the client
          component&apos;s code, hydrates it in the browser with the data already in
          place. No re-fetch. The user sees the full list immediately — and the filter
          works as soon as React mounts.
        </p>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">the trap to watch for</div>
        <h2 className="cn-section-h">When AI &quot;simplifies&quot; this badly</h2>
        <pre className="cn-code">
          <code>{`// The wrong fix — moves getTasks into the client
"use client";
import { useEffect, useState } from "react";
import { getTasks } from "@/lib/tasks";

export default function TaskFilter() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => { setTasks(getTasks()); }, []);
  // ... filter logic
}

// You just deleted everything v2 did. Back to the v1 flicker.`}</code>
        </pre>
        <p className="cn-aside">
          When AI sees a client component and decides to &quot;clean up&quot; by lifting
          the data into it, that&apos;s the move to question. The whole reason v3 exists
          is to show that the boundary works both ways: keep the read on the server, keep
          the interaction on the client.
        </p>
      </section>
    </main>
  );
}
