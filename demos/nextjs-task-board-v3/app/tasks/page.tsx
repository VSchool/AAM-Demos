// Server component — sets up the page chrome.
// The layout (also a server component) calls getTasks() and seeds
// <TaskStoreProvider initial={...}>. <TaskBoard /> reads live tasks
// from the store via useTaskStore() and renders the drag-enabled kanban.

import { getTasks } from "@/lib/tasks";
import DemoNote from "@/components/DemoNote";
import FeatureCallout from "@/components/FeatureCallout";
import Progression from "@/components/Progression";
import TaskBoard from "@/components/TaskBoard";

export const metadata = {
  title: "Tasks · Cadence v3",
  description:
    "Server-seeded client store backing a draggable kanban. Server owns the initial read; client owns the interaction.",
};

export default async function TasksPage() {
  // The count below is server-rendered for first paint. The live tasks
  // (which drag mutates) come from the store inside <TaskBoard />.
  const tasks = getTasks();

  return (
    <main className="cn-page">
      <div className="cn-eyebrow">/tasks · v3 · kanban + drag, store-backed</div>
      <h1 className="cn-h1">All tasks.</h1>
      <p className="cn-lede">
        v3 turns the static list into a draggable kanban. The data still
        starts on the server — <code>getTasks()</code> runs in{" "}
        <code>app/layout.tsx</code> and gets handed to a{" "}
        <code>TaskStoreProvider</code>. From there it lives in a writable
        client store, so drag-and-drop can mutate task status without
        re-fetching anything.
      </p>

      <Progression current={3} />

      <DemoNote title="Where the boundary is now">
        <p>
          The boundary still exists, just in a different shape than v2.{" "}
          <code>app/layout.tsx</code> (server-rendered) calls{" "}
          <code>getTasks()</code> and passes the array into{" "}
          <code>&lt;TaskStoreProvider initial=&#123;tasks&#125;&gt;</code>.
          Everything inside the provider is client-side.{" "}
          <code>&lt;TaskBoard /&gt;</code> calls <code>useTaskStore()</code>{" "}
          to read the live tasks; <code>TaskFilter</code> does the same to
          call <code>reorderTask(...)</code> when a card is dropped. Server
          still owns the initial read; client owns the interaction — same
          principle as v2, just routed through Context instead of a JSX prop
          because drag-and-drop needs the data to be writable.
        </p>
      </DemoNote>

      <section className="cn-section">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          <FeatureCallout
            title="HTML5 drag-and-drop kanban"
            description={
              <>
                Grab any card and drag it into another column to change its
                status. Drop it where you want — the column accepts the card
                and the task moves there. Works with mouse and trackpad, no
                third-party library. v3 is where this is introduced.
              </>
            }
            snippet={`Build a kanban board in React with columns for each
status and task cards inside them. Make each card draggable
so the user can pick it up and drop it into a different
column to change its status. Use the native HTML5
drag-and-drop API — no third-party libraries.

When a card is dropped on a column, update that task's
status to the destination column's status in the underlying
store. Show a 'grabbing' cursor while a card is being
dragged, and give the destination column a subtle highlight
while a draggable card is hovering over it so the user knows
the drop will land.`}
            side="bottom"
          />
          <div className="cn-section-tag" style={{ marginBottom: 0 }}>
            {tasks.length} tasks · filter + sort + drag live
          </div>
        </div>
        <h2 className="cn-section-h">Filter, sort, and drag</h2>
        <TaskBoard />
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">the boundary in code</div>
        <h2 className="cn-section-h">Three files. One handoff.</h2>
        <pre className="cn-code">
          <code>{`// app/layout.tsx — SERVER component
import { getTasks } from "@/lib/tasks";
import { TaskStoreProvider } from "@/lib/task-store";

export default function RootLayout({ children }) {
  const initialTasks = getTasks();   // runs on the server
  return (
    <html><body>
      <TaskStoreProvider initial={initialTasks}>
        {children}
      </TaskStoreProvider>
    </body></html>
  );
}

// lib/task-store.tsx — CLIENT context
"use client";
export function TaskStoreProvider({ initial, children }) {
  const [tasks, setTasks] = useState(initial);   // hydrated from server
  const reorderTask = (id, status, beforeId) => { /* ... */ };
  return <Ctx value={{ tasks, reorderTask }}>{children}</Ctx>;
}

// components/TaskBoard.tsx — CLIENT
"use client";
export default function TaskBoard() {
  const { tasks } = useTaskStore();
  return <TaskFilter tasks={tasks} />;
}`}</code>
        </pre>
        <p className="cn-aside">
          The handoff: the layout (server) renders the provider (client) and
          passes the data as a prop named <code>initial</code>. The provider
          stores it in <code>useState</code>, exposes a writable API via
          Context, and every descendant reads from there. Same SSR-on-first-
          paint result as v2, but the data is now mutable — which is what drag
          needs.
        </p>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">the trap to watch for</div>
        <h2 className="cn-section-h">When AI &quot;simplifies&quot; this badly</h2>
        <pre className="cn-code">
          <code>{`// The wrong fix — initialize the store from scratch in the client
"use client";
export function TaskStoreProvider({ children }) {
  const [tasks, setTasks] = useState([]);    // empty on first paint!
  useEffect(() => { setTasks(getTasks()); }, []);
  // ...
}

// app/layout.tsx — drop the initial prop entirely
<TaskStoreProvider>{children}</TaskStoreProvider>

// First paint ships an empty board. Tasks pop in after hydration.
// Same flicker you killed in v2, just hidden behind a Context.`}</code>
        </pre>
        <p className="cn-aside">
          When AI sees a Context provider and decides to &quot;clean up&quot;
          by dropping the <code>initial</code> prop, that&apos;s the move to
          question. The provider needs server-seeded data on mount, otherwise
          you&apos;re back to the v1 client-fetch flicker — just one
          abstraction deeper.
        </p>
      </section>
    </main>
  );
}
