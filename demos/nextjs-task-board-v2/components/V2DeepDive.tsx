"use client";

// Mini-demos for the v2 deep-dive bento on the home page.

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

const CODE_BOX: React.CSSProperties = {
  background: "rgba(0,0,0,0.4)",
  border: "1px solid rgba(255,253,245,0.10)",
  borderRadius: "6px",
  padding: "10px",
  fontFamily: "var(--font-mono)",
  fontSize: "10.5px",
  lineHeight: 1.55,
  margin: 0,
  whiteSpace: "pre",
  overflow: "auto",
  color: "rgba(255,253,245,0.88)",
};

// ============================================================
// "Hooks removed" — toggle v1 / v2 to see the lines deleted
// ============================================================

export function HooksRemovedDemo() {
  const [mode, setMode] = useState<"v1" | "v2">("v2");
  const v1 = `"use client";
const [tasks, setTasks] = useState(null);

useEffect(() => {
  setTasks(getTasks());
}, []);

if (tasks === null) return <Skeleton />;
return <List items={tasks} />;`;
  const v2 = `// no "use client"
export default async function TasksPage() {
  const tasks = getTasks();
  return <List items={tasks} />;
}`;
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        <button type="button" onClick={() => setMode("v1")} style={mode === "v1" ? PILL_ACTIVE : PILL}>
          v1 · 3 hooks
        </button>
        <button type="button" onClick={() => setMode("v2")} style={mode === "v2" ? PILL_ACTIVE : PILL}>
          v2 · 0 hooks
        </button>
      </div>
      <pre style={CODE_BOX}>
        <code>{mode === "v1" ? v1 : v2}</code>
      </pre>
      <p style={FOOT_TEXT}>
        Same UI on screen. v2 deletes the state machine.
      </p>
    </div>
  );
}

// ============================================================
// "Loading delay" — compare client spinner vs server instant
// ============================================================

export function LoadingDiffDemo() {
  const [mode, setMode] = useState<"client" | "server">("server");
  const [clientPhase, setClientPhase] = useState<"loading" | "ready">("loading");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (mode === "client") {
      setClientPhase("loading");
      timerRef.current = setTimeout(() => setClientPhase("ready"), 700);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mode]);

  const ready = mode === "server" ? true : clientPhase === "ready";

  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        <button type="button" onClick={() => setMode("client")} style={mode === "client" ? PILL_ACTIVE : PILL}>
          v1 client
        </button>
        <button type="button" onClick={() => setMode("server")} style={mode === "server" ? PILL_ACTIVE : PILL}>
          v2 server
        </button>
      </div>
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
        {!ready ? (
          <>
            <span
              style={{
                width: "11px",
                height: "11px",
                borderRadius: "50%",
                border: "2px solid rgba(255,253,245,0.25)",
                borderTopColor: "#FFE066",
                animation: "v2-spin 0.7s linear infinite",
              }}
            />
            <span style={{ fontSize: "11.5px" }}>Loading tasks…</span>
            <style>{`@keyframes v2-spin { to { transform: rotate(360deg); } }`}</style>
          </>
        ) : (
          <span style={{ fontSize: "11.5px", color: "#00FFB2" }}>
            ✓ Tasks rendered {mode === "server" ? "on arrival" : "after 700ms"}
          </span>
        )}
      </div>
      <p style={FOOT_TEXT}>Server mode: HTML arrives populated. No spinner.</p>
    </div>
  );
}

// ============================================================
// "What stayed" — toggle showing who reads lib/tasks.ts
// ============================================================

export function CallerSwitchDemo() {
  const [who, setWho] = useState<"v1" | "v2">("v2");
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        <button type="button" onClick={() => setWho("v1")} style={who === "v1" ? PILL_ACTIVE : PILL}>
          v1 · client reads
        </button>
        <button type="button" onClick={() => setWho("v2")} style={who === "v2" ? PILL_ACTIVE : PILL}>
          v2 · server reads
        </button>
      </div>
      <div
        style={{
          padding: "10px",
          background: "rgba(255,253,245,0.05)",
          border: "1px solid rgba(255,253,245,0.10)",
          borderRadius: "6px",
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", opacity: 0.6, marginBottom: "6px" }}>
          {who === "v1" ? "BROWSER · after hydration" : "BUILD · before ship"}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: who === "v1" ? "#FF7BF5" : "#00FFB2",
          }}
        >
          {who === "v1" ? '"use client" /tasks' : "async TasksPage()"}
          {"  ──→  "}
          <span style={{ color: "#FFE066" }}>lib/tasks.ts</span>
        </div>
      </div>
      <p style={FOOT_TEXT}>The file didn&apos;t change. The caller did.</p>
    </div>
  );
}

// ============================================================
// "What landed" — async function shape (click to reveal parts)
// ============================================================

const FN_PARTS = [
  { key: "async", label: "async", body: "Server components can be async. Top-level await is allowed." },
  { key: "fn", label: "function TasksPage()", body: "Same default-export shape as a regular page.tsx. No special wrapper." },
  { key: "return", label: "return JSX", body: "The return value is rendered to HTML on the server, before the bundle ships." },
];

export function AsyncFunctionDemo() {
  const [key, setKey] = useState("async");
  const p = FN_PARTS.find((x) => x.key === key)!;
  const lines = [
    { txt: "export default ", k: null as string | null },
    { txt: "async", k: "async" },
    { txt: " ", k: null },
    { txt: "function TasksPage()", k: "fn" },
    { txt: " {", k: null },
  ];
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "5px", marginBottom: "10px", flexWrap: "wrap" }}>
        {FN_PARTS.map((x) => (
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
      <pre style={CODE_BOX}>
        <code>
          {lines.map((l, i) => (
            <span
              key={i}
              style={{
                background: l.k === key ? "rgba(0,255,178,0.18)" : "transparent",
                color: l.k === key ? "#00FFB2" : "rgba(255,253,245,0.88)",
                fontWeight: l.k === key ? 700 : 400,
                padding: l.k === key ? "1px 2px" : "0",
                borderRadius: "2px",
              }}
            >
              {l.txt}
            </span>
          ))}
          {"\n  const tasks = "}
          <span style={{
            background: key === "return" ? "rgba(0,255,178,0.18)" : "transparent",
            color: key === "return" ? "#00FFB2" : "rgba(255,253,245,0.88)",
          }}>getTasks()</span>
          {";\n  "}
          <span style={{
            background: key === "return" ? "rgba(0,255,178,0.18)" : "transparent",
            color: key === "return" ? "#00FFB2" : "rgba(255,253,245,0.88)",
            fontWeight: key === "return" ? 700 : 400,
          }}>return &lt;List items={"{tasks}"} /&gt;;</span>
          {"\n}"}
        </code>
      </pre>
      <div
        style={{
          marginTop: "8px",
          padding: "8px 10px",
          background: "rgba(255,253,245,0.04)",
          borderLeft: "3px solid #00FFB2",
          borderRadius: "0 6px 6px 0",
          fontSize: "11.5px",
          opacity: 0.9,
        }}
      >
        {p.body}
      </div>
      <p style={FOOT_TEXT}>Three pieces, one signature. Standard server-component shape.</p>
    </div>
  );
}
