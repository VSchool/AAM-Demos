import Link from "next/link";
import Progression from "@/components/Progression";

export default function Home() {
  return (
    <main className="cn-page">
      <div className="cn-eyebrow">State v1 · client-side data</div>
      <h1 className="cn-h1">Cadence — the task list arrives, the React way.</h1>
      <p className="cn-lede">
        This is <strong>state v1 of 7</strong>. The scaffold from v0 is still here. What's
        new: <code>lib/tasks.ts</code> ships a typed task array, and <code>/tasks</code>{" "}
        now renders that array using the W5D1 React pattern — <code>useState</code>,{" "}
        <code>useEffect</code>, a loading skeleton while the data is &quot;fetched.&quot;{" "}
        It&apos;s the same client-side dance you wrote on Day 1, dropped into a Next.js
        page. v2 replaces all of it.
      </p>

      <Progression current={1} />

      <section className="cn-section">
        <div className="cn-section-tag">01 · What v1 added</div>
        <h2 className="cn-section-h">The W5D1 pattern, transplanted into Next.js</h2>
        <div className="cn-bento">
          <div className="cn-tile span-6 row-2 cn-tile-yellow">
            <div className="cn-tile-meta">/tasks · client component</div>
            <div>
              <h3
                className="cn-tile-title"
                style={{ fontSize: "26px", lineHeight: 1.1 }}
              >
                <code>&quot;use client&quot;</code> at the top. <code>useEffect</code>{" "}
                loads from <code>lib/tasks.ts</code>. Skeleton until it lands.
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "10px", fontSize: "14px" }}
              >
                The browser receives the static HTML for /tasks, hydrates React, fires the
                effect, then re-renders with the data. The ~700&nbsp;ms flicker you see is
                a teaching delay — it&apos;s the trade-off you&apos;re paying for staying
                on the client.
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
          <div className="cn-tile span-3 cn-tile-green">
            <div className="cn-tile-meta">Tasks in lib</div>
            <div className="cn-tile-num">12</div>
          </div>
          <div className="cn-tile span-3 cn-tile-pink">
            <div className="cn-tile-meta">Loading delay</div>
            <div className="cn-tile-num">700ms</div>
          </div>
          <div className="cn-tile span-3">
            <div className="cn-tile-meta">New file</div>
            <h3 className="cn-tile-title">lib/tasks.ts</h3>
            <p className="cn-tile-sub">Typed task array + getTasks() reader.</p>
          </div>
          <div className="cn-tile span-3">
            <div className="cn-tile-meta">New hooks</div>
            <h3 className="cn-tile-title">useState · useEffect</h3>
            <p className="cn-tile-sub">Both fire only in the browser, not at build.</p>
          </div>
        </div>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">02 · The pattern in shorthand</div>
        <h2 className="cn-section-h">What /tasks is doing right now</h2>
        <pre className="cn-code">
          <code>{`"use client";

const [tasks, setTasks] = useState(null);

useEffect(() => {
  setTasks(getTasks());     // imported from lib/tasks.ts
}, []);

if (tasks === null) return <Skeleton />;
return <List items={tasks} />;`}</code>
        </pre>
        <p className="cn-aside">
          Three React hooks, one conditional render. Familiar. v2 deletes every line of
          this and replaces it with a single <code>const tasks = getTasks()</code> inside
          an <code>async</code> server component — no flicker, no hydration cost for the
          list itself.
        </p>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">03 · What lands next</div>
        <h2 className="cn-section-h">v2 — same data, server component</h2>
        <div className="cn-bento">
          <div className="cn-tile span-12 cn-tile-dark">
            <div className="cn-tile-meta" style={{ color: "var(--neon)" }}>
              up next
            </div>
            <div>
              <h3 className="cn-tile-title" style={{ fontSize: "22px" }}>
                v2 lifts the data read off the client and onto the server. No{" "}
                <code>&quot;use client&quot;</code>. No <code>useEffect</code>. No
                skeleton. The HTML the browser receives already contains the list.
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "8px", fontSize: "14px" }}
              >
                For a static export like this one, the server-component evaluation happens
                at <strong>build time</strong> — the data is baked into the deployed HTML.
                For a server-rendered Next.js deployment, it would happen at request time.
                Same code either way.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
