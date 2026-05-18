import Progression from "@/components/Progression";

export const metadata = {
  title: "About · Cadence v4",
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
        Each state adds <strong>one Next.js concept</strong> to the previous one. You can
        read every state in isolation, or scroll the sequence to watch the architecture
        evolve from scaffold to a layout-wrapped multi-route app.
      </p>

      <Progression current={4} />

      <section className="cn-section">
        <div className="cn-section-tag">the seven states</div>
        <h2 className="cn-section-h">What each version adds</h2>
        <div className="cn-bento">
          <div className="cn-tile span-12 cn-tile-yellow">
            <div className="cn-tile-meta">v4 · you are here</div>
            <div>
              <h3 className="cn-tile-title" style={{ fontSize: "20px" }}>
                <code>app/tasks/[id]/page.tsx</code> · dynamic route pre-rendered at
                build time via <code>generateStaticParams()</code>.
              </h3>
              <p className="cn-tile-sub" style={{ marginTop: "6px", fontSize: "13.5px" }}>
                Each task card links to its own detail page. Every detail page ships as
                static HTML in the export. The whole dynamic route is one file; the
                build produces one HTML per task.
              </p>
            </div>
          </div>

          <div className="cn-tile span-2">
            <div className="cn-tile-meta">v0 · done</div>
            <h3 className="cn-tile-title" style={{ fontSize: "14px" }}>scaffold</h3>
          </div>
          <div className="cn-tile span-2">
            <div className="cn-tile-meta">v1 · done</div>
            <h3 className="cn-tile-title" style={{ fontSize: "14px" }}>client list</h3>
          </div>
          <div className="cn-tile span-2">
            <div className="cn-tile-meta">v2 · done</div>
            <h3 className="cn-tile-title" style={{ fontSize: "14px" }}>server list</h3>
          </div>
          <div className="cn-tile span-2">
            <div className="cn-tile-meta">v3 · done</div>
            <h3 className="cn-tile-title" style={{ fontSize: "14px" }}>client filter</h3>
          </div>
          <div className="cn-tile span-4">
            <div className="cn-tile-meta">v5 · CRUD UI</div>
            <h3 className="cn-tile-title">Create / edit / delete patterns</h3>
            <p className="cn-tile-sub">Local state · no persistence (W6 territory).</p>
          </div>

          <div className="cn-tile span-12 cn-tile-violet">
            <div className="cn-tile-meta">v6 · layout + states</div>
            <h3 className="cn-tile-title">Shared <code>layout.tsx</code> + <code>loading.tsx</code> + <code>error.tsx</code></h3>
            <p className="cn-tile-sub">
              Global nav, an artificial loading state, a graceful error fallback. The
              finished shape.
            </p>
          </div>
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
                <code>lib/tasks.ts</code> file is a typed array, not an API call. v5's
                "CRUD" is a UI pattern over local in-memory state. Real backends — API
                routes that run on a server, persistence, auth — that's the entire focus of
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
