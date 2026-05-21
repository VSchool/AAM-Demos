import Link from "next/link";
import Progression from "@/components/Progression";
import FeaturesStrip from "@/components/FeaturesStrip";
import ExpandableBento from "@/components/ExpandableBento";
import ExpandableTile from "@/components/ExpandableTile";
import { DemoV3 } from "@/components/VersionDemos";
import {
  DragDirectionDemo,
  FilterChipsDemo,
  FilesAddedDemo,
  ServerReadsDemo,
} from "@/components/V3DeepDive";

export default function Home() {
  return (
    <main className="cn-page">
      <div className="cn-eyebrow">State v3 · kanban + drag, store-backed</div>
      <h1 className="cn-h1">Cadence — drag a card, change its status.</h1>
      <p className="cn-lede">
        This is <strong>state v3 of 7</strong>. v2&apos;s server-rendered list
        graduates into a draggable kanban. <code>getTasks()</code> still runs
        on the server — now in <code>app/layout.tsx</code> — and seeds a
        writable client store via <code>&lt;TaskStoreProvider initial=&#123;tasks&#125;&gt;</code>.
        The board reads from the store, drag mutates the store, the view
        re-renders. Server owns the read; client owns the writes.
      </p>

      {/* tier-a-hero-block (auto-aligned with v6) */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "44px",
        }}
      >
        <Link
          href="/tasks"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "var(--neon)",
            color: "var(--ink)",
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "15px",
            letterSpacing: "0.01em",
            padding: "12px 22px 12px 18px",
            clipPath:
              "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)",
          }}
        >
          Open the board →
        </Link>
        <Link
          href="/about"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--on-canvas-muted)",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            padding: "12px 16px",
            border: "1px solid var(--hairline)",
          }}
        >
          About this demo →
        </Link>
      </div>

      <section className="cn-section cn-features-section">
        <div className="cn-section-tag">what this state ships</div>
        <h2 className="cn-section-h">The shape of this version, at a glance.</h2>
        <FeaturesStrip />
      </section>


      <Progression current={3} />

      <section className="cn-section">
        <div className="cn-section-tag">01 · The pattern</div>
        <h2 className="cn-section-h">
          Server seeds the store. Client mutates it.{" "}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.12em", marginLeft: "8px" }}>
            click any tile to expand
          </span>
        </h2>
        <ExpandableBento>
          <ExpandableTile
            className="span-6 row-2 cn-tile-pink"
            summary={
              <>
                <div className="cn-tile-meta">app/layout.tsx · server</div>
                <div>
                  <h3
                    className="cn-tile-title"
                    style={{ fontSize: "22px", lineHeight: 1.2 }}
                  >
                    <code>const initialTasks = getTasks()</code> ·{" "}
                    <code>&lt;TaskStoreProvider initial=&#123;initialTasks&#125;&gt;</code>
                  </h3>
                  <p
                    className="cn-tile-sub"
                    style={{ marginTop: "10px", fontSize: "13.5px" }}
                  >
                    The layout reads the data on the server and hands it to
                    the client provider as a serializable{" "}
                    <code>initial</code> prop. No re-fetch, no hydration cost
                    for the read itself.
                  </p>
                </div>
              </>
            }
          >
            <ServerReadsDemo />
            <pre className="cn-tile-code">
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
}`}</code>
            </pre>
            <p className="cn-tile-body-note">
              The provider wraps every route, so <code>/tasks</code> and{" "}
              <code>/tasks/[id]</code> share one store.
            </p>
          </ExpandableTile>

          <ExpandableTile
            className="span-6 row-2 cn-tile-yellow"
            summary={
              <>
                <div className="cn-tile-meta">lib/task-store.tsx · client</div>
                <div>
                  <h3
                    className="cn-tile-title"
                    style={{ fontSize: "22px", lineHeight: 1.2 }}
                  >
                    <code>&quot;use client&quot;</code> ·{" "}
                    <code>useState · useCallback</code>
                  </h3>
                  <p
                    className="cn-tile-sub"
                    style={{ marginTop: "10px", fontSize: "13.5px" }}
                  >
                    Receives <code>initial</code>, stores it in{" "}
                    <code>useState</code>, exposes{" "}
                    <code>reorderTask(...)</code> via Context.{" "}
                    <code>&lt;TaskBoard /&gt;</code> reads tasks with{" "}
                    <code>useTaskStore()</code>; drag handlers call
                    reorderTask, the store re-renders.
                  </p>
                </div>
              </>
            }
          >
            <DemoV3 />
            <pre className="cn-tile-code">
              <code>{`"use client";
export function TaskStoreProvider({ initial, children }) {
  const [tasks, setTasks] = useState(initial);

  const reorderTask = useCallback((id, status, beforeId) => {
    setTasks(prev => /* splice + status change */);
  }, []);

  return (
    <Ctx value={{ tasks, reorderTask }}>{children}</Ctx>
  );
}
export const useTaskStore = () => use(Ctx);`}</code>
            </pre>
            <Link href="/tasks" className="cn-tile-body-link">
              Try the board →
            </Link>
          </ExpandableTile>

          <ExpandableTile
            className="span-3 cn-tile-green"
            summary={
              <>
                <div className="cn-tile-meta">Drag direction</div>
                <div className="cn-tile-num">6×6</div>
                <div className="cn-tile-sub">column vs card target</div>
              </>
            }
          >
            <DragDirectionDemo />
          </ExpandableTile>

          <ExpandableTile
            className="span-3"
            summary={
              <>
                <div className="cn-tile-meta">Filter chips</div>
                <h3 className="cn-tile-title">7</h3>
                <p className="cn-tile-sub">try the chips below</p>
              </>
            }
          >
            <FilterChipsDemo />
          </ExpandableTile>

          <ExpandableTile
            className="span-3"
            summary={
              <>
                <div className="cn-tile-meta">Files added</div>
                <h3 className="cn-tile-title">2</h3>
                <p className="cn-tile-sub">click a file → its role</p>
              </>
            }
          >
            <FilesAddedDemo />
          </ExpandableTile>

          <ExpandableTile
            className="span-3"
            summary={
              <>
                <div className="cn-tile-meta">Server reads</div>
                <h3 className="cn-tile-title">1</h3>
                <p className="cn-tile-sub">click: 1 server, N client</p>
              </>
            }
          >
            <ServerReadsDemo />
          </ExpandableTile>
        </ExpandableBento>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">02 · The trap</div>
        <h2 className="cn-section-h">The wrong way to &quot;simplify&quot; this</h2>
        <div className="cn-bento">
          <div className="cn-tile span-12 cn-tile-dark">
            <div className="cn-tile-meta" style={{ color: "var(--pink)" }}>
              question this diff
            </div>
            <div>
              <h3 className="cn-tile-title" style={{ fontSize: "22px" }}>
                If AI drops the <code>initial</code> prop and fetches inside
                the provider, you just paid for v2 and got v1 back.
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "8px", fontSize: "14px" }}
              >
                Common &quot;cleanup&quot; suggestion: &quot;the provider
                doesn&apos;t need to receive tasks — just call{" "}
                <code>getTasks()</code> inside it with a <code>useEffect</code>.&quot;
                That logic is fine in plain React. In Next.js with a
                server/client split, it deletes the SSR benefit and
                reintroduces the loading flicker — just hidden one layer
                deeper inside the Context. Read every diff.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">03 · What lands next</div>
        <h2 className="cn-section-h">v4 — dynamic route for task detail</h2>
        <div className="cn-bento">
          <div className="cn-tile span-12 cn-tile-violet">
            <div className="cn-tile-meta">up next</div>
            <div>
              <h3 className="cn-tile-title" style={{ fontSize: "20px" }}>
                v4 adds <code>app/tasks/[id]/page.tsx</code> — a dynamic
                route. Each task card becomes a link to its own detail page.
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "8px", fontSize: "14px" }}
              >
                <code>generateStaticParams()</code> tells Next.js which IDs to
                pre-render at build time, so every detail page ships as static
                HTML in the export. Server components all the way down, no
                spinner, no API call.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
