import Link from "next/link";
import Progression from "@/components/Progression";
import { getTasks } from "@/lib/tasks";

export default function Home() {
  const tasks = getTasks();
  const sampleIds = tasks.slice(0, 5).map((t) => t.id);

  return (
    <main className="cn-page">
      <div className="cn-eyebrow">State v4 · dynamic detail route</div>
      <h1 className="cn-h1">Cadence — every task is now a page.</h1>
      <p className="cn-lede">
        This is <strong>state v4 of 7</strong>. v3&apos;s filter + sort wrapper stays.
        What lands new: a dynamic route at <code>app/tasks/[id]/page.tsx</code>. Each
        task card on <code>/tasks</code> is now a link to its own detail page. Because
        this is a static export, every detail page was pre-rendered at build time — one
        HTML file per task — courtesy of <code>generateStaticParams()</code>.
      </p>

      <Progression current={4} />

      <section className="cn-section">
        <div className="cn-section-tag">01 · The new file</div>
        <h2 className="cn-section-h">
          <code>app/tasks/[id]/page.tsx</code> — one file, every detail page
        </h2>
        <div className="cn-bento">
          <div className="cn-tile span-6 row-2 cn-tile-violet">
            <div className="cn-tile-meta">how the route is matched</div>
            <div>
              <h3
                className="cn-tile-title"
                style={{ fontSize: "22px", lineHeight: 1.2 }}
              >
                The square brackets in <code>[id]</code> are how the router says
                &quot;any segment.&quot;
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "10px", fontSize: "13.5px" }}
              >
                <code>/tasks/CDN-042</code> matches <code>app/tasks/[id]/page.tsx</code>{" "}
                with <code>params.id === &quot;CDN-042&quot;</code>. Same file handles every
                task — the component looks up the matching task in{" "}
                <code>lib/tasks.ts</code> and renders.
              </p>
            </div>
          </div>
          <div className="cn-tile span-6 row-2 cn-tile-green">
            <div className="cn-tile-meta">how it ships statically</div>
            <div>
              <h3
                className="cn-tile-title"
                style={{ fontSize: "22px", lineHeight: 1.2 }}
              >
                <code>generateStaticParams()</code> tells Next.js{" "}
                <em>which IDs to bake into the export.</em>
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "10px", fontSize: "13.5px" }}
              >
                It returns <code>{`[{ id: "CDN-042" }, { id: "CDN-041" }, ... ]`}</code>{" "}
                — every task ID from <code>getTasks()</code>. The build runs the page
                component once per ID and writes one HTML file each. No spinner, no
                client fetch on the detail page.
              </p>
            </div>
          </div>
          <div className="cn-tile span-3 cn-tile-yellow">
            <div className="cn-tile-meta">Pages added</div>
            <div className="cn-tile-num">{tasks.length}</div>
            <div className="cn-tile-sub">one HTML file per task</div>
          </div>
          <div className="cn-tile span-3 cn-tile-pink">
            <div className="cn-tile-meta">Files written</div>
            <div className="cn-tile-num">1</div>
            <div className="cn-tile-sub">app/tasks/[id]/page.tsx</div>
          </div>
          <div className="cn-tile span-3">
            <div className="cn-tile-meta">What changed in TaskCard</div>
            <h3 className="cn-tile-title">Wrapped in Link</h3>
            <p className="cn-tile-sub">
              <code>&lt;Link href=&#123;`/tasks/$&#123;task.id&#125;`&#125; /&gt;</code>{" "}
              around the card.
            </p>
          </div>
          <div className="cn-tile span-3">
            <div className="cn-tile-meta">notFound() handling</div>
            <h3 className="cn-tile-title">Built in</h3>
            <p className="cn-tile-sub">
              Unknown IDs hit <code>next/navigation</code>&apos;s notFound().
            </p>
          </div>
        </div>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">02 · Try it</div>
        <h2 className="cn-section-h">Five sample detail pages</h2>
        <div className="cn-bento">
          {sampleIds.map((id) => (
            <Link
              key={id}
              href={`/tasks/${id}`}
              className="cn-tile span-2"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="cn-tile-meta">visit</div>
              <h3 className="cn-tile-title" style={{ fontSize: "15px" }}>
                /tasks/{id}
              </h3>
              <p className="cn-tile-sub" style={{ fontSize: "11px" }}>
                pre-rendered at build time
              </p>
            </Link>
          ))}
          <Link
            href="/tasks"
            className="cn-tile span-2 cn-tile-dark"
            style={{ textDecoration: "none" }}
          >
            <div className="cn-tile-meta" style={{ color: "var(--neon)" }}>
              browse all
            </div>
            <h3 className="cn-tile-title">/tasks</h3>
            <p className="cn-tile-sub">click any card</p>
          </Link>
        </div>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">03 · What lands next</div>
        <h2 className="cn-section-h">v5 — CRUD UI patterns (no persistence)</h2>
        <div className="cn-bento">
          <div className="cn-tile span-12 cn-tile-pink">
            <div className="cn-tile-meta">up next</div>
            <div>
              <h3 className="cn-tile-title" style={{ fontSize: "20px" }}>
                v5 adds create / edit / delete UI — buttons, forms, dialogs — driven by
                local in-memory state.
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "8px", fontSize: "14px" }}
              >
                The UI shapes are real. The persistence isn&apos;t — refresh the page and
                the changes are gone. Real saves are W6 territory (API routes + a
                backend). v5 builds the patterns; W6 plugs them in.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
