import Link from "next/link";
import Progression from "@/components/Progression";
import FeaturesStrip from "@/components/FeaturesStrip";
import ExpandableBento from "@/components/ExpandableBento";
import ExpandableTile from "@/components/ExpandableTile";
import { DemoV4 } from "@/components/VersionDemos";
import {
  PagesAddedDemo,
  FilesWrittenDemo,
  LinkWrapDemo,
  NotFoundDemo,
} from "@/components/V4DeepDive";
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


      <Progression current={4} />

      <section className="cn-section">
        <div className="cn-section-tag">01 · The new file</div>
        <h2 className="cn-section-h">
          <code>app/tasks/[id]/page.tsx</code> — one file, every detail page{" "}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.12em", marginLeft: "8px" }}>
            click any tile to expand
          </span>
        </h2>
        <ExpandableBento>
          <ExpandableTile
            className="span-6 row-2 cn-tile-violet"
            summary={
              <>
                <div className="cn-tile-meta">how the route is matched</div>
                <div>
                  <h3
                    className="cn-tile-title"
                    style={{ fontSize: "22px", lineHeight: 1.2 }}
                  >
                    The square brackets in <code>[id]</code> are how the
                    router says &quot;any segment.&quot;
                  </h3>
                  <p
                    className="cn-tile-sub"
                    style={{ marginTop: "10px", fontSize: "13.5px" }}
                  >
                    <code>/tasks/CDN-042</code> matches{" "}
                    <code>app/tasks/[id]/page.tsx</code> with{" "}
                    <code>params.id === &quot;CDN-042&quot;</code>. Same file
                    handles every task — the component looks up the matching
                    task in <code>lib/tasks.ts</code> and renders.
                  </p>
                </div>
              </>
            }
          >
            <DemoV4 />
            <pre className="cn-tile-code">
              <code>{`// app/tasks/[id]/page.tsx
export default async function TaskDetail({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;          // "CDN-042"
  const task = getTaskById(id);
  if (!task) notFound();
  return <TaskView task={task} />;
}`}</code>
            </pre>
            <p className="cn-tile-body-note">
              <code>params</code> is async in Next.js 15+; <code>await</code>{" "}
              it before reading.
            </p>
          </ExpandableTile>

          <ExpandableTile
            className="span-6 row-2 cn-tile-green"
            summary={
              <>
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
                    It returns{" "}
                    <code>{`[{ id: "CDN-042" }, { id: "CDN-041" }, ... ]`}</code>{" "}
                    — every task ID from <code>getTasks()</code>. The build
                    runs the page component once per ID and writes one HTML
                    file each. No spinner, no client fetch on the detail page.
                  </p>
                </div>
              </>
            }
          >
            <FilesWrittenDemo />
            <pre className="cn-tile-code">
              <code>{`// app/tasks/[id]/page.tsx
export async function generateStaticParams() {
  return getTasks().map((t) => ({ id: t.id }));
}

// Build output:
// out/tasks/CDN-030.html
// out/tasks/CDN-031.html
// ...
// out/tasks/CDN-042.html`}</code>
            </pre>
            <p className="cn-tile-body-note">
              Static export only; for a server-deployed app, you&apos;d return
              the same array and Next would render on demand instead.
            </p>
          </ExpandableTile>

          <ExpandableTile
            className="span-3 cn-tile-yellow"
            summary={
              <>
                <div className="cn-tile-meta">Pages added</div>
                <div className="cn-tile-num">{tasks.length}</div>
                <div className="cn-tile-sub">drag the count slider</div>
              </>
            }
          >
            <PagesAddedDemo />
          </ExpandableTile>

          <ExpandableTile
            className="span-3 cn-tile-pink"
            summary={
              <>
                <div className="cn-tile-meta">Files written</div>
                <div className="cn-tile-num">1</div>
                <div className="cn-tile-sub">click ▸ run the build</div>
              </>
            }
          >
            <FilesWrittenDemo />
          </ExpandableTile>

          <ExpandableTile
            className="span-3"
            summary={
              <>
                <div className="cn-tile-meta">What changed in TaskCard</div>
                <h3 className="cn-tile-title">Wrapped in Link</h3>
                <p className="cn-tile-sub">idle · hover · click</p>
              </>
            }
          >
            <LinkWrapDemo />
          </ExpandableTile>

          <ExpandableTile
            className="span-3"
            summary={
              <>
                <div className="cn-tile-meta">notFound() handling</div>
                <h3 className="cn-tile-title">Built in</h3>
                <p className="cn-tile-sub">try a known vs unknown id</p>
              </>
            }
          >
            <NotFoundDemo />
          </ExpandableTile>
        </ExpandableBento>
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
                v5 adds create / edit / delete UI — buttons, forms, dialogs —
                driven by local in-memory state.
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "8px", fontSize: "14px" }}
              >
                The UI shapes are real. The persistence isn&apos;t — refresh
                the page and the changes are gone. Real saves are W6 territory
                (API routes + a backend). v5 builds the patterns; W6 plugs
                them in.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
