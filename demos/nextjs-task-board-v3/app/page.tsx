import Link from "next/link";
import Progression from "@/components/Progression";
import FeaturesStrip from "@/components/FeaturesStrip";

export default function Home() {
  return (
    <main className="cn-page">
      <div className="cn-eyebrow">State v3 · client filter wraps server list</div>
      <h1 className="cn-h1">Cadence — same data, client filter on top.</h1>
      <p className="cn-lede">
        This is <strong>state v3 of 7</strong>. v2&apos;s server-rendered list stays
        exactly as it was. v3 wraps it in a <code>&quot;use client&quot;</code>{" "}
        component called <code>TaskFilter</code>. The server component still reads the
        data and renders the HTML; the client component handles status chips and sort,
        runs in the browser, and decides which subset to show. Two files. One arrow
        between them.
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
        <h2 className="cn-section-h">Server owns the data. Client owns the interaction.</h2>
        <div className="cn-bento">
          <div className="cn-tile span-6 row-2 cn-tile-pink">
            <div className="cn-tile-meta">/tasks/page.tsx · server</div>
            <div>
              <h3
                className="cn-tile-title"
                style={{ fontSize: "22px", lineHeight: 1.2 }}
              >
                <code>const tasks = getTasks()</code> ·{" "}
                <code>&lt;TaskFilter tasks=&#123;tasks&#125; /&gt;</code>
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "10px", fontSize: "13.5px" }}
              >
                The page reads the data on the server and hands it to the client
                component as a serializable prop. No re-fetch, no hydration cost for the
                read itself.
              </p>
            </div>
          </div>
          <div className="cn-tile span-6 row-2 cn-tile-yellow">
            <div className="cn-tile-meta">TaskFilter.tsx · client</div>
            <div>
              <h3
                className="cn-tile-title"
                style={{ fontSize: "22px", lineHeight: 1.2 }}
              >
                <code>&quot;use client&quot;</code> ·{" "}
                <code>useState · useMemo</code>
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "10px", fontSize: "13.5px" }}
              >
                Receives <code>tasks</code> as a prop. Holds the active filter status
                and sort key in <code>useState</code>. Recomputes the visible array with{" "}
                <code>useMemo</code>. Renders only what passes.
              </p>
              <div style={{ marginTop: "16px" }}>
                <Link
                  href="/tasks"
                  style={{ textDecoration: "underline", fontWeight: 600 }}
                >
                  Try the filter →
                </Link>
              </div>
            </div>
          </div>
          <div className="cn-tile span-3 cn-tile-green">
            <div className="cn-tile-meta">Filter chips</div>
            <div className="cn-tile-num">7</div>
          </div>
          <div className="cn-tile span-3">
            <div className="cn-tile-meta">Sort keys</div>
            <h3 className="cn-tile-title">3</h3>
            <p className="cn-tile-sub">Priority · Due · Recently updated</p>
          </div>
          <div className="cn-tile span-3">
            <div className="cn-tile-meta">Files added</div>
            <h3 className="cn-tile-title">1</h3>
            <p className="cn-tile-sub">components/TaskFilter.tsx</p>
          </div>
          <div className="cn-tile span-3">
            <div className="cn-tile-meta">Server reads</div>
            <h3 className="cn-tile-title">1</h3>
            <p className="cn-tile-sub">getTasks() in app/tasks/page.tsx</p>
          </div>
        </div>
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
                If AI moves <code>getTasks()</code> into <code>TaskFilter</code>, you
                just paid for v2 and got v1 back.
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "8px", fontSize: "14px" }}
              >
                Common &quot;cleanup&quot; suggestion: &quot;put the data fetch inside the
                component that uses it.&quot; That logic is fine in plain React. In Next.js
                with a server/client split, it deletes the server-rendering benefit and
                reintroduces the loading flicker. Read every diff.
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
                v4 adds <code>app/tasks/[id]/page.tsx</code> — a dynamic route. Each
                task card becomes a link to its own detail page.
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "8px", fontSize: "14px" }}
              >
                <code>generateStaticParams()</code> tells Next.js which IDs to pre-render
                at build time, so every detail page ships as static HTML in the export.
                Server components all the way down, no spinner, no API call.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
