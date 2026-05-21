// Server component — sets up the page chrome.
// Layout seeds <TaskStoreProvider initial={getTasks()}>. <TaskBoard />
// reads from the store and renders the drag-enabled kanban. v4's new
// piece is the dynamic /tasks/[id] route — each card is now a Link.

import { getTasks } from "@/lib/tasks";
import DemoNote from "@/components/DemoNote";
import Progression from "@/components/Progression";
import TaskBoard from "@/components/TaskBoard";

export const metadata = {
  title: "Tasks · Cadence v4",
  description:
    "Drag-enabled kanban whose cards link to dynamic per-task detail pages, pre-rendered via generateStaticParams.",
};

export default async function TasksPage() {
  // Count is server-rendered for first paint; live tasks come from the store.
  const tasks = getTasks();

  return (
    <main className="cn-page">
      <div className="cn-eyebrow">/tasks · v4 · cards link to detail pages</div>
      <h1 className="cn-h1">All tasks.</h1>
      <p className="cn-lede">
        v3&apos;s kanban + drag is still here, server-seeded into a writable
        client store the same way. What v4 adds is the dynamic{" "}
        <code>/tasks/[id]</code> route — every task card is now a{" "}
        <code>&lt;Link&gt;</code> to its own pre-rendered detail page, built
        at compile time via <code>generateStaticParams()</code>.
      </p>

      <Progression current={4} />

      <DemoNote title="Where the boundary is">
        <p>
          Same shape as v3. <code>app/layout.tsx</code> (server-rendered)
          calls <code>getTasks()</code> and passes it into{" "}
          <code>&lt;TaskStoreProvider initial=&#123;tasks&#125;&gt;</code>.
          Inside the provider, <code>&lt;TaskBoard /&gt;</code> reads the live
          tasks with <code>useTaskStore()</code> and renders{" "}
          <code>TaskFilter</code>, which now wraps each card in{" "}
          <code>&lt;Link href=&#123;`/tasks/$&#123;task.id&#125;`&#125;&gt;</code>.
          Clicking navigates to the static-built detail page; dragging mutates
          the store via <code>reorderTask</code>.
        </p>
      </DemoNote>

      <section className="cn-section">
        <div className="cn-section-tag">{tasks.length} tasks · filter + sort + drag live</div>
        <h2 className="cn-section-h">Filter, sort, and drag</h2>
        <TaskBoard />
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">the new piece in code</div>
        <h2 className="cn-section-h">generateStaticParams pre-renders every detail page</h2>
        <pre className="cn-code">
          <code>{`// app/tasks/[id]/page.tsx — SERVER component
import { getTasks, getTaskById } from "@/lib/tasks";

// Tells Next which dynamic params to pre-render at build time.
export async function generateStaticParams() {
  return getTasks().map((t) => ({ id: t.id }));
}

export default async function TaskDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = getTaskById(id);
  if (!task) notFound();
  return <TaskView task={task} />;
}

// components/TaskCard.tsx — now wrapped in <Link>
<Link href={\`/tasks/\${task.id}\`}>
  <article className="cn-task">...</article>
</Link>`}</code>
        </pre>
        <p className="cn-aside">
          Build runs <code>generateStaticParams()</code>, gets one entry per
          task, and renders a separate static HTML file at each URL —{" "}
          <code>/tasks/CDN-030.html</code>, <code>/tasks/CDN-031.html</code>,
          and so on. Click a card and you land on a page that&apos;s already
          on disk, no API call.
        </p>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">the trap to watch for</div>
        <h2 className="cn-section-h">When AI &quot;simplifies&quot; this badly</h2>
        <pre className="cn-code">
          <code>{`// The wrong fix — skip generateStaticParams, fetch on the client
"use client";
export default function TaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  useEffect(() => { setTask(getTasks().find(t => t.id === id)); }, [id]);
  if (!task) return <Skeleton />;
  return <TaskView task={task} />;
}

// You just turned a static HTML file into a client-fetch flicker.
// Also: the static export step crashes because the route isn't pre-rendered.`}</code>
        </pre>
        <p className="cn-aside">
          When AI sees a dynamic route and reaches for <code>useEffect</code>{" "}
          to load the task, that&apos;s the move to question. The whole reason
          v4 introduces <code>generateStaticParams()</code> is so every detail
          page ships as static HTML — no spinner, no fetch, no hydration cost
          for the read.
        </p>
      </section>
    </main>
  );
}
