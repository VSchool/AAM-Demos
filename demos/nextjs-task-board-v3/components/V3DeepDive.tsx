"use client";

// Mini-demos for the v3 deep-dive bento on the home page.

import { useState } from "react";

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

// ============================================================
// "Drag direction" — preview drop target outcomes
// ============================================================

type DragTarget = "column" | "card";

export function DragDirectionDemo() {
  const [target, setTarget] = useState<DragTarget>("column");
  const [card, setCard] = useState({ id: "CDN-040", status: "todo", before: "CDN-041" });

  const apply = (t: DragTarget) => {
    setTarget(t);
    setCard((c) => ({
      ...c,
      status: t === "column" ? "doing" : c.status,
      before: t === "card" ? "CDN-039" : c.before,
    }));
  };

  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        <button type="button" onClick={() => apply("column")} style={target === "column" ? PILL_ACTIVE : PILL}>
          drop on column
        </button>
        <button type="button" onClick={() => apply("card")} style={target === "card" ? PILL_ACTIVE : PILL}>
          drop above card
        </button>
      </div>
      <div
        style={{
          padding: "10px",
          background: "rgba(255,253,245,0.05)",
          border: "1px solid rgba(255,253,245,0.10)",
          borderRadius: "6px",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
        }}
      >
        <div style={{ marginBottom: "4px", opacity: 0.6, fontSize: "10px", letterSpacing: "0.1em" }}>RESULT</div>
        <div>
          <span style={{ color: "#FFE066" }}>status</span> ·{" "}
          <span
            style={{
              color: target === "column" ? "#00FFB2" : "rgba(255,253,245,0.85)",
              fontWeight: target === "column" ? 700 : 400,
            }}
          >
            {card.status}
          </span>
        </div>
        <div>
          <span style={{ color: "#FFE066" }}>beforeId</span> ·{" "}
          <span
            style={{
              color: target === "card" ? "#00FFB2" : "rgba(255,253,245,0.85)",
              fontWeight: target === "card" ? 700 : 400,
            }}
          >
            {card.before}
          </span>
        </div>
      </div>
      <p style={FOOT_TEXT}>Column → status change. Card → position within column.</p>
    </div>
  );
}

// ============================================================
// "Filter chips" — interactive filter over a 5-task slice
// ============================================================

const V3_TASKS = [
  { id: "CDN-040", title: "Hover state", status: "todo" },
  { id: "CDN-041", title: "Static params", status: "doing" },
  { id: "CDN-042", title: "Wire filter", status: "doing" },
  { id: "CDN-039", title: "Server convert", status: "done" },
  { id: "CDN-038", title: "Shared layout", status: "todo" },
];

const STATUS_DOT: Record<string, string> = {
  todo: "rgba(255,253,245,0.5)",
  doing: "#FFE066",
  done: "#00FFB2",
};

type Filter = "all" | "todo" | "doing" | "done";

export function FilterChipsDemo() {
  const [f, setF] = useState<Filter>("all");
  const visible = f === "all" ? V3_TASKS : V3_TASKS.filter((t) => t.status === f);
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "8px" }}>
        {(["all", "todo", "doing", "done"] as Filter[]).map((x) => (
          <button key={x} type="button" onClick={() => setF(x)} style={f === x ? PILL_ACTIVE : PILL}>
            {x}
            <span style={{ marginLeft: "4px", opacity: 0.7 }}>
              {x === "all" ? V3_TASKS.length : V3_TASKS.filter((t) => t.status === x).length}
            </span>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", minHeight: "100px" }}>
        {visible.length === 0 ? (
          <div style={{ opacity: 0.5, fontSize: "11px" }}>No matches.</div>
        ) : (
          visible.map((t) => (
            <div
              key={t.id}
              style={{
                display: "flex",
                gap: "8px",
                padding: "5px 8px",
                background: "rgba(255,253,245,0.04)",
                border: "1px solid rgba(255,253,245,0.08)",
                borderRadius: "5px",
                fontSize: "11px",
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", opacity: 0.6, fontSize: "10px" }}>{t.id}</span>
              <span style={{ flex: 1 }}>{t.title}</span>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: STATUS_DOT[t.status] }} />
            </div>
          ))
        )}
      </div>
      <p style={FOOT_TEXT}>Store unchanged. Filter narrows what&apos;s shown.</p>
    </div>
  );
}

// ============================================================
// "Files added" — click each file to see its role
// ============================================================

const V3_FILES = [
  {
    path: "lib/task-store.tsx",
    role: 'Client-only Context provider holding the writable task array + reorderTask().',
    tag: '"use client" · useState · useCallback',
    tone: "#00FFB2",
  },
  {
    path: "components/TaskBoard.tsx",
    role: 'Thin client wrapper that reads useTaskStore() and renders TaskFilter + columns.',
    tag: '"use client" · useTaskStore()',
    tone: "#FFE066",
  },
];

export function FilesAddedDemo() {
  const [idx, setIdx] = useState(0);
  const f = V3_FILES[idx];
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px" }}>
        {V3_FILES.map((file, i) => (
          <button
            key={file.path}
            type="button"
            onClick={() => setIdx(i)}
            style={{
              ...(idx === i ? PILL_ACTIVE : PILL),
              justifyContent: "flex-start",
              borderRadius: "5px",
              width: "100%",
            }}
          >
            <span style={{ opacity: idx === i ? 1 : 0.55 }}>▸</span>
            {file.path}
          </button>
        ))}
      </div>
      <div
        style={{
          padding: "10px",
          background: "rgba(255,253,245,0.05)",
          border: "1px solid rgba(255,253,245,0.10)",
          borderRadius: "6px",
          borderLeft: `3px solid ${f.tone}`,
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: f.tone, letterSpacing: "0.1em", marginBottom: "4px" }}>
          ROLE
        </div>
        <div style={{ fontSize: "12px", marginBottom: "6px", lineHeight: 1.55 }}>{f.role}</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10.5px", opacity: 0.7 }}>{f.tag}</div>
      </div>
      <p style={FOOT_TEXT}>Two new files; the rest of the architecture is unchanged.</p>
    </div>
  );
}

// ============================================================
// "Server reads" — interactive timeline of 1 server, N client
// ============================================================

export function ServerReadsDemo() {
  const [interactions, setInteractions] = useState(0);
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        <button
          type="button"
          onClick={() => setInteractions((n) => n + 1)}
          style={PILL_ACTIVE}
        >
          ▸ filter / drag / sort
        </button>
        <button
          type="button"
          onClick={() => setInteractions(0)}
          style={PILL}
        >
          reset
        </button>
      </div>
      <div
        style={{
          padding: "10px",
          background: "rgba(255,253,245,0.05)",
          border: "1px solid rgba(255,253,245,0.10)",
          borderRadius: "6px",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          lineHeight: 1.7,
        }}
      >
        <div>
          <span style={{ color: "#00FFB2" }}>server</span> · <code>getTasks()</code>
          <span style={{ float: "right", color: "#00FFB2" }}>×1</span>
        </div>
        <div>
          <span style={{ color: "#FFE066" }}>client</span> · re-render
          <span style={{ float: "right", color: "#FFE066" }}>×{interactions}</span>
        </div>
        <div style={{ marginTop: "6px", opacity: 0.7, fontSize: "10.5px" }}>
          {interactions} interactions · 0 server round-trips
        </div>
      </div>
      <p style={FOOT_TEXT}>One server read seeds the store. The browser handles the rest.</p>
    </div>
  );
}
