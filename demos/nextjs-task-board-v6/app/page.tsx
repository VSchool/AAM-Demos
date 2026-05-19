import Link from "next/link";
import FeaturesStrip from "@/components/FeaturesStrip";
import Progression from "@/components/Progression";
import ExpandableTile from "@/components/ExpandableTile";
import ExpandableBento from "@/components/ExpandableBento";
import {
  LoadingFileDemo,
  ErrorFileDemo,
  NewFilesDemo,
  BuildOutputDemo,
  LayoutDemo,
  ProgressionDemo,
} from "@/components/V6Demos";

export default function Home() {
  return (
    <main className="cn-page">
      <div className="cn-eyebrow">Cadence · task board</div>
      <h1 className="cn-h1">Plan, sort, and ship the work.</h1>
      <p className="cn-lede">
        Cadence is a lightweight task board for engineering teams — board and
        list views, drag-to-reorder, fast filters, and a detail page for every
        ticket. Open the board, drop a new task in, drag it across columns,
        click in to edit. The whole thing runs in your browser.
      </p>

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
        <div className="cn-section-tag">01 · what you can do here</div>
        <h2 className="cn-section-h">Real board. No screenshots.</h2>
        <FeaturesStrip />
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">02 · honest fine print</div>
        <h2 className="cn-section-h">Session-only persistence, on purpose.</h2>
        <div className="cn-bento">
          <div className="cn-tile span-12">
            <div className="cn-tile-meta">heads up</div>
            <div>
              <h3 className="cn-tile-title" style={{ fontSize: "18px" }}>
                Everything you create or edit lives in your browser&apos;s
                memory. Refresh and the board resets to its starting state.
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "8px", fontSize: "14px" }}
              >
                The UI patterns are real — forms, optimistic updates, confirm
                flows, drag-and-drop, skeleton fallbacks, error recovery. The
                backend isn&apos;t. Plugging in a real API is the next move; the
                shapes don&apos;t change when it lands.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">behind the scenes · for the curious</div>
        <h2 className="cn-section-h">Built progressively across seven states.</h2>
        <p
          className="cn-tile-sub"
          style={{
            fontSize: "14px",
            opacity: 0.75,
            lineHeight: 1.6,
            maxWidth: "62ch",
            marginBottom: "20px",
          }}
        >
          Cadence ships as part of Applied AI Mastery · Week 5. You&apos;re
          looking at v6 of 7 — the finished shape. Each prior state added
          exactly one Next.js concept (routing, server components, dynamic
          routes, CRUD UI, layout boundaries). The full arc lives on the{" "}
          <Link href="/about" style={{ textDecoration: "underline" }}>
            about page
          </Link>
          ; the tiles below are the v6 deep-dive.
        </p>
        <Progression current={6} />
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">v6 deep-dive · the two new files</div>
        <h2 className="cn-section-h">
          Co-located with the segment{" "}
          <span className="cn-section-h-hint">click any tile to expand</span>
        </h2>
        <ExpandableBento>
          <ExpandableTile
            className="span-6 row-2 cn-tile-yellow"
            summary={
              <>
                <div className="cn-tile-meta">app/tasks/[id]/loading.tsx</div>
                <div>
                  <h3
                    className="cn-tile-title"
                    style={{ fontSize: "22px", lineHeight: 1.2 }}
                  >
                    A skeleton that renders while the segment is being prepared.
                  </h3>
                  <p
                    className="cn-tile-sub"
                    style={{ marginTop: "10px", fontSize: "13.5px" }}
                  >
                    Next.js wraps every segment in a Suspense boundary scoped to its{" "}
                    <code>loading.tsx</code>. No import needed — file co-location
                    does the wiring.
                  </p>
                </div>
              </>
            }
          >
            <LoadingFileDemo />
          </ExpandableTile>

          <ExpandableTile
            className="span-6 row-2 cn-tile-pink"
            summary={
              <>
                <div className="cn-tile-meta">app/tasks/[id]/error.tsx</div>
                <div>
                  <h3
                    className="cn-tile-title"
                    style={{ fontSize: "22px", lineHeight: 1.2 }}
                  >
                    A fallback that catches anything thrown inside the segment.
                  </h3>
                  <p
                    className="cn-tile-sub"
                    style={{ marginTop: "10px", fontSize: "13.5px" }}
                  >
                    Must be <code>&quot;use client&quot;</code> — it receives a{" "}
                    <code>reset()</code> function the user can call to re-attempt
                    the render.
                  </p>
                </div>
              </>
            }
          >
            <ErrorFileDemo />
          </ExpandableTile>

          <ExpandableTile
            className="span-3 cn-tile-green"
            summary={
              <>
                <div className="cn-tile-meta">New files</div>
                <div className="cn-tile-num">3</div>
                <div className="cn-tile-sub">loading · error · TriggerError</div>
              </>
            }
          >
            <NewFilesDemo />
          </ExpandableTile>

          <ExpandableTile
            className="span-3"
            summary={
              <>
                <div className="cn-tile-meta">Build output</div>
                <h3 className="cn-tile-title">17 HTML</h3>
                <p className="cn-tile-sub">4 static + 12 SSG + 1 not-found</p>
              </>
            }
          >
            <BuildOutputDemo />
          </ExpandableTile>

          <ExpandableTile
            className="span-3 cn-tile-violet"
            summary={
              <>
                <div className="cn-tile-meta">Shared layout</div>
                <h3 className="cn-tile-title">app/layout.tsx</h3>
                <p className="cn-tile-sub">
                  Nav + footer + store provider, all routes.
                </p>
              </>
            }
          >
            <LayoutDemo />
          </ExpandableTile>

          <ExpandableTile
            className="span-3"
            summary={
              <>
                <div className="cn-tile-meta">Total progression</div>
                <h3 className="cn-tile-title">7 states</h3>
                <p className="cn-tile-sub">v0 → v6 · scaffold to ship-ready</p>
              </>
            }
          >
            <ProgressionDemo />
          </ExpandableTile>
        </ExpandableBento>
      </section>
    </main>
  );
}
