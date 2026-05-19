// Dynamic route — one of these renders for each task ID.
// generateStaticParams() tells Next.js which IDs to pre-render at build time
// so every detail page ships as static HTML in the export.

import Link from "next/link";
import { notFound } from "next/navigation";
import { getTasks, getTaskById, STATUS_LABEL } from "@/lib/tasks";
import type { Task } from "@/lib/tasks";
import TaskDetailActions from "@/components/TaskDetailActions";

export async function generateStaticParams() {
  return getTasks().map((t) => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const task = getTaskById(id);
  if (!task) return { title: "Not found · Cadence v5" };
  return {
    title: `${task.id} · ${task.title} | Cadence v5`,
    description: task.description,
  };
}

const FLAG_CLASS: Record<Task["status"], string> = {
  backlog: "cn-flag cn-flag-open",
  todo: "cn-flag cn-flag-open",
  in_progress: "cn-flag cn-flag-doing",
  blocked: "cn-flag cn-flag-blocked",
  done: "cn-flag cn-flag-done",
  canceled: "cn-flag cn-flag-canceled",
};

const PRIO_COLOR: Record<Task["priority"], string> = {
  P0: "#FF7BF5",
  P1: "#FFE066",
  P2: "#7DD3FC",
  P3: "rgba(10,10,10,0.30)",
};

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const task = getTaskById(id);
  if (!task) notFound();

  return (
    <main className="cn-page">
      <div className="cn-breadcrumb">
        <Link href="/tasks" className="cn-breadcrumb-link">
          ← /tasks
        </Link>
        <span className="cn-breadcrumb-sep">·</span>
        <span className="cn-breadcrumb-id">{task.id}</span>
      </div>

      <div className="cn-eyebrow">/tasks/[id] · v5 · edit + delete inline</div>

      <div className="cn-detail-header">
        <span className={FLAG_CLASS[task.status]}>{STATUS_LABEL[task.status]}</span>
      </div>
      <h1 className="cn-h1" style={{ fontSize: "clamp(28px, 4.5vw, 48px)" }}>
        {task.title}
      </h1>

      <div className="cn-detail-layout">
        <article className="cn-detail-main">
          <section>
            <h2 className="cn-detail-h2">Description</h2>
            <p className="cn-detail-body">{task.description}</p>
          </section>

          <section>
            <h2 className="cn-detail-h2">How this page reached you</h2>
            <p className="cn-detail-body">
              You navigated to <code>/tasks/{task.id}</code>. Next.js matched it against{" "}
              <code>app/tasks/[id]/page.tsx</code> — the square brackets are how the
              router says &quot;any segment.&quot; Because this is a static export, the
              page wasn&apos;t rendered just now; it was pre-rendered at build time.{" "}
              <code>generateStaticParams()</code> returned every task ID from{" "}
              <code>lib/tasks.ts</code>, and the build produced one HTML file per ID.
              The detail page you&apos;re reading is one of those files.
            </p>
          </section>

          <section>
            <h2 className="cn-detail-h2">Generated route, in shorthand</h2>
            <pre className="cn-code">
              <code>{`// app/tasks/[id]/page.tsx
export async function generateStaticParams() {
  return getTasks().map((t) => ({ id: t.id }));
}

export default async function TaskDetailPage({ params }) {
  const { id } = await params;
  const task = getTaskById(id);
  if (!task) notFound();
  return <Detail task={task} />;
}`}</code>
            </pre>
            <p className="cn-aside">
              Two functions. <code>generateStaticParams()</code> runs at build time and
              tells Next.js which IDs exist. The default export runs at build time per
              ID, receives <code>params</code> as a Promise (Next.js 16 convention),
              looks up the task, and renders. <code>notFound()</code> from{" "}
              <code>next/navigation</code> handles the missing case.
            </p>
          </section>
        </article>

        <aside className="cn-detail-side">
          <h3 className="cn-detail-side-h">Details</h3>
          <dl className="cn-detail-meta">
            <div className="cn-detail-row">
              <dt>Status</dt>
              <dd>
                <span className={FLAG_CLASS[task.status]}>
                  {STATUS_LABEL[task.status]}
                </span>
              </dd>
            </div>
            <div className="cn-detail-row">
              <dt>Priority</dt>
              <dd>
                <span className="cn-prio">
                  <span
                    className="cn-prio-dot"
                    style={{ background: PRIO_COLOR[task.priority] }}
                    aria-hidden="true"
                  />
                  {task.priority}
                </span>
              </dd>
            </div>
            <div className="cn-detail-row">
              <dt>Due</dt>
              <dd className="cn-detail-mono">{task.due}</dd>
            </div>
            <div className="cn-detail-row">
              <dt>Assignee</dt>
              <dd>
                <span className="cn-avatar" aria-label={task.assignee}>
                  {task.assignee}
                </span>
              </dd>
            </div>
            <div className="cn-detail-row">
              <dt>Labels</dt>
              <dd className="cn-detail-labels">
                {task.labels.length === 0 ? (
                  <span className="cn-detail-mono">—</span>
                ) : (
                  task.labels.map((l) => (
                    <span key={l} className="cn-task-label">
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
            <div className="cn-detail-row">
              <dt>Route ID</dt>
              <dd className="cn-detail-mono">{task.id}</dd>
            </div>
          </dl>
        </aside>
      </div>

      <TaskDetailActions initialTask={task} />

      <section className="cn-section">
        <Link href="/tasks" className="cn-back-link">
          ← Back to all tasks
        </Link>
      </section>
    </main>
  );
}
