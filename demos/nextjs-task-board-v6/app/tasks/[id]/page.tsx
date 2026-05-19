// Dynamic route — one of these renders for each task ID.
// generateStaticParams() tells Next.js which IDs to pre-render at build time
// so every detail page ships as static HTML in the export.

import Link from "next/link";
import { notFound } from "next/navigation";
import { getTasks, getTaskById } from "@/lib/tasks";
import DemoNote from "@/components/DemoNote";
import TaskDetailCard from "@/components/TaskDetailCard";
import TriggerError from "@/components/TriggerError";

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
  if (!task) return { title: "Not found · Cadence v6" };
  return {
    title: `${task.id} · ${task.title} | Cadence v6`,
    description: task.description,
  };
}

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

      <div className="cn-eyebrow">/tasks/[id] · v6 · inline edit on the task</div>

      <TaskDetailCard initialTask={task} />

      <DemoNote title="How this page reached you">
        <p>
          You navigated to <code>/tasks/{task.id}</code>. Next.js matched it against{" "}
          <code>app/tasks/[id]/page.tsx</code> — the square brackets are how the
          router says &quot;any segment.&quot; Because this is a static export, the
          page wasn&apos;t rendered just now; it was pre-rendered at build time.{" "}
          <code>generateStaticParams()</code> returned every task ID from{" "}
          <code>lib/tasks.ts</code>, and the build produced one HTML file per ID.
          The detail page you&apos;re reading is one of those files.
        </p>

        <h3 className="cn-demo-note-sub">Generated route, in shorthand</h3>
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
        <p className="cn-demo-note-aside">
          Two functions. <code>generateStaticParams()</code> runs at build time and
          tells Next.js which IDs exist. The default export runs at build time per
          ID, receives <code>params</code> as a Promise (Next.js 16 convention),
          looks up the task, and renders. <code>notFound()</code> from{" "}
          <code>next/navigation</code> handles the missing case.
        </p>
      </DemoNote>

      <TriggerError />

      <section className="cn-section">
        <Link href="/tasks" className="cn-back-link">
          ← Back to all tasks
        </Link>
      </section>
    </main>
  );
}
