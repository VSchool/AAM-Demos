import Link from "next/link";
import Progression from "@/components/Progression";

export default function Home() {
  return (
    <main className="cn-page">
      <div className="cn-eyebrow">State v6 · layout + loading + error states (final)</div>
      <h1 className="cn-h1">Cadence — the finished shape.</h1>
      <p className="cn-lede">
        This is <strong>state v6 of 7</strong> — the last. Everything from v0–v5 is
        intact: scaffold + file routing + client list + server list + client filter +
        dynamic detail route + CRUD UI. v6 adds the production-grade boundaries —{" "}
        <code>loading.tsx</code> and <code>error.tsx</code> at the detail route — plus
        a final pass on the shared layout (which has wrapped every state since v0).
        This is the kind of shape you&apos;d hand to a teammate.
      </p>

      <Progression current={6} />

      <section className="cn-section">
        <div className="cn-section-tag">01 · The two new files</div>
        <h2 className="cn-section-h">Co-located with the segment</h2>
        <div className="cn-bento">
          <div className="cn-tile span-6 row-2 cn-tile-yellow">
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
                <code>loading.tsx</code>. No import needed in the page — file
                co-location does the wiring. On static export, the JS chunk for a new
                detail page has to load before the segment can hydrate; loading.tsx
                fills that gap.
              </p>
            </div>
          </div>
          <div className="cn-tile span-6 row-2 cn-tile-pink">
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
                Must be a client component (<code>&quot;use client&quot;</code>) because
                it receives a <code>reset()</code> function students can call to
                re-attempt the render. Try the &quot;Trigger error&quot; button on any
                detail page to see it fire.
              </p>
              <div style={{ marginTop: "16px" }}>
                <Link
                  href="/tasks"
                  style={{ textDecoration: "underline", fontWeight: 600 }}
                >
                  Open a task and scroll down →
                </Link>
              </div>
            </div>
          </div>
          <div className="cn-tile span-3 cn-tile-green">
            <div className="cn-tile-meta">New files</div>
            <div className="cn-tile-num">3</div>
            <div className="cn-tile-sub">loading · error · TriggerError</div>
          </div>
          <div className="cn-tile span-3">
            <div className="cn-tile-meta">Build output</div>
            <h3 className="cn-tile-title">17 HTML</h3>
            <p className="cn-tile-sub">4 static + 12 SSG + 1 not-found</p>
          </div>
          <div className="cn-tile span-3 cn-tile-violet">
            <div className="cn-tile-meta">Shared layout</div>
            <h3 className="cn-tile-title">app/layout.tsx</h3>
            <p className="cn-tile-sub">Nav + footer + store provider, all routes.</p>
          </div>
          <div className="cn-tile span-3">
            <div className="cn-tile-meta">Total progression</div>
            <h3 className="cn-tile-title">7 states</h3>
            <p className="cn-tile-sub">v0 → v6 · scaffold to ship-ready</p>
          </div>
        </div>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">02 · The story of the demo</div>
        <h2 className="cn-section-h">What you learned across the seven states</h2>
        <div className="cn-bento">
          <div className="cn-tile span-12 cn-tile-dark">
            <div className="cn-tile-meta" style={{ color: "var(--neon)" }}>
              the arc
            </div>
            <div>
              <p
                className="cn-tile-sub"
                style={{ fontSize: "14px", opacity: 0.9, lineHeight: 1.55 }}
              >
                <strong>v0</strong> showed file-based routing — drop a{" "}
                <code>page.tsx</code> into a folder, get a URL. <strong>v1</strong>{" "}
                ported the W5D1 React pattern into a Next.js page (useState +
                useEffect). <strong>v2</strong> deleted all of that by lifting the data
                read into an async server component. <strong>v3</strong> drew the
                server/client boundary: server owns the data, client owns the
                interaction. <strong>v4</strong> added the dynamic detail route via{" "}
                <code>generateStaticParams()</code>. <strong>v5</strong> built the CRUD
                UI on a client-side store and held the W6 line on persistence.{" "}
                <strong>v6</strong> shipped the production-grade boundaries —{" "}
                <code>loading.tsx</code>, <code>error.tsx</code>, a real shared layout.
                Next: W6 plugs the saves in for real.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">03 · Next week</div>
        <h2 className="cn-section-h">W6 makes the saves real</h2>
        <div className="cn-bento">
          <div className="cn-tile span-12 cn-tile-violet">
            <div className="cn-tile-meta">handoff</div>
            <div>
              <h3 className="cn-tile-title" style={{ fontSize: "20px" }}>
                Every <code>createTask</code> / <code>updateTask</code> /{" "}
                <code>deleteTask</code> method in the v5/v6 store becomes a{" "}
                <code>fetch()</code> against an API route W6 builds.
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "8px", fontSize: "14px" }}
              >
                The component shapes — forms, confirm flows, optimistic updates,
                skeletons, error fallbacks — don&apos;t change. The wiring does.
                That&apos;s why this demo went UI-first: by the time persistence shows
                up, you already know what it&apos;s plugging into.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
