"use client";

// Mini-demos for the v0 deep-dive bento on the home page.
// One per small tile, so every box has its own interactive widget — matching
// the v6 deep-dive pattern. Style language tracks V6Demos / VersionDemos.

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

// ============================================================
// "3 routes" tile — file path → URL mapping inspector
// ============================================================

const ROUTES = [
  { file: "app/page.tsx", url: "/", body: "Home — landing for the demo." },
  { file: "app/tasks/page.tsx", url: "/tasks", body: "Tasks (empty in v0)." },
  { file: "app/about/page.tsx", url: "/about", body: "About / progression." },
];

export function RoutesDemo() {
  const [idx, setIdx] = useState(0);
  const r = ROUTES[idx];
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px" }}>
        {ROUTES.map((rt, i) => (
          <button
            key={rt.file}
            type="button"
            onClick={() => setIdx(i)}
            style={{
              ...(idx === i ? PILL_ACTIVE : PILL),
              justifyContent: "flex-start",
              borderRadius: "5px",
              width: "100%",
              fontSize: "10.5px",
            }}
          >
            <span style={{ opacity: idx === i ? 1 : 0.55 }}>▸</span>
            {rt.file}
          </button>
        ))}
      </div>
      <div
        style={{
          background: "rgba(255,253,245,0.05)",
          border: "1px solid rgba(255,253,245,0.10)",
          borderRadius: "6px",
          padding: "10px",
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", opacity: 0.55, marginBottom: "4px", letterSpacing: "0.1em" }}>
          URL
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "#FFE066", marginBottom: "6px" }}>
          localhost{r.url}
        </div>
        <div style={{ opacity: 0.78, fontSize: "11.5px" }}>{r.body}</div>
      </div>
      <p style={FOOT_TEXT}>Each <code>page.tsx</code> claims one URL. No router array.</p>
    </div>
  );
}

// ============================================================
// "States to go" tile — step-through future versions
// ============================================================

// v0 is the starting state — every other state (v1..v6) is still locked.
// Tiles display the version number only; the concept reveals as the student
// moves into that state.
const NEXT_STATES = [
  { v: "v1" },
  { v: "v2" },
  { v: "v3" },
  { v: "v4" },
  { v: "v5" },
  { v: "v6" },
];

export function UpcomingDemo() {
  const [idx, setIdx] = useState(0);
  const s = NEXT_STATES[idx];
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "10px" }}>
        {NEXT_STATES.map((st, i) => (
          <button
            key={st.v}
            type="button"
            onClick={() => setIdx(i)}
            style={{
              ...(idx === i ? PILL_ACTIVE : PILL),
              padding: "4px 9px",
              minWidth: "36px",
              justifyContent: "center",
            }}
          >
            {st.v}
          </button>
        ))}
      </div>
      <div
        style={{
          padding: "10px 12px",
          background: "rgba(255,253,245,0.05)",
          border: "1px dashed rgba(255,253,245,0.20)",
          borderRadius: "6px",
          borderLeft: "3px solid #FF7BF5",
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", opacity: 0.6, marginBottom: "4px" }}>
          {s.v.toUpperCase()} · LOCKED
        </div>
        <div style={{ fontWeight: 700, fontSize: "14px", opacity: 0.85 }}>Coming Soon</div>
        <div style={{ opacity: 0.6, fontSize: "11.5px", marginTop: "4px" }}>
          Unlocks once you reach {s.v}.
        </div>
      </div>
      <p style={FOOT_TEXT}>
        Six states ahead. Each one keeps its surprise until you get there.
      </p>
    </div>
  );
}

// ============================================================
// "Framework" tile — toggle facts about the stack
// ============================================================

const STACK = [
  {
    key: "next",
    label: "Next.js 16",
    body: "App Router. File-based routes, server components by default, output: \"export\" for static builds.",
  },
  {
    key: "react",
    label: "React 19",
    body: "use() hook, async transitions, server components, Actions. v0 doesn't use any of it yet — but it's all available.",
  },
  {
    key: "ts",
    label: "TypeScript",
    body: "Strict mode on. Routes are typed, props are typed. Errors caught at build, not in the browser.",
  },
];

export function FrameworkDemo() {
  const [key, setKey] = useState("next");
  const s = STACK.find((x) => x.key === key)!;
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "5px", marginBottom: "10px", flexWrap: "wrap" }}>
        {STACK.map((x) => (
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
          padding: "10px 12px",
          background: "rgba(255,253,245,0.05)",
          border: "1px solid rgba(255,253,245,0.10)",
          borderRadius: "6px",
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", opacity: 0.6, marginBottom: "4px" }}>
          {s.label.toUpperCase()}
        </div>
        <div style={{ opacity: 0.85, fontSize: "12px", lineHeight: 1.55 }}>{s.body}</div>
      </div>
      <p style={FOOT_TEXT}>The stack is set in v0. v1–v6 add features, not dependencies.</p>
    </div>
  );
}

// ============================================================
// "Build target" tile — run build, watch fake output
// ============================================================

const BUILD_LINES = [
  "▸ next build",
  "  ✓ Compiled successfully",
  "  ✓ Linting and checking validity of types",
  "  ✓ Collecting page data",
  "  ✓ Generating static pages (3/3)",
  "  ✓ Finalizing page optimization",
  "",
  "Route (app)                          Size     First Load JS",
  "┌ ○ /                                 142 B    91.3 kB",
  "├ ○ /about                            142 B    91.3 kB",
  "└ ○ /tasks                            142 B    91.3 kB",
  "",
  "○  (Static)  prerendered as static content",
];

export function BuildTargetDemo() {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [shown, setShown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const run = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("running");
    setShown(0);
    timerRef.current = setInterval(() => {
      setShown((n) => {
        if (n >= BUILD_LINES.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("done");
          return n;
        }
        return n + 1;
      });
    }, 110);
  };

  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        <button type="button" onClick={run} style={PILL_ACTIVE}>
          {phase === "idle" ? "▸ Run next build" : phase === "done" ? "▸ Run again" : "running…"}
        </button>
      </div>
      <div
        style={{
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,253,245,0.10)",
          borderRadius: "6px",
          padding: "10px",
          fontFamily: "var(--font-mono)",
          fontSize: "10.5px",
          lineHeight: 1.5,
          minHeight: "150px",
          whiteSpace: "pre",
          overflow: "hidden",
          color: "rgba(255,253,245,0.85)",
        }}
      >
        {phase === "idle" ? (
          <span style={{ opacity: 0.5 }}>$ _</span>
        ) : (
          BUILD_LINES.slice(0, shown).map((line, i) => (
            <div key={i}>{line || " "}</div>
          ))
        )}
      </div>
      <p style={FOOT_TEXT}>
        Three HTML files. <code>output: &quot;export&quot;</code> in <code>next.config.ts</code>.
      </p>
    </div>
  );
}
