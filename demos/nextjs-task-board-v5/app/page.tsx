import Link from "next/link";
import Progression from "@/components/Progression";
import FeaturesStrip from "@/components/FeaturesStrip";
import ExpandableBento from "@/components/ExpandableBento";
import ExpandableTile from "@/components/ExpandableTile";
import { DemoV5 } from "@/components/VersionDemos";
import {
  DeletedBannerDemo,
  StoreActionsDemo,
  PersistenceDemo,
  StoreLocationDemo,
  FilesAddedDemo,
} from "@/components/V5DeepDive";

export default function Home() {
  return (
    <main className="cn-page">
      <div className="cn-eyebrow">State v5 · CRUD UI patterns (no persistence)</div>
      <h1 className="cn-h1">Cadence — the UI of saving, without the saves.</h1>
      <p className="cn-lede">
        This is <strong>state v5 of 7</strong>. v4&apos;s detail route stays. v5 adds
        the <strong>shapes</strong> of create / edit / delete — a New Task form, an
        inline editor on every detail page, a delete-with-confirm flow — all driven by
        a client-side React Context store initialized from <code>lib/tasks.ts</code>.
        Refresh and the store reinitializes; in-session edits vanish. That&apos;s the
        whole point: the patterns work, the persistence is for next week.
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


      <Progression current={5} />

      <section className="cn-banner cn-banner-dark">
        <div className="cn-banner-meta" style={{ color: "var(--neon)" }}>
          the W6 bridge
        </div>
        <p>
          Every interaction on this state would, in a real app, fire a request to a
          server. v5 doesn&apos;t do that. <code>createTask</code> appends to local
          state. <code>updateTask</code> patches it. <code>deleteTask</code> filters
          it. When W6 lands, those three methods get replaced by{" "}
          <code>fetch(&apos;/api/tasks&apos;)</code> calls — the component shapes
          don&apos;t change. The form lives here so the wiring is the only thing
          you&apos;ll learn next week.
        </p>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">01 · What v5 added</div>
        <h2 className="cn-section-h">
          Three new components, one client store{" "}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.12em", marginLeft: "8px" }}>
            click any tile to expand
          </span>
        </h2>
        <ExpandableBento>
          <ExpandableTile
            className="span-6 row-2 cn-tile-pink"
            summary={
              <>
                <div className="cn-tile-meta">create</div>
                <div>
                  <h3
                    className="cn-tile-title"
                    style={{ fontSize: "22px", lineHeight: 1.2 }}
                  >
                    <code>NewTaskForm.tsx</code> — &quot;+ New task&quot;
                    button reveals an inline form. Submit appends to the
                    store.
                  </h3>
                  <p
                    className="cn-tile-sub"
                    style={{ marginTop: "10px", fontSize: "13.5px" }}
                  >
                    Sits at the top of <code>/tasks</code>. New tasks land at
                    the head of the list. ID is auto-generated as{" "}
                    <code>CDN-###</code>.
                  </p>
                </div>
              </>
            }
          >
            <DemoV5 />
            <pre className="cn-tile-code">
              <code>{`// NewTaskForm.tsx — "use client"
const { createTask } = useTaskStore();

const handleSubmit = (e) => {
  e.preventDefault();
  createTask({ title, description, status: "todo", priority: "P2" });
  setOpen(false);  // collapse the pill back
};`}</code>
            </pre>
            <p className="cn-tile-body-note">
              Optimistic UI — the new card appears immediately because the
              store updates synchronously. No spinner.
            </p>
          </ExpandableTile>

          <ExpandableTile
            className="span-6 row-2 cn-tile-yellow"
            summary={
              <>
                <div className="cn-tile-meta">edit + delete</div>
                <div>
                  <h3
                    className="cn-tile-title"
                    style={{ fontSize: "22px", lineHeight: 1.2 }}
                  >
                    <code>TaskDetailActions.tsx</code> — sits on every{" "}
                    <code>/tasks/[id]</code> page. Edit inline; delete with
                    confirm.
                  </h3>
                  <p
                    className="cn-tile-sub"
                    style={{ marginTop: "10px", fontSize: "13.5px" }}
                  >
                    If the task was deleted in-session, the actions block
                    shows a pink &quot;deleted in this session&quot; banner.
                    The pre-rendered HTML for the detail page stays — the
                    actions block reflects the live store.
                  </p>
                </div>
              </>
            }
          >
            <DeletedBannerDemo />
            <pre className="cn-tile-code">
              <code>{`const { tasks, updateTask, deleteTask } = useTaskStore();
const liveTask = tasks.find(t => t.id === task.id);

if (!liveTask) return <DeletedBanner />;
return (
  <EditForm
    task={liveTask}
    onSave={(patch) => updateTask(task.id, patch)}
    onDelete={() => deleteTask(task.id)}
  />
);`}</code>
            </pre>
            <Link href="/tasks" className="cn-tile-body-link">
              Try it on /tasks →
            </Link>
          </ExpandableTile>

          <ExpandableTile
            className="span-3 cn-tile-green"
            summary={
              <>
                <div className="cn-tile-meta">Store actions</div>
                <div className="cn-tile-num">3</div>
                <div className="cn-tile-sub">click each: signature + role</div>
              </>
            }
          >
            <StoreActionsDemo />
          </ExpandableTile>

          <ExpandableTile
            className="span-3"
            summary={
              <>
                <div className="cn-tile-meta">Persistence</div>
                <h3 className="cn-tile-title">None</h3>
                <p className="cn-tile-sub">create, reload, watch the wipe</p>
              </>
            }
          >
            <PersistenceDemo />
          </ExpandableTile>

          <ExpandableTile
            className="span-3 cn-tile-violet"
            summary={
              <>
                <div className="cn-tile-meta">Where the store lives</div>
                <h3 className="cn-tile-title">app/layout.tsx</h3>
                <p className="cn-tile-sub">toggle the route, follow the tree</p>
              </>
            }
          >
            <StoreLocationDemo />
          </ExpandableTile>

          <ExpandableTile
            className="span-3"
            summary={
              <>
                <div className="cn-tile-meta">Files added</div>
                <h3 className="cn-tile-title">4</h3>
                <p className="cn-tile-sub">click a file → its role</p>
              </>
            }
          >
            <FilesAddedDemo />
          </ExpandableTile>
        </ExpandableBento>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">02 · What lands next</div>
        <h2 className="cn-section-h">v6 — layout, loading, error states</h2>
        <div className="cn-bento">
          <div className="cn-tile span-12 cn-tile-dark">
            <div className="cn-tile-meta" style={{ color: "var(--neon)" }}>
              up next
            </div>
            <div>
              <h3 className="cn-tile-title" style={{ fontSize: "20px" }}>
                v6 adds <code>loading.tsx</code> and <code>error.tsx</code> at
                the detail-route boundary, plus a slightly more deliberate
                global layout.
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "8px", fontSize: "14px" }}
              >
                <code>loading.tsx</code> renders during async navigation (with
                an artificial delay so it&apos;s visible).{" "}
                <code>error.tsx</code> catches errors thrown in the segment.
                The finished shape — the kind of thing you&apos;d ship.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
