// Server component — still the entry point.
// The TaskBoard client component reads tasks from the in-memory store
// (initialized at the root layout from getTasks()).

import DemoNote from "@/components/DemoNote";
import Progression from "@/components/Progression";
import TaskBoard from "@/components/TaskBoard";

export const metadata = {
  title: "Tasks · Cadence v6",
  description:
    "Server-rendered shell with a client-side store backing create / edit / delete. UI patterns only — refresh and changes vanish.",
};

export default function TasksPage() {
  return (
    <main className="cn-page">
      <div className="cn-eyebrow">/tasks · v6 · the finished shape</div>
      <h1 className="cn-h1">All tasks.</h1>
      <p className="cn-lede">
        v5 keeps everything from v3/v4 — server-rendered list, client filter, dynamic
        detail route — and adds the <strong>shapes</strong> of create / edit / delete on
        top. New tasks land in an in-memory React Context store; edits and deletes
        mutate that store. The UI is real. The persistence is theatre — refresh and the
        store reinitializes from <code>lib/tasks.ts</code>.
      </p>

      <Progression current={6} />

      <section className="cn-section">
        <div className="cn-section-tag">try it · all changes are session-only</div>
        <h2 className="cn-section-h">Create, filter, click into detail to edit</h2>
        <TaskBoard
          note={
            <DemoNote title="Demo note" size="small">
              <div className="cn-demo-note-meta">
                this UI demonstrates the patterns only · W6 makes them real
              </div>
              <p>
                The &quot;+ New task&quot; form, the edit form on every detail page,
                the delete-with-confirmation flow — they all run in your browser,
                against a client-side store. There is no API route, no database, no
                server-side write. That&apos;s next week&apos;s scope. v5&apos;s job
                is to make the patterns (forms, optimistic UI, confirm flows) feel
                right before any persistence is plugged in.
              </p>
            </DemoNote>
          }
        />
      </section>

      <DemoNote title="How the store works — one Context provider, three actions">
        <pre className="cn-code">
          <code>{`// lib/task-store.tsx — "use client"
export function TaskStoreProvider({ initial, children }) {
  const [tasks, setTasks] = useState(initial);  // hydrated from getTasks()

  const createTask = (input) => setTasks(prev => [{ ...input, id: nextId(prev) }, ...prev]);
  const updateTask = (id, patch) => setTasks(prev =>
    prev.map(t => t.id === id ? { ...t, ...patch } : t)
  );
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  return <Ctx.Provider value={{ tasks, createTask, updateTask, deleteTask }} />;
}`}</code>
        </pre>
        <p className="cn-demo-note-aside">
          The provider lives at the root layout, so <code>/tasks</code> and{" "}
          <code>/tasks/[id]</code> share the same store. When W6 lands, every method
          gets replaced by a <code>fetch(&apos;/api/tasks&apos;, ...)</code> call;
          the component shapes don&apos;t change.
        </p>
      </DemoNote>
    </main>
  );
}
