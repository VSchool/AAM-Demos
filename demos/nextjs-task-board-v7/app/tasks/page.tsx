// Server component — the entry point for the board.
// The TaskBoard client component reads tasks from the client-side store
// (initialized at the root layout from getTasks(), persisted to localStorage).

import TaskBoard from "@/components/TaskBoard";

export const metadata = {
  title: "Tasks · Cadence",
  description:
    "Your task board — create, filter, sort, and open any ticket to edit it.",
};

export default function TasksPage() {
  return (
    <main className="cn-page">
      <div className="cn-eyebrow">/tasks</div>
      <h1 className="cn-h1">All tasks.</h1>
      <p className="cn-lede">
        Create a task, filter by status, and sort by priority, due date, or
        recent activity. Click into any ticket to edit it. Your board is saved
        in this browser.
      </p>

      <section className="cn-section">
        <div className="cn-section-tag">your board</div>
        <h2 className="cn-section-h">Create, filter, click into detail to edit</h2>
        <TaskBoard />
      </section>
    </main>
  );
}
