import Link from "next/link";
import Progression from "@/components/Progression";
import FeaturesStrip from "@/components/FeaturesStrip";
import ExpandableBento from "@/components/ExpandableBento";
import ExpandableTile from "@/components/ExpandableTile";
import FeatureCallout from "@/components/FeatureCallout";
import { DemoV2 } from "@/components/VersionDemos";
import {
  HooksRemovedDemo,
  LoadingDiffDemo,
  CallerSwitchDemo,
  AsyncFunctionDemo,
} from "@/components/V2DeepDive";

export default function Home() {
  return (
    <main className="cn-page">
      <div className="cn-eyebrow">State v2 · server component</div>
      <h1 className="cn-h1">Cadence — the task list, server-rendered.</h1>
      <p className="cn-lede">
        This is <strong>state v2 of 7</strong>. Everything that made v1&apos;s{" "}
        <code>/tasks</code> page a client component is gone. No{" "}
        <code>&quot;use client&quot;</code>. No <code>useState</code>. No{" "}
        <code>useEffect</code>. No skeleton. <code>/tasks</code> is now an{" "}
        <code>async</code> function that reads <code>lib/tasks.ts</code> directly at build
        time and renders the list. The HTML you receive already contains every task.
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


      <Progression current={2} />

      <section className="cn-section" style={{ position: "relative" }}>
        <div className="cn-section-tag">01 · The diff from v1</div>
        <h2 className="cn-section-h">
          Fewer lines, fewer concepts, faster page{" "}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.12em", marginLeft: "8px" }}>
            click any tile to expand
          </span>
        </h2>
        <div style={{ position: "absolute", top: "18px", right: "18px" }}>
          <FeatureCallout
            title="Bento that morphs as it expands"
            description={
              <>
                Click any tile below — it grows and reveals more content; the
                other tiles shrink to make room. The grid animates smoothly
                between layouts instead of snapping. Only one tile is open at
                a time. v2 introduces this; v3 – v6 all use it.
              </>
            }
            snippet={`Build a bento-style grid of cards in React. Clicking any
card expands it to a larger size and reveals extra content,
while the other cards shrink to a compact summary state. Only
one card can be open at a time; clicking the open card closes
it and returns the grid to its default layout.

When a card opens or closes, the transition between the two
layouts should animate smoothly — every card slides and
resizes into its new position instead of snapping. Use the
View Transitions API (document.startViewTransition) so the
browser interpolates positions and sizes between the old and
new layout. Give each card a unique view-transition-name so
the browser can match it across the state change.

Fall back gracefully in browsers that don't support View
Transitions — just update state without the animation.`}
            side="left"
          />
        </div>
        <ExpandableBento>
          <ExpandableTile
            className="span-6 row-2 cn-tile-green"
            summary={
              <>
                <div className="cn-tile-meta">/tasks · async server component</div>
                <div>
                  <h3
                    className="cn-tile-title"
                    style={{ fontSize: "26px", lineHeight: 1.1 }}
                  >
                    <code>const tasks = getTasks()</code> at the top of an{" "}
                    <code>async</code> page. That&apos;s it.
                  </h3>
                  <p
                    className="cn-tile-sub"
                    style={{ marginTop: "10px", fontSize: "14px" }}
                  >
                    The page function runs on the server — at build time for
                    this static export — and renders to HTML before anything
                    ships. The browser receives a complete document. No
                    hydration round-trip for the list.
                  </p>
                </div>
              </>
            }
          >
            <DemoV2 />
            <pre className="cn-tile-code">
              <code>{`// app/tasks/page.tsx — server component
import { getTasks } from "@/lib/tasks";

export default async function TasksPage() {
  const tasks = getTasks();   // runs on the server
  return (
    <ul>
      {tasks.map(t => <TaskCard key={t.id} task={t} />)}
    </ul>
  );
}`}</code>
            </pre>
            <p className="cn-tile-body-note">
              No <code>&quot;use client&quot;</code>, no hooks, no skeleton —
              the HTML is rendered before the bundle ships.
            </p>
            <Link href="/tasks" className="cn-tile-body-link">
              See /tasks →
            </Link>
          </ExpandableTile>

          <ExpandableTile
            className="span-3 cn-tile-yellow"
            summary={
              <>
                <div className="cn-tile-meta">Hooks removed</div>
                <div className="cn-tile-num">2</div>
                <div className="cn-tile-sub">toggle v1 / v2</div>
              </>
            }
          >
            <HooksRemovedDemo />
          </ExpandableTile>

          <ExpandableTile
            className="span-3 cn-tile-pink"
            summary={
              <>
                <div className="cn-tile-meta">Loading delay</div>
                <div className="cn-tile-num">0ms</div>
                <div className="cn-tile-sub">client vs server</div>
              </>
            }
          >
            <LoadingDiffDemo />
          </ExpandableTile>

          <ExpandableTile
            className="span-3"
            summary={
              <>
                <div className="cn-tile-meta">What stayed</div>
                <h3 className="cn-tile-title">lib/tasks.ts</h3>
                <p className="cn-tile-sub">click: who calls it now?</p>
              </>
            }
          >
            <CallerSwitchDemo />
          </ExpandableTile>

          <ExpandableTile
            className="span-3"
            summary={
              <>
                <div className="cn-tile-meta">What landed</div>
                <h3 className="cn-tile-title">async function</h3>
                <p className="cn-tile-sub">click each part to highlight</p>
              </>
            }
          >
            <AsyncFunctionDemo />
          </ExpandableTile>
        </ExpandableBento>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">02 · The catch</div>
        <h2 className="cn-section-h">
          Server components can&apos;t use hooks{" "}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.12em", marginLeft: "8px" }}>
            click the tile to expand
          </span>
        </h2>
        <ExpandableBento>
          <ExpandableTile
            className="span-12 cn-tile-dark"
            summary={
              <>
                <div className="cn-tile-meta" style={{ color: "var(--neon)" }}>
                  the boundary
                </div>
                <div>
                  <h3 className="cn-tile-title" style={{ fontSize: "22px" }}>
                    Server components can&apos;t use <code>useState</code>,{" "}
                    <code>useEffect</code>, event handlers, or browser APIs.
                  </h3>
                  <p
                    className="cn-tile-sub"
                    style={{ marginTop: "8px", fontSize: "14px" }}
                  >
                    Anything interactive — a filter, a sort, a drag, a form — has to go
                    inside a component marked <code>&quot;use client&quot;</code>. v3 keeps
                    this server-rendered list as the data source and wraps a client component
                    around it for the filter. Server owns the read, client owns the
                    interaction.
                  </p>
                </div>
              </>
            }
          >
            <p>
              The fastest way to feel the boundary: try to add{" "}
              <code>onClick</code> directly to this page.{" "}
              <strong>Next.js will throw at build time.</strong>
            </p>
            <pre className="cn-tile-code">
              <code>{`// app/tasks/page.tsx — server component
export default async function TasksPage() {
  const tasks = getTasks();
  return (
    <ul>
      {tasks.map(t => (
        <li onClick={() => alert(t.id)}>   {/* ❌ build error */}
          {t.title}
        </li>
      ))}
    </ul>
  );
}`}</code>
            </pre>
            <p>
              Move the interactive piece into its own file with{" "}
              <code>&quot;use client&quot;</code> at the top and import it
              from the server component. The server still renders the list;
              the client wraps the parts that need state or events.
            </p>
            <ul style={{ fontSize: "13.5px", lineHeight: 1.6, paddingLeft: "1.2em", margin: 0 }}>
              <li>
                <strong>Allowed in server components:</strong> async/await,{" "}
                direct file/DB reads, environment secrets, fetch with caching.
              </li>
              <li>
                <strong>Requires <code>&quot;use client&quot;</code>:</strong>{" "}
                hooks, event handlers, refs, browser APIs (window, localStorage), Context.
              </li>
            </ul>
          </ExpandableTile>
        </ExpandableBento>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">03 · What lands next</div>
        <h2 className="cn-section-h">
          v3 — kanban + drag, store-backed{" "}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.12em", marginLeft: "8px" }}>
            click the tile to expand
          </span>
        </h2>
        <ExpandableBento>
          <ExpandableTile
            className="span-12 cn-tile-violet"
            summary={
              <>
                <div className="cn-tile-meta">up next</div>
                <div>
                  <h3 className="cn-tile-title" style={{ fontSize: "20px" }}>
                    v3 turns the static list into a draggable kanban. The data
                    still comes from <code>getTasks()</code> on the server, but
                    it&apos;s now seeded into a writable client store so drag can
                    mutate task status without re-fetching.
                  </h3>
                  <p
                    className="cn-tile-sub"
                    style={{ marginTop: "8px", fontSize: "14px" }}
                  >
                    The teaching point: the server still owns the read. The
                    handoff just moves from a JSX prop into a Context provider —
                    because drag-and-drop needs the data to be writable. Same
                    principle as v2, different mechanism.
                  </p>
                </div>
              </>
            }
          >
            <p>
              v3 keeps the server-rendered list and adds a{" "}
              <code>TaskStoreProvider</code> at the layout level. The provider
              seeds itself from <code>getTasks()</code> on the server, then
              exposes a writable copy to every client component below it.
            </p>
            <pre className="cn-tile-code">
              <code>{`// app/layout.tsx — server component
import { getTasks } from "@/lib/tasks";
import { TaskStoreProvider } from "@/lib/task-store";

export default function RootLayout({ children }) {
  const initial = getTasks();         // server read
  return (
    <html><body>
      <TaskStoreProvider initial={initial}>
        {children}                    {/* drag mutates the store */}
      </TaskStoreProvider>
    </body></html>
  );
}`}</code>
            </pre>
            <p>
              Drag-and-drop, filter, and sort all read and write through{" "}
              <code>useTaskStore()</code>. No network round-trip — every
              interaction stays in the browser. The server&apos;s job is just
              the initial seed.
            </p>
            <Link href="/tasks" className="cn-tile-body-link">
              See the static v2 list →
            </Link>
          </ExpandableTile>
        </ExpandableBento>
      </section>
    </main>
  );
}
