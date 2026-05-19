import Link from "next/link";
import Progression from "@/components/Progression";

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
        <h2 className="cn-section-h">Three new components, one client store</h2>
        <div className="cn-bento">
          <div className="cn-tile span-6 row-2 cn-tile-pink">
            <div className="cn-tile-meta">create</div>
            <div>
              <h3
                className="cn-tile-title"
                style={{ fontSize: "22px", lineHeight: 1.2 }}
              >
                <code>NewTaskForm.tsx</code> — &quot;+ New task&quot; button reveals an
                inline form. Submit appends to the store.
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "10px", fontSize: "13.5px" }}
              >
                Sits at the top of <code>/tasks</code>. New tasks land at the head of
                the list. ID is auto-generated as <code>CDN-###</code>.
              </p>
            </div>
          </div>
          <div className="cn-tile span-6 row-2 cn-tile-yellow">
            <div className="cn-tile-meta">edit + delete</div>
            <div>
              <h3
                className="cn-tile-title"
                style={{ fontSize: "22px", lineHeight: 1.2 }}
              >
                <code>TaskDetailActions.tsx</code> — sits on every{" "}
                <code>/tasks/[id]</code> page. Edit inline; delete with confirm.
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "10px", fontSize: "13.5px" }}
              >
                If the task was deleted in-session, the actions block shows a pink
                &quot;deleted in this session&quot; banner. The pre-rendered HTML for
                the detail page stays — the actions block reflects the live store.
              </p>
              <div style={{ marginTop: "16px" }}>
                <Link
                  href="/tasks"
                  style={{ textDecoration: "underline", fontWeight: 600 }}
                >
                  Try it on /tasks →
                </Link>
              </div>
            </div>
          </div>
          <div className="cn-tile span-3 cn-tile-green">
            <div className="cn-tile-meta">Store actions</div>
            <div className="cn-tile-num">3</div>
            <div className="cn-tile-sub">create · update · delete</div>
          </div>
          <div className="cn-tile span-3">
            <div className="cn-tile-meta">Persistence</div>
            <h3 className="cn-tile-title">None</h3>
            <p className="cn-tile-sub">All in-memory · refresh wipes it</p>
          </div>
          <div className="cn-tile span-3 cn-tile-violet">
            <div className="cn-tile-meta">Where the store lives</div>
            <h3 className="cn-tile-title">app/layout.tsx</h3>
            <p className="cn-tile-sub">
              <code>&lt;TaskStoreProvider initial=&#123;getTasks()&#125;&gt;</code>
            </p>
          </div>
          <div className="cn-tile span-3">
            <div className="cn-tile-meta">Files added</div>
            <h3 className="cn-tile-title">4</h3>
            <p className="cn-tile-sub">
              task-store · NewTaskForm · TaskBoard · TaskDetailActions
            </p>
          </div>
        </div>
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
                v6 adds <code>loading.tsx</code> and <code>error.tsx</code> at the
                detail-route boundary, plus a slightly more deliberate global layout.
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "8px", fontSize: "14px" }}
              >
                <code>loading.tsx</code> renders during async navigation (with an
                artificial delay so it&apos;s visible). <code>error.tsx</code> catches
                errors thrown in the segment. The finished shape — the kind of thing
                you&apos;d ship.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
