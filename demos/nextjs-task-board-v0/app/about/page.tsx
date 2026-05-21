import Progression from "@/components/Progression";
import ExpandableTile from "@/components/ExpandableTile";
import { DemoV0 } from "@/components/VersionDemos";

export const metadata = {
  title: "About · Cadence v0",
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

      <Progression current={0} />

      <section className="cn-section">
        <div className="cn-section-tag">
          the seven states <span className="cn-section-h-hint">click any unlocked tile to try it</span>
        </div>
        <h2 className="cn-section-h">What each version adds</h2>
        <div className="cn-bento">
          <ExpandableTile
            className="span-12 cn-tile-yellow"
            summary={
              <>
                <div className="cn-tile-meta">v0 · you are here</div>
                <div>
                  <h3 className="cn-tile-title" style={{ fontSize: "20px" }}>
                    Scaffold + file routing.
                  </h3>
                  <p className="cn-tile-sub" style={{ marginTop: "6px", fontSize: "13.5px" }}>
                    Drop a <code>page.tsx</code> into a folder, get a URL. Home,{" "}
                    <code>/tasks</code> (empty), <code>/about</code>. No data layer yet.
                  </p>
                </div>
              </>
            }
          >
            <DemoV0 />
          </ExpandableTile>

          <ExpandableTile
            className="span-4 cn-tile-soon"
            summary={
              <>
                <div className="cn-tile-meta">v1</div>
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
                <div className="cn-tile-meta">v2</div>
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
        </div>
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
