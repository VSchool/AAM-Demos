import Progression from "@/components/Progression";
import ExpandableTile from "@/components/ExpandableTile";
import ExpandableBento from "@/components/ExpandableBento";
import { DemoV0, DemoV1, DemoV2 } from "@/components/VersionDemos";

export const metadata = {
  title: "About · Cadence v2",
  description:
    "What this progressive demo is and what each of the seven states adds. Part of Applied AI Mastery, Week 5 Day 3.",
};

export default function AboutPage() {
  return (
    <main className="cn-page">
      <div className="cn-eyebrow">/about · the demo</div>
      <h1 className="cn-h1">Seven states, one task board.</h1>
      <p className="cn-lede">
        Cadence is a Next.js task-board demo built in seven progressive states (v0 → v6).
        Each state adds <strong>one Next.js concept</strong> to the previous one. Each
        tile below expands to a tiny interactive demo of what that version introduced.
      </p>

      <Progression current={2} />

      <section className="cn-section">
        <div className="cn-section-tag">
          the seven states <span className="cn-section-h-hint">click any unlocked tile to try it</span>
        </div>
        <h2 className="cn-section-h">What each version adds</h2>
        <ExpandableBento>
          <ExpandableTile
            className="span-12 cn-tile-yellow"
            summary={
              <>
                <div className="cn-tile-meta">v2 · you are here</div>
                <div>
                  <h3 className="cn-tile-title" style={{ fontSize: "20px" }}>
                    Server list — same UI as v1, no spinner. HTML arrives populated.
                  </h3>
                  <p className="cn-tile-sub" style={{ marginTop: "6px", fontSize: "13.5px" }}>
                    <code>/tasks</code> becomes an <code>async</code> server component.
                    No <code>&quot;use client&quot;</code>, no <code>useEffect</code>, no
                    skeleton. The data is read at build time.
                  </p>
                </div>
              </>
            }
          >
            <DemoV2 />
          </ExpandableTile>

          <ExpandableTile
            className="span-4"
            summary={
              <>
                <div className="cn-tile-meta">v0 · done</div>
                <h3 className="cn-tile-title" style={{ fontSize: "16px" }}>scaffold + file routing</h3>
                <p className="cn-tile-sub" style={{ marginTop: "4px", fontSize: "12.5px" }}>
                  Drop a <code>page.tsx</code> into a folder, get a URL.
                </p>
              </>
            }
          >
            <DemoV0 />
          </ExpandableTile>

          <ExpandableTile
            className="span-4"
            summary={
              <>
                <div className="cn-tile-meta">v1 · done</div>
                <h3 className="cn-tile-title" style={{ fontSize: "16px" }}>client list</h3>
                <p className="cn-tile-sub" style={{ marginTop: "4px", fontSize: "12.5px" }}>
                  <code>useState</code> + <code>useEffect</code>, a spinner, then data.
                </p>
              </>
            }
          >
            <DemoV1 />
          </ExpandableTile>

          <ExpandableTile
            className="span-4 cn-tile-soon"
            summary={
              <>
                <div className="cn-tile-meta">v3</div>
                <h3 className="cn-tile-title">Coming Soon</h3>
              </>
            }
          >
            <p>Coming Soon.</p>
          </ExpandableTile>

          <ExpandableTile
            className="span-4 cn-tile-soon"
            summary={
              <>
                <div className="cn-tile-meta">v4</div>
                <h3 className="cn-tile-title">Coming Soon</h3>
              </>
            }
          >
            <p>Coming Soon.</p>
          </ExpandableTile>

          <ExpandableTile
            className="span-4 cn-tile-soon"
            summary={
              <>
                <div className="cn-tile-meta">v5</div>
                <h3 className="cn-tile-title">Coming Soon</h3>
              </>
            }
          >
            <p>Coming Soon.</p>
          </ExpandableTile>

          <ExpandableTile
            className="span-4 cn-tile-soon"
            summary={
              <>
                <div className="cn-tile-meta">v6</div>
                <h3 className="cn-tile-title">Coming Soon</h3>
              </>
            }
          >
            <p>Coming Soon.</p>
          </ExpandableTile>
        </ExpandableBento>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">why no backend in this week</div>
        <h2 className="cn-section-h">Week 5 teaches architecture. Week 6 teaches backend.</h2>
        <div className="cn-bento">
          <div className="cn-tile span-12 cn-tile-dark">
            <div className="cn-tile-meta" style={{ color: "var(--neon)" }}>
              the W5/W6 boundary
            </div>
            <div>
              <p className="cn-tile-sub" style={{ fontSize: "14px", opacity: 0.9, lineHeight: 1.55 }}>
                Every state here deploys as a <strong>static export</strong> to GitHub
                Pages. Server components in v2/v3 are evaluated at build time, not at
                request time — the rendered HTML is what the browser receives. The{" "}
                <code>lib/tasks.ts</code> file is a typed array, not an API call. v5&apos;s
                &quot;CRUD&quot; is a UI pattern over local in-memory state. Real backends — API
                routes that run on a server, persistence, auth — that&apos;s the entire focus of
                Week 6. The architecture you learn here is what plugs into that backend
                next week.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
