import Link from "next/link";
import Progression from "@/components/Progression";

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

      <Progression current={2} />

      <section className="cn-section">
        <div className="cn-section-tag">01 · The diff from v1</div>
        <h2 className="cn-section-h">Fewer lines, fewer concepts, faster page</h2>
        <div className="cn-bento">
          <div className="cn-tile span-6 row-2 cn-tile-green">
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
                The page function runs on the server — at build time for this static
                export — and renders to HTML before anything ships. The browser receives
                a complete document. No hydration round-trip for the list.
              </p>
              <div style={{ marginTop: "16px" }}>
                <Link
                  href="/tasks"
                  style={{ textDecoration: "underline", fontWeight: 600 }}
                >
                  See /tasks →
                </Link>
              </div>
            </div>
          </div>
          <div className="cn-tile span-3 cn-tile-yellow">
            <div className="cn-tile-meta">Hooks removed</div>
            <div className="cn-tile-num">2</div>
            <div className="cn-tile-sub">useState · useEffect</div>
          </div>
          <div className="cn-tile span-3 cn-tile-pink">
            <div className="cn-tile-meta">Loading delay</div>
            <div className="cn-tile-num">0ms</div>
          </div>
          <div className="cn-tile span-3">
            <div className="cn-tile-meta">What stayed</div>
            <h3 className="cn-tile-title">lib/tasks.ts</h3>
            <p className="cn-tile-sub">The data file. Untouched.</p>
          </div>
          <div className="cn-tile span-3">
            <div className="cn-tile-meta">What landed</div>
            <h3 className="cn-tile-title">async function</h3>
            <p className="cn-tile-sub">
              Server components can be <code>async</code> and use top-level await.
            </p>
          </div>
        </div>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">02 · The catch</div>
        <h2 className="cn-section-h">Server components can&apos;t use hooks</h2>
        <div className="cn-bento">
          <div className="cn-tile span-12 cn-tile-dark">
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
          </div>
        </div>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">03 · What lands next</div>
        <h2 className="cn-section-h">v3 — client filter wraps server list</h2>
        <div className="cn-bento">
          <div className="cn-tile span-12 cn-tile-violet">
            <div className="cn-tile-meta">up next</div>
            <div>
              <h3 className="cn-tile-title" style={{ fontSize: "20px" }}>
                v3 adds <code>TaskFilter.tsx</code> — a client component with{" "}
                <code>&quot;use client&quot;</code> at the top, state for the active
                filter, and a slice of the server-rendered list passed in as a prop.
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "8px", fontSize: "14px" }}
              >
                The teaching point: the server component still owns the data fetch. The
                client component receives the array as a prop and decides what to show.
                If you lift the data fetch into the client component, you&apos;ve
                undone the entire reason v2 exists.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
