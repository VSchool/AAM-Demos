// Dynamic route — one of these renders for each task ID.
// generateStaticParams() tells Next.js which IDs to pre-render at build time
// so every detail page ships as static HTML in the export.

import Link from "next/link";
import { notFound } from "next/navigation";
import { getTasks, getTaskById } from "@/lib/tasks";
import TaskDetailCard from "@/components/TaskDetailCard";

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
  if (!task) return { title: "Not found · Cadence" };
  return {
    title: `${task.id} · ${task.title} | Cadence`,
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

      <TaskDetailCard initialTask={task} />

      <section className="cn-section">
        <Link href="/tasks" className="cn-back-link">
          ← Back to all tasks
        </Link>
      </section>
    </main>
  );
}
