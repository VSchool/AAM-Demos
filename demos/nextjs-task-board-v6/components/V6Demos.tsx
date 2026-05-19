"use client";

// Interactive mini-demos for the v6 deep-dive tiles on the homepage.
// Same visual language as VersionDemos (dark inset "screen", pill buttons),
// each focused on one v6 concept: loading.tsx, error.tsx, the new file set,
// the build output, the shared layout, and the seven-state progression.

import { useEffect, useRef, useState } from "react";

const SCREEN_STYLE: React.CSSProperties = {
  background: "#0F0D14",
  color: "#FFFDF5",
  border: "1px solid rgba(255,253,245,0.10)",
  borderRadius: "10px",
  padding: "14px",
  fontSize: "13px",
  fontFamily: "var(--font-sans)",
  lineHeight: 1.5,
};

const PILL: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "5px 10px",
  borderRadius: "999px",
  border: "1px solid rgba(255,253,245,0.18)",
  background: "rgba(255,253,245,0.04)",
  color: "rgba(255,253,245,0.85)",
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
  cursor: "pointer",
};

const PILL_ACTIVE: React.CSSProperties = {
  ...PILL,
  background: "#00FFB2",
  color: "#002418",
  border: "1px solid #00FFB2",
  fontWeight: 700,
};

const PILL_DANGER: React.CSSProperties = {
  ...PILL,
  borderColor: "rgba(255,123,245,0.5)",
  color: "#FF7BF5",
};

const URL_BAR: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 10px",
  background: "rgba(255,253,245,0.06)",
  border: "1px solid rgba(255,253,245,0.10)",
  borderRadius: "6px",
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
  color: "rgba(255,253,245,0.85)",
};

const FAKE_NAV: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "6px 10px",
  background: "rgba(255,253,245,0.05)",
  border: "1px solid rgba(255,253,245,0.10)",
  borderRadius: "6px",
  fontFamily: "var(--font-mono)",
  fontSize: "10px",
  color: "rgba(255,253,245,0.7)",
  letterSpacing: "0.06em",
};

const FAKE_FOOTER: React.CSSProperties = {
  ...FAKE_NAV,
  justifyContent: "center",
  opacity: 0.65,
};

const ROW: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "8px 10px",
  background: "rgba(255,253,245,0.04)",
  border: "1px solid rgba(255,253,245,0.08)",
  borderRadius: "6px",
};

const FOOT_TEXT: React.CSSProperties = {
  marginTop: "10px",
  opacity: 0.65,
  fontSize: "12px",
};

// ============================================================
// 1. loading.tsx — skeleton plays while a fake nav resolves
// ============================================================

export function LoadingFileDemo() {
  const [phase, setPhase] = useState<"idle" | "loading" | "loaded">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const navigate = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("loading");
    timerRef.current = setTimeout(() => setPhase("loaded"), 1100);
  };
  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("idle");
  };

  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        <button type="button" onClick={navigate} style={PILL_ACTIVE}>
          ▸ Navigate to /tasks/CDN-042
        </button>
        <button type="button" onClick={reset} style={PILL}>
          Reset
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={URL_BAR}>
          <span style={{ opacity: 0.5 }}>localhost</span>
          <span>{phase === "idle" ? "/tasks" : "/tasks/CDN-042"}</span>
          {phase === "loading" && (
            <span style={{ marginLeft: "auto", color: "#FFE066", fontSize: "10px" }}>
              loading…
            </span>
          )}
        </div>

        <div style={{ minHeight: "150px", position: "relative" }}>
          {phase === "idle" && (
            <div style={{ opacity: 0.55, fontSize: "12px", padding: "20px 8px" }}>
              Click <em>Navigate</em>. While the new segment&apos;s JS chunk loads,{" "}
              <code>loading.tsx</code> renders an instant skeleton — no blank screen.
            </div>
          )}
          {phase === "loading" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ height: "12px", width: "30%", background: "rgba(255,253,245,0.10)", borderRadius: "4px", animation: "v6-pulse 1.2s ease-in-out infinite" }} />
              <div style={{ height: "24px", width: "70%", background: "rgba(255,253,245,0.10)", borderRadius: "4px", animation: "v6-pulse 1.2s ease-in-out infinite" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "10px", marginTop: "4px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ height: "10px", width: "92%", background: "rgba(255,253,245,0.08)", borderRadius: "4px", animation: "v6-pulse 1.2s ease-in-out infinite" }} />
                  <div style={{ height: "10px", width: "84%", background: "rgba(255,253,245,0.08)", borderRadius: "4px", animation: "v6-pulse 1.2s ease-in-out infinite" }} />
                  <div style={{ height: "10px", width: "60%", background: "rgba(255,253,245,0.08)", borderRadius: "4px", animation: "v6-pulse 1.2s ease-in-out infinite" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} style={{ height: "9px", background: "rgba(255,253,245,0.08)", borderRadius: "3px", animation: "v6-pulse 1.2s ease-in-out infinite" }} />
                  ))}
                </div>
              </div>
              <style>{`@keyframes v6-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
            </div>
          )}
          {phase === "loaded" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 130px", gap: "12px" }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#FFE066", marginBottom: "4px", letterSpacing: "0.1em" }}>
                  /tasks/[id] · v6
                </div>
                <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>
                  Wire client filter to server-rendered task list
                </div>
                <div style={{ opacity: 0.8, fontSize: "12px", lineHeight: 1.5 }}>
                  Filter state belongs to the client wrapper, not the server parent.
                  Server owns the array; chips re-narrow the visible slice without a
                  refetch.
                </div>
              </div>
              <div style={{
                background: "rgba(255,253,245,0.04)",
                border: "1px solid rgba(255,253,245,0.10)",
                borderRadius: "6px",
                padding: "10px",
                fontSize: "11px",
                lineHeight: 1.6,
              }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", opacity: 0.6, marginBottom: "4px", letterSpacing: "0.08em" }}>DETAILS</div>
                <div>Status · Doing</div>
                <div>Priority · P1</div>
                <div>Due · today</div>
                <div>Assignee · MP</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <p style={FOOT_TEXT}>
        <code>loading.tsx</code> sits next to <code>page.tsx</code> — Next.js
        wraps the segment in <code>&lt;Suspense&gt;</code> automatically.
      </p>
    </div>
  );
}

// ============================================================
// 2. error.tsx — throw a render, watch the segment swap
// ============================================================

export function ErrorFileDemo() {
  const [scene, setScene] = useState<"page" | "error">("page");

  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setScene("error")}
          disabled={scene === "error"}
          style={{ ...PILL_DANGER, opacity: scene === "error" ? 0.5 : 1 }}
        >
          💥 Throw inside segment
        </button>
        <button
          type="button"
          onClick={() => setScene("page")}
          disabled={scene === "page"}
          style={{ ...PILL_ACTIVE, opacity: scene === "page" ? 0.5 : 1 }}
        >
          ↻ Reset (calls reset())
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={FAKE_NAV}>
          <span>▸ CADENCE · v6</span>
          <span style={{ opacity: 0.5 }}>Home · Tasks · About</span>
        </div>

        <div
          style={{
            minHeight: "150px",
            border: "1px dashed rgba(255,253,245,0.20)",
            borderRadius: "6px",
            padding: "12px",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", top: "-9px", left: "10px", padding: "0 6px", background: "#0F0D14", fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.1em", opacity: 0.6 }}>
            SEGMENT · /tasks/[id]
          </div>
          {scene === "page" ? (
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#FFE066", marginBottom: "4px" }}>
                CDN-042 · MP
              </div>
              <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "6px" }}>
                Wire client filter to server-rendered task list
              </div>
              <div style={{ opacity: 0.75, fontSize: "12.5px" }}>
                This is the detail page. Click <em>Throw</em> — only this box gets
                replaced. The nav above and footer below stay mounted.
              </div>
            </div>
          ) : (
            <div
              style={{
                background: "rgba(255,123,245,0.06)",
                border: "1px solid rgba(255,123,245,0.40)",
                borderRadius: "6px",
                padding: "12px",
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#FF7BF5", marginBottom: "4px", letterSpacing: "0.1em" }}>
                CAUGHT BY app/tasks/[id]/error.tsx
              </div>
              <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "6px" }}>
                Something broke in this segment.
              </div>
              <div style={{ opacity: 0.78, fontSize: "12px", marginBottom: "10px" }}>
                React unwound the tree and rendered the error boundary instead.{" "}
                <code>reset()</code> re-attempts the render.
              </div>
              <button type="button" onClick={() => setScene("page")} style={PILL_ACTIVE}>
                ↻ Try again
              </button>
            </div>
          )}
        </div>

        <div style={FAKE_FOOTER}>
          <span>Cadence · nextjs-task-board · v6 of 7</span>
        </div>
      </div>

      <p style={FOOT_TEXT}>
        Nav and footer come from the shared <code>app/layout.tsx</code>. Only the{" "}
        <code>{`{children}`}</code> slot — the segment — gets replaced.
      </p>
    </div>
  );
}

// ============================================================
// 3. New files (3) — pick a file, see its role
// ============================================================

const NEW_FILES = [
  {
    path: "app/tasks/[id]/loading.tsx",
    role: "Suspense fallback for the dynamic detail route. Renders a skeleton while the segment hydrates.",
    role2: "Server component. No import needed in page.tsx — Next.js wires it.",
    tone: "#FFE066",
  },
  {
    path: "app/tasks/[id]/error.tsx",
    role: "Error boundary scoped to the detail route. Receives error + reset() from React.",
    role2: 'Must be a client component ("use client").',
    tone: "#FF7BF5",
  },
  {
    path: "components/TriggerError.tsx",
    role: "On-demand bomb that throws inside the segment so students can see error.tsx fire.",
    role2: "Imported into the detail page; renders a single button.",
    tone: "#00FFB2",
  },
];

export function NewFilesDemo() {
  const [activeIdx, setActiveIdx] = useState(0);
  const f = NEW_FILES[activeIdx];

  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "12px" }}>
        {NEW_FILES.map((file, i) => (
          <button
            key={file.path}
            type="button"
            onClick={() => setActiveIdx(i)}
            style={{
              ...(activeIdx === i ? PILL_ACTIVE : PILL),
              justifyContent: "flex-start",
              width: "100%",
              borderRadius: "6px",
              padding: "7px 12px",
              fontSize: "11.5px",
            }}
          >
            <span style={{ opacity: activeIdx === i ? 1 : 0.55, marginRight: "4px" }}>
              ▸
            </span>
            {file.path}
          </button>
        ))}
      </div>

      <div
        style={{
          minHeight: "110px",
          padding: "12px",
          background: "rgba(255,253,245,0.04)",
          border: "1px solid rgba(255,253,245,0.08)",
          borderRadius: "8px",
          borderLeft: `3px solid ${f.tone}`,
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", color: f.tone, marginBottom: "6px" }}>
          ROLE
        </div>
        <div style={{ fontSize: "13px", marginBottom: "8px", lineHeight: 1.5 }}>
          {f.role}
        </div>
        <div style={{ opacity: 0.7, fontSize: "12px" }}>{f.role2}</div>
      </div>

      <p style={FOOT_TEXT}>
        Three files, one new concept each: skeleton fallback, error boundary,
        and an on-demand way to fire the boundary from inside the segment.
      </p>
    </div>
  );
}

// ============================================================
// 4. Build output — filter the 17 pre-rendered files
// ============================================================

type BuildKind = "static" | "ssg" | "not-found";

const BUILD_FILES: { path: string; kind: BuildKind }[] = [
  { path: "out/index.html", kind: "static" },
  { path: "out/about.html", kind: "static" },
  { path: "out/tasks.html", kind: "static" },
  { path: "out/_not-found.html", kind: "not-found" },
  { path: "out/tasks/CDN-030.html", kind: "ssg" },
  { path: "out/tasks/CDN-031.html", kind: "ssg" },
  { path: "out/tasks/CDN-033.html", kind: "ssg" },
  { path: "out/tasks/CDN-034.html", kind: "ssg" },
  { path: "out/tasks/CDN-035.html", kind: "ssg" },
  { path: "out/tasks/CDN-036.html", kind: "ssg" },
  { path: "out/tasks/CDN-037.html", kind: "ssg" },
  { path: "out/tasks/CDN-038.html", kind: "ssg" },
  { path: "out/tasks/CDN-039.html", kind: "ssg" },
  { path: "out/tasks/CDN-040.html", kind: "ssg" },
  { path: "out/tasks/CDN-041.html", kind: "ssg" },
  { path: "out/tasks/CDN-042.html", kind: "ssg" },
];

const KIND_COLOR: Record<BuildKind, string> = {
  static: "#7DD3FC",
  ssg: "#FFE066",
  "not-found": "#FF7BF5",
};

const KIND_LABEL: Record<BuildKind, string> = {
  static: "static",
  ssg: "SSG",
  "not-found": "404",
};

export function BuildOutputDemo() {
  const [filter, setFilter] = useState<BuildKind | "all">("all");
  const visible = filter === "all" ? BUILD_FILES : BUILD_FILES.filter((f) => f.kind === filter);
  const counts: Record<BuildKind | "all", number> = {
    all: BUILD_FILES.length,
    static: BUILD_FILES.filter((f) => f.kind === "static").length,
    ssg: BUILD_FILES.filter((f) => f.kind === "ssg").length,
    "not-found": BUILD_FILES.filter((f) => f.kind === "not-found").length,
  };

  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
        {(["all", "static", "ssg", "not-found"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            style={filter === f ? PILL_ACTIVE : PILL}
          >
            {f === "all" ? "All" : KIND_LABEL[f]}
            <span style={{ opacity: 0.7, marginLeft: "4px" }}>{counts[f]}</span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxHeight: "220px", overflowY: "auto" }}>
        {visible.map((f) => (
          <div
            key={f.path}
            style={{
              ...ROW,
              padding: "5px 10px",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
            }}
          >
            <span style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: KIND_COLOR[f.kind],
            }} />
            <span style={{ flex: 1, color: "rgba(255,253,245,0.92)" }}>{f.path}</span>
            <span style={{ opacity: 0.6, fontSize: "9px", letterSpacing: "0.1em" }}>
              {KIND_LABEL[f.kind]}
            </span>
          </div>
        ))}
      </div>

      <p style={FOOT_TEXT}>
        Every page ships as a flat HTML file. <code>generateStaticParams()</code>
        decides which detail pages exist; the build emits one HTML per ID.
      </p>
    </div>
  );
}

// ============================================================
// 5. app/layout.tsx — pick a route, layout chrome stays
// ============================================================

const ROUTES = [
  { key: "home", label: "/", body: "Cadence — plan, sort, ship.", tone: "#00FFB2" },
  { key: "tasks", label: "/tasks", body: "Board with 6 columns + drag-reorder.", tone: "#FFE066" },
  { key: "about", label: "/about", body: "Seven-state progression, v0 → v6.", tone: "#7DD3FC" },
  { key: "error", label: "/tasks/[id] · error", body: "error.tsx caught a throw. reset() re-renders.", tone: "#FF7BF5" },
];

export function LayoutDemo() {
  const [routeKey, setRouteKey] = useState("tasks");
  const r = ROUTES.find((x) => x.key === routeKey)!;

  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
        {ROUTES.map((x) => (
          <button
            key={x.key}
            type="button"
            onClick={() => setRouteKey(x.key)}
            style={routeKey === x.key ? PILL_ACTIVE : PILL}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ ...FAKE_NAV, borderLeft: "3px solid #00FFB2" }}>
          <span>▸ CADENCE</span>
          <span style={{ opacity: 0.5 }}>Home · Tasks · About</span>
          <span style={{ marginLeft: "auto", fontSize: "9px", opacity: 0.6 }}>stays mounted</span>
        </div>

        <div
          style={{
            padding: "16px 14px",
            background: "rgba(255,253,245,0.04)",
            border: `1px dashed ${r.tone}`,
            borderRadius: "6px",
            minHeight: "70px",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", top: "-9px", left: "10px", padding: "0 6px", background: "#0F0D14", fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.1em", color: r.tone }}>
            {`{children}`}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: r.tone, marginBottom: "4px" }}>
            {r.label}
          </div>
          <div style={{ fontSize: "13px" }}>{r.body}</div>
        </div>

        <div style={{ ...FAKE_FOOTER, borderLeft: "3px solid #00FFB2" }}>
          <span>Cadence · v6 of 7 · stays mounted</span>
        </div>
      </div>

      <p style={FOOT_TEXT}>
        Click any route. Only the middle box (the <code>{`{children}`}</code>{" "}
        slot) changes — nav and footer come from <code>app/layout.tsx</code> and
        stay constant.
      </p>
    </div>
  );
}

// ============================================================
// 6. Seven states — scrub the progression
// ============================================================

const STATES = [
  { v: "v0", title: "scaffold + file routing", body: "Drop a page.tsx into a folder, get a URL." },
  { v: "v1", title: "client list", body: "useState + useEffect, spinner, then data." },
  { v: "v2", title: "server list", body: "Same UI, no spinner — HTML arrives populated." },
  { v: "v3", title: "client filter", body: "Server owns the array, client owns the chips." },
  { v: "v4", title: "dynamic detail route", body: "[id] segment + generateStaticParams." },
  { v: "v5", title: "CRUD UI", body: "Add / edit / delete on a client-side store." },
  { v: "v6", title: "loading + error", body: "Suspense fallback + segment error boundary. (you are here)" },
];

export function ProgressionDemo() {
  const [idx, setIdx] = useState(6);
  const s = STATES[idx];

  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "14px" }}>
        {STATES.map((state, i) => (
          <button
            key={state.v}
            type="button"
            onClick={() => setIdx(i)}
            style={{
              ...(idx === i ? PILL_ACTIVE : PILL),
              padding: "5px 10px",
              minWidth: "40px",
              justifyContent: "center",
            }}
          >
            {state.v}
          </button>
        ))}
      </div>

      <div
        style={{
          padding: "14px",
          background: "rgba(255,253,245,0.04)",
          border: "1px solid rgba(255,253,245,0.10)",
          borderRadius: "8px",
          minHeight: "100px",
          borderLeft: `3px solid ${idx === 6 ? "#00FFB2" : "#FFE066"}`,
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", opacity: 0.6, marginBottom: "6px" }}>
          {s.v.toUpperCase()} · ADDED
        </div>
        <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "6px" }}>
          {s.title}
        </div>
        <div style={{ opacity: 0.8, fontSize: "12.5px", lineHeight: 1.5 }}>{s.body}</div>
      </div>

      <div style={{ display: "flex", gap: "6px", marginTop: "12px" }}>
        <button
          type="button"
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          style={{ ...PILL, opacity: idx === 0 ? 0.4 : 1 }}
        >
          ← prev
        </button>
        <button
          type="button"
          onClick={() => setIdx((i) => Math.min(STATES.length - 1, i + 1))}
          disabled={idx === STATES.length - 1}
          style={{ ...PILL, opacity: idx === STATES.length - 1 ? 0.4 : 1 }}
        >
          next →
        </button>
      </div>

      <p style={FOOT_TEXT}>
        Each version adds exactly one Next.js concept. Open the about page for
        the full interactive walk-through of every state.
      </p>
    </div>
  );
}
