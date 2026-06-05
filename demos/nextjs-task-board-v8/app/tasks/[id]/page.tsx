"use client";

// V8: the detail page reads its task from the authenticated client store
// (populated by GET /api/tasks), not from a build-time static read. There's no
// generateStaticParams here — tasks are per-user data behind auth, so pages
// can't be pre-rendered by id at build time the way v7's static export did.

import { use } from "react";
import Link from "next/link";
import AuthGate from "@/components/AuthGate";
import TaskDetailCard from "@/components/TaskDetailCard";

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <AuthGate>
      <main className="cn-page">
        <div className="cn-breadcrumb">
          <Link href="/tasks" className="cn-breadcrumb-link">
            ← /tasks
          </Link>
          <span className="cn-breadcrumb-sep">·</span>
          <span className="cn-breadcrumb-id">{id}</span>
        </div>

        <TaskDetailCard taskId={id} />

        <section className="cn-section">
          <Link href="/tasks" className="cn-back-link">
            ← Back to all tasks
          </Link>
        </section>
      </main>
    </AuthGate>
  );
}
