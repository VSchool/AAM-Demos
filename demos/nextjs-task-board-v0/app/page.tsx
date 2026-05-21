"use client";

import { useState } from "react";
import Link from "next/link";
import Progression from "@/components/Progression";
import FeaturesStrip from "@/components/FeaturesStrip";
import FeatureCallout from "@/components/FeatureCallout";
import ExpandableTile from "@/components/ExpandableTile";
import { DemoV0 } from "@/components/VersionDemos";
import {
  RoutesDemo,
  UpcomingDemo,
  FrameworkDemo,
  BuildTargetDemo,
} from "@/components/V0DeepDive";

export default function Home() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const tileProps = (i: number) => ({
    isOpen: openIdx === i,
    onToggle: () => setOpenIdx((cur) => (cur === i ? null : i)),
  });
  return (
    <main className="cn-page">
      <div className="cn-eyebrow">State v0 · scaffold</div>
      <h1 className="cn-h1">Cadence — a team task board, scaffolded in Next.js.</h1>
      <p className="cn-lede">
        This is <strong>state v0 of 7</strong>. The shell is up: a Next.js project with the
        App Router, three pages wired via file-based routing, and the shared Cadence look. No
        data yet, no client/server distinction yet, no dynamic routes yet — those land in v1
        through v6. Use this state to see how file structure becomes URL structure.
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

      <section className="cn-section cn-features-section" style={{ position: "relative" }}>
        <div className="cn-section-tag">what this state ships</div>
        <h2 className="cn-section-h">The shape of this version, at a glance.</h2>
        <div style={{ position: "absolute", top: "92px", left: "-30px", zIndex: 2 }}>
          <FeatureCallout
            title="Hover-driven word strip"
            description={
              <>
                Hover over a word and it lights up while a short caption
                appears next to it. Move to another word and the highlight
                follows you. Works with keyboard tabbing too — focus a
                word and the same thing happens.
              </>
            }
            snippet={`Build a vertical list of words in React. When the
user hovers over a word — or focuses it with the keyboard —
highlight that word in a bright color and fade in a short
caption next to it. Only one word can be active at a time;
moving to another word moves the highlight.

Make each word a focusable button so keyboard tabbing works
the same as hover. Track the active word's index in a single
piece of state, and let CSS handle the color swap and caption
reveal based on which one is currently active.`}
            side="right"
          />
        </div>
        <FeaturesStrip />
      </section>


      <Progression current={0} />

      <section className="cn-section">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          <div className="cn-section-tag" style={{ marginBottom: 0 }}>
            01 · The three routes
          </div>
        </div>
        <h2 className="cn-section-h">File structure = URL structure</h2>
        <div className="cn-routes">
          <Link href="/" className="cn-route">
            <div className="cn-route-path">/</div>
            <h3 className="cn-route-title">Home</h3>
            <p className="cn-route-desc">
              You are here. The marketing-ish landing page for the demo, anchoring you in
              where this progressive state sits.
            </p>
            <div className="cn-route-file">app/page.tsx</div>
          </Link>
          <Link href="/tasks" className="cn-route">
            <div className="cn-route-path">/tasks</div>
            <h3 className="cn-route-title">Tasks</h3>
            <p className="cn-route-desc">
              The future home of the task list. In v0 it renders an empty state — there is
              no data layer yet. v1 fills it in with the React patterns from Day 1.
            </p>
            <div className="cn-route-file">app/tasks/page.tsx</div>
          </Link>
          <Link href="/about" className="cn-route">
            <div className="cn-route-path">/about</div>
            <h3 className="cn-route-title">About</h3>
            <p className="cn-route-desc">
              What this demo is, what each progressive state adds, and how it maps to the
              Day 3 curriculum.
            </p>
            <div className="cn-route-file">app/about/page.tsx</div>
          </Link>
        </div>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">
          02 · v0 deep-dive · file-based routing{" "}
          <span className="cn-section-h-hint">click any tile to expand</span>
        </div>
        <h2 className="cn-section-h">The shape of an App Router project</h2>
        <div className="cn-bento">
          <ExpandableTile
            {...tileProps(0)}
            className="span-6 row-2 cn-tile-yellow"
            summary={
              <>
                <div className="cn-tile-meta">No router config needed</div>
                <div>
                  <h3 className="cn-tile-title" style={{ fontSize: "26px", lineHeight: 1.1 }}>
                    Drop a <code>page.tsx</code> into a folder. That folder becomes the URL.
                  </h3>
                  <p className="cn-tile-sub" style={{ marginTop: "10px", fontSize: "14px" }}>
                    <code>app/tasks/page.tsx</code> renders at <code>/tasks</code>. No router
                    array, no path strings to keep in sync, no manual matching.
                  </p>
                </div>
              </>
            }
          >
            <DemoV0 />
          </ExpandableTile>

          <ExpandableTile
            {...tileProps(1)}
            className="span-3 cn-tile-green"
            summary={
              <>
                <div className="cn-tile-meta">3 routes</div>
                <div className="cn-tile-num">3</div>
                <p className="cn-tile-sub">click a file → URL</p>
              </>
            }
          >
            <RoutesDemo />
          </ExpandableTile>

          <ExpandableTile
            {...tileProps(2)}
            className="span-3 cn-tile-pink"
            summary={
              <>
                <div className="cn-tile-meta">States to go</div>
                <div className="cn-tile-num">6</div>
                <p className="cn-tile-sub">step through v1 → v6</p>
              </>
            }
          >
            <UpcomingDemo />
          </ExpandableTile>

          <ExpandableTile
            {...tileProps(3)}
            className="span-3"
            summary={
              <>
                <div className="cn-tile-meta">Framework</div>
                <h3 className="cn-tile-title">Next.js 16 · App Router</h3>
                <p className="cn-tile-sub">click each: Next · React · TS</p>
              </>
            }
          >
            <FrameworkDemo />
          </ExpandableTile>

          <ExpandableTile
            {...tileProps(4)}
            className="span-3"
            summary={
              <>
                <div className="cn-tile-meta">Build target</div>
                <h3 className="cn-tile-title">Static export</h3>
                <p className="cn-tile-sub">run <code>next build</code></p>
              </>
            }
          >
            <BuildTargetDemo />
          </ExpandableTile>
        </div>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">03 · What lands next</div>
        <h2 className="cn-section-h">v1 — the React pattern you already know</h2>
        <div className="cn-bento">
          <div className="cn-tile span-12 cn-tile-dark">
            <div className="cn-tile-meta" style={{ color: "var(--neon)" }}>
              up next
            </div>
            <div>
              <h3 className="cn-tile-title" style={{ fontSize: "22px" }}>
                v1 brings the data layer — but with <code>useState</code> + <code>useEffect</code>, the way you wrote it on Day 1.
              </h3>
              <p className="cn-tile-sub" style={{ marginTop: "8px", fontSize: "14px" }}>
                v1 imports tasks from <code>lib/tasks.ts</code> on the client and renders
                them. v2 then converts the same page to a server component so you can see
                the contrast directly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
