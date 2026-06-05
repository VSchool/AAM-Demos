"use client";

import AuthGate from "@/components/AuthGate";
import TaskBoard from "@/components/TaskBoard";
import TaskListSkeleton from "@/components/TaskListSkeleton";
import WeatherStrip from "@/components/WeatherStrip";
import { useTaskStore } from "@/lib/task-store";

function Board() {
  const { loading, hydrated, error } = useTaskStore();

  return (
    <main className="cn-page">
      <div className="cn-eyebrow">/tasks</div>
      <h1 className="cn-h1">All tasks.</h1>
      <p className="cn-lede">
        Create a task, filter by status, and sort by priority, due date, or
        recent activity. Click into any ticket to edit it. Everything here is
        saved to your account — it loads from the API and follows you to any
        device.
      </p>

      <WeatherStrip />

      <section className="cn-section">
        <div className="cn-section-tag">your board</div>
        <h2 className="cn-section-h">Create, filter, click into detail to edit</h2>

        {error ? (
          <div className="cn-auth-error" role="alert" style={{ marginBottom: 16 }}>
            {error}
          </div>
        ) : null}

        {loading && !hydrated ? <TaskListSkeleton /> : <TaskBoard />}
      </section>
    </main>
  );
}

export default function TasksView() {
  return (
    <AuthGate>
      <Board />
    </AuthGate>
  );
}
