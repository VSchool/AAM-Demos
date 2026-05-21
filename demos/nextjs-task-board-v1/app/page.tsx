"use client";

import { useState } from "react";
import Link from "next/link";
import Progression from "@/components/Progression";
import FeaturesStrip from "@/components/FeaturesStrip";
import ExpandableTile from "@/components/ExpandableTile";
import { DemoV1 } from "@/components/VersionDemos";
import {
  TasksLibDemo,
  LoadingDelayDemo,
  NewFileDemo,
  HooksDemo,
} from "@/components/V1DeepDive";

export default function Home() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const tileProps = (i: number) => ({
    isOpen: openIdx === i,
    onToggle: () => setOpenIdx((cur) => (cur === i ? null : i)),
  });
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


      <Progression current={1} />

      <section className="cn-section">
        <div className="cn-section-tag">
          01 · v1 deep-dive · client-side data{" "}
          <span className="cn-section-h-hint">click any tile to expand</span>
        </div>
        <h2 className="cn-section-h">The W5D1 pattern, transplanted into Next.js</h2>
        <div className="cn-bento">
          <ExpandableTile
            {...tileProps(0)}
            className="span-6 row-2 cn-tile-yellow"
            summary={
              <>
                <div className="cn-tile-meta">/tasks · client component</div>
                <div>
                  <h3
                    className="cn-tile-title"
                    style={{ fontSize: "26px", lineHeight: 1.1 }}
                  >
                    <code>&quot;use client&quot;</code> at the top.{" "}
                    <code>useEffect</code> loads from <code>lib/tasks.ts</code>. Skeleton
                    until it lands.
                  </h3>
                  <p
                    className="cn-tile-sub"
                    style={{ marginTop: "10px", fontSize: "14px" }}
                  >
                    The browser receives the static HTML for /tasks, hydrates React, fires
                    the effect, then re-renders with the data. The ~700&nbsp;ms flicker
                    is a teaching delay — the trade-off you&apos;re paying for staying on
                    the client.
                  </p>
                </div>
              </>
            }
          >
            <DemoV1 />
          </ExpandableTile>

          <ExpandableTile
            {...tileProps(1)}
            className="span-3 cn-tile-green"
            summary={
              <>
                <div className="cn-tile-meta">Tasks in lib</div>
                <div className="cn-tile-num">12</div>
                <p className="cn-tile-sub">peek inside lib/tasks.ts</p>
              </>
            }
          >
            <TasksLibDemo />
          </ExpandableTile>

          <ExpandableTile
            {...tileProps(2)}
            className="span-3 cn-tile-pink"
            summary={
              <>
                <div className="cn-tile-meta">Loading delay</div>
                <div className="cn-tile-num">700ms</div>
                <p className="cn-tile-sub">drag the slider, watch the spinner</p>
              </>
            }
          >
            <LoadingDelayDemo />
          </ExpandableTile>

          <ExpandableTile
            {...tileProps(3)}
            className="span-3"
            summary={
              <>
                <div className="cn-tile-meta">New file</div>
                <h3 className="cn-tile-title">lib/tasks.ts</h3>
                <p className="cn-tile-sub">toggle: source · shape</p>
              </>
            }
          >
            <NewFileDemo />
          </ExpandableTile>

          <ExpandableTile
            {...tileProps(4)}
            className="span-3"
            summary={
              <>
                <div className="cn-tile-meta">New hooks</div>
                <h3 className="cn-tile-title">useState · useEffect</h3>
                <p className="cn-tile-sub">click each to see its role</p>
              </>
            }
          >
            <HooksDemo />
          </ExpandableTile>
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
