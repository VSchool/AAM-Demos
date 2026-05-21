"use client";

// Mini-demos for the v1 deep-dive bento on the home page.
// One per small tile, matching the v6 deep-dive pattern.

import { useEffect, useRef, useState } from "react";

const SCREEN_STYLE: React.CSSProperties = {
  background: "#0F0D14",
  color: "#FFFDF5",
  border: "1px solid rgba(255,253,245,0.10)",
  borderRadius: "10px",
  padding: "12px",
  fontSize: "12.5px",
  fontFamily: "var(--font-sans)",
  lineHeight: 1.5,
};

const PILL: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "4px 9px",
  borderRadius: "999px",
  border: "1px solid rgba(255,253,245,0.18)",
  background: "rgba(255,253,245,0.04)",
  color: "rgba(255,253,245,0.85)",
  fontFamily: "var(--font-mono)",
  fontSize: "10.5px",
  cursor: "pointer",
};

const PILL_ACTIVE: React.CSSProperties = {
  ...PILL,
  background: "#00FFB2",
  color: "#002418",
  border: "1px solid #00FFB2",
  fontWeight: 700,
};

const FOOT_TEXT: React.CSSProperties = {
  marginTop: "8px",
  opacity: 0.6,
  fontSize: "11px",
};

const ROW: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 8px",
  background: "rgba(255,253,245,0.04)",
  border: "1px solid rgba(255,253,245,0.08)",
  borderRadius: "5px",
  fontSize: "11.5px",
};

// ============================================================
// "Tasks in lib" — preview the 12 tasks; click to inspect
// ============================================================

const SAMPLE_TASKS = [
  { id: "CDN-030", title: "Define Task type", status: "done" },
  { id: "CDN-031", title: "Stub getTasks reader", status: "done" },
  { id: "CDN-032", title: "Seed 12 tasks", status: "done" },
  { id: "CDN-033", title: "Render list in /tasks", status: "doing" },
  { id: "CDN-034", title: "Add status badges", status: "doing" },
  { id: "CDN-035", title: "Empty state copy", status: "todo" },
  { id: "CDN-036", title: "Skeleton component", status: "todo" },
  { id: "CDN-037", title: "Loading delay constant", status: "todo" },
  { id: "CDN-038", title: "Lib export shape", status: "todo" },
  { id: "CDN-039", title: "Type-narrow helpers", status: "todo" },
  { id: "CDN-040", title: "Hover state for flags", status: "todo" },
  { id: "CDN-041", title: "Tag picker scaffold", status: "todo" },
];

const STATUS_DOT: Record<string, string> = {
  todo: "rgba(255,253,245,0.5)",
  doing: "#FFE066",
  done: "#00FFB2",
};

export function TasksLibDemo() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? SAMPLE_TASKS : SAMPLE_TASKS.slice(0, 4);
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        <button type="button" onClick={() => setExpanded((v) => !v)} style={PILL_ACTIVE}>
          {expanded ? "▾ Collapse to head" : "▸ Show all 12"}
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {visible.map((t) => (
          <div key={t.id} style={ROW}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", opacity: 0.6 }}>
              {t.id}
            </span>
            <span style={{ flex: 1 }}>{t.title}</span>
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: STATUS_DOT[t.status],
              }}
            />
          </div>
        ))}
        {!expanded && (
          <div style={{ opacity: 0.5, fontSize: "10.5px", fontFamily: "var(--font-mono)", textAlign: "center", padding: "4px" }}>
            … 8 more
          </div>
        )}
      </div>
      <p style={FOOT_TEXT}>
        Static array in <code>lib/tasks.ts</code>. v1 reads it on the client.
      </p>
    </div>
  );
}

// ============================================================
// "Loading delay" — slider to change delay, watch spinner
// ============================================================

export function LoadingDelayDemo() {
  const [delay, setDelay] = useState(700);
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const run = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("loading");
    timerRef.current = setTimeout(() => setPhase("done"), delay);
  };

  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", opacity: 0.65 }}>delay</span>
        <input
          type="range"
          min={0}
          max={2000}
          step={100}
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#FFE066", minWidth: "44px", textAlign: "right" }}>
          {delay}ms
        </span>
      </div>
      <button type="button" onClick={run} style={{ ...PILL_ACTIVE, marginBottom: "10px" }}>
        ▸ Mount /tasks
      </button>
      <div
        style={{
          minHeight: "70px",
          padding: "10px",
          background: "rgba(255,253,245,0.05)",
          border: "1px solid rgba(255,253,245,0.10)",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {phase === "idle" && (
          <span style={{ opacity: 0.55, fontSize: "11.5px" }}>
            Drag the slider, click <em>Mount</em>.
          </span>
        )}
        {phase === "loading" && (
          <>
            <span
              style={{
                width: "11px",
                height: "11px",
                borderRadius: "50%",
                border: "2px solid rgba(255,253,245,0.25)",
                borderTopColor: "#FFE066",
                animation: "v1-spin 0.7s linear infinite",
              }}
            />
            <span style={{ fontSize: "11.5px" }}>Loading tasks…</span>
            <style>{`@keyframes v1-spin { to { transform: rotate(360deg); } }`}</style>
          </>
        )}
        {phase === "done" && (
          <span style={{ fontSize: "11.5px", color: "#00FFB2" }}>✓ {SAMPLE_TASKS.length} tasks loaded</span>
        )}
      </div>
      <p style={FOOT_TEXT}>The 700ms in v1 is artificial — it makes the skeleton visible.</p>
    </div>
  );
}

// ============================================================
// "New file" — peek at lib/tasks.ts (toggle code/preview)
// ============================================================

const LIB_CODE = `// lib/tasks.ts
export type Task = {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
};

const TASKS: readonly Task[] = [
  { id: "CDN-030", title: "Define Task type", status: "done" },
  { id: "CDN-031", title: "Stub getTasks reader", status: "done" },
  // … 10 more
];

export function getTasks(): readonly Task[] {
  return TASKS;
}`;

export function NewFileDemo() {
  const [view, setView] = useState<"code" | "preview">("code");
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
        <button type="button" onClick={() => setView("code")} style={view === "code" ? PILL_ACTIVE : PILL}>
          source
        </button>
        <button type="button" onClick={() => setView("preview")} style={view === "preview" ? PILL_ACTIVE : PILL}>
          shape
        </button>
      </div>
      {view === "code" ? (
        <pre
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,253,245,0.10)",
            borderRadius: "6px",
            padding: "10px",
            fontFamily: "var(--font-mono)",
            fontSize: "10.5px",
            lineHeight: 1.5,
            margin: 0,
            overflow: "auto",
            maxHeight: "180px",
            color: "rgba(255,253,245,0.85)",
          }}
        >
          <code>{LIB_CODE}</code>
        </pre>
      ) : (
        <div
          style={{
            padding: "10px",
            background: "rgba(255,253,245,0.05)",
            border: "1px solid rgba(255,253,245,0.10)",
            borderRadius: "6px",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            lineHeight: 1.6,
          }}
        >
          <div style={{ color: "#FFE066" }}>Task</div>
          <div style={{ paddingLeft: "12px", opacity: 0.85 }}>
            <div>id: <span style={{ color: "#7DD3FC" }}>string</span></div>
            <div>title: <span style={{ color: "#7DD3FC" }}>string</span></div>
            <div>status: <span style={{ color: "#FF7BF5" }}>&quot;todo&quot; | &quot;doing&quot; | &quot;done&quot;</span></div>
          </div>
          <div style={{ marginTop: "6px", color: "#FFE066" }}>getTasks()</div>
          <div style={{ paddingLeft: "12px", opacity: 0.85 }}>
            → <span style={{ color: "#7DD3FC" }}>readonly Task[]</span>
          </div>
        </div>
      )}
      <p style={FOOT_TEXT}>One file, one contract. Every later version reads from this.</p>
    </div>
  );
}

// ============================================================
// "New hooks" — toggle between useState and useEffect explanations
// ============================================================

const HOOKS = [
  {
    key: "state",
    label: "useState",
    role: "Holds the current list. Starts at null so the skeleton can render.",
    code: 'const [tasks, setTasks] = useState<Task[] | null>(null);',
  },
  {
    key: "effect",
    label: "useEffect",
    role: "Runs once after mount. Reads from lib/tasks.ts, writes to state.",
    code: 'useEffect(() => { setTasks(getTasks()); }, []);',
  },
];

export function HooksDemo() {
  const [key, setKey] = useState("state");
  const h = HOOKS.find((x) => x.key === key)!;
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
        {HOOKS.map((x) => (
          <button
            key={x.key}
            type="button"
            onClick={() => setKey(x.key)}
            style={key === x.key ? PILL_ACTIVE : PILL}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div
        style={{
          padding: "10px",
          background: "rgba(255,253,245,0.05)",
          border: "1px solid rgba(255,253,245,0.10)",
          borderRadius: "6px",
          marginBottom: "8px",
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", opacity: 0.6, marginBottom: "4px" }}>
          ROLE
        </div>
        <div style={{ fontSize: "12px", lineHeight: 1.5 }}>{h.role}</div>
      </div>
      <pre
        style={{
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,253,245,0.10)",
          borderRadius: "6px",
          padding: "8px 10px",
          fontFamily: "var(--font-mono)",
          fontSize: "10.5px",
          margin: 0,
          color: "rgba(255,253,245,0.9)",
          whiteSpace: "pre-wrap",
        }}
      >
        <code>{h.code}</code>
      </pre>
      <p style={FOOT_TEXT}>v2 deletes both lines and uses an async server component instead.</p>
    </div>
  );
}
