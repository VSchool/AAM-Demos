"use client";

// Mini-demos for the v4 deep-dive bento on the home page.

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
// "Pages added" — type a count, watch IDs build up
// ============================================================

export function PagesAddedDemo() {
  const [count, setCount] = useState(12);
  const ids = Array.from({ length: count }, (_, i) => `CDN-${30 + i}`);
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", opacity: 0.65 }}>tasks</span>
        <input
          type="range"
          min={1}
          max={20}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#FFE066", minWidth: "26px", textAlign: "right" }}>
          {count}
        </span>
      </div>
      <div
        style={{
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,253,245,0.10)",
          borderRadius: "6px",
          padding: "10px",
          fontFamily: "var(--font-mono)",
          fontSize: "10.5px",
          lineHeight: 1.55,
          maxHeight: "160px",
          overflowY: "auto",
          color: "rgba(255,253,245,0.85)",
        }}
      >
        {ids.map((id) => (
          <div key={id}>
            out/tasks/{id}.html{" "}
            <span style={{ opacity: 0.5, fontSize: "9.5px" }}>· SSG</span>
          </div>
        ))}
      </div>
      <p style={FOOT_TEXT}>
        N tasks → N HTML files. <code>generateStaticParams</code> drives the loop.
      </p>
    </div>
  );
}

// ============================================================
// "Files written" — one source, many outputs (animated reveal)
// ============================================================

export function FilesWrittenDemo() {
  const [running, setRunning] = useState(false);
  const [written, setWritten] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ALL = ["CDN-030", "CDN-031", "CDN-032", "CDN-033", "CDN-034", "CDN-035", "CDN-036"];

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const run = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(true);
    setWritten([]);
    let i = 0;
    timerRef.current = setInterval(() => {
      setWritten((prev) => {
        if (i >= ALL.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          setRunning(false);
          return prev;
        }
        const next = [...prev, ALL[i]];
        i++;
        return next;
      });
    }, 180);
  };

  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        <button type="button" onClick={run} disabled={running} style={PILL_ACTIVE}>
          ▸ next build
        </button>
      </div>
      <div
        style={{
          padding: "10px",
          background: "rgba(255,253,245,0.05)",
          border: "1px solid rgba(255,253,245,0.10)",
          borderRadius: "6px",
          fontFamily: "var(--font-mono)",
          fontSize: "10.5px",
          lineHeight: 1.55,
        }}
      >
        <div style={{ color: "#FFE066", marginBottom: "6px" }}>
          source · app/tasks/[id]/page.tsx
        </div>
        <div style={{ opacity: 0.6, marginBottom: "6px" }}>↓</div>
        {written.length === 0 ? (
          <div style={{ opacity: 0.5, fontSize: "11px" }}>Click <em>build</em>.</div>
        ) : (
          written.map((id) => (
            <div key={id} style={{ color: "#00FFB2" }}>
              ✓ out/tasks/{id}.html
            </div>
          ))
        )}
      </div>
      <p style={FOOT_TEXT}>One source file. {ALL.length} HTML outputs at build time.</p>
    </div>
  );
}

// ============================================================
// "TaskCard wrapped in Link" — hover preview behavior toggle
// ============================================================

export function LinkWrapDemo() {
  const [event, setEvent] = useState<"idle" | "hover" | "click">("idle");
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
        <button type="button" onClick={() => setEvent("idle")} style={event === "idle" ? PILL_ACTIVE : PILL}>
          idle
        </button>
        <button type="button" onClick={() => setEvent("hover")} style={event === "hover" ? PILL_ACTIVE : PILL}>
          hover
        </button>
        <button type="button" onClick={() => setEvent("click")} style={event === "click" ? PILL_ACTIVE : PILL}>
          click
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
          lineHeight: 1.6,
        }}
      >
        <div style={{ opacity: 0.55, fontSize: "10px", letterSpacing: "0.1em", marginBottom: "4px" }}>
          NEXT/LINK
        </div>
        {event === "idle" && <div style={{ opacity: 0.7 }}>Card rendered. No network activity.</div>}
        {event === "hover" && (
          <div style={{ color: "#FFE066" }}>
            ↓ prefetch <span style={{ color: "rgba(255,253,245,0.85)" }}>/tasks/CDN-042.html</span>
          </div>
        )}
        {event === "click" && (
          <div style={{ color: "#00FFB2" }}>
            → soft navigation · no full reload
          </div>
        )}
      </div>
      <p style={FOOT_TEXT}>
        <code>&lt;Link&gt;</code> prefetches on hover, swaps the segment on click.
      </p>
    </div>
  );
}

// ============================================================
// "notFound()" — try a known vs unknown id
// ============================================================

const KNOWN_IDS = new Set(["CDN-030", "CDN-040", "CDN-042"]);

export function NotFoundDemo() {
  const [id, setId] = useState("CDN-042");
  const found = KNOWN_IDS.has(id);
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
        {["CDN-030", "CDN-042", "CDN-999"].map((x) => (
          <button key={x} type="button" onClick={() => setId(x)} style={id === x ? PILL_ACTIVE : PILL}>
            {x}
          </button>
        ))}
      </div>
      <div
        style={{
          padding: "10px",
          background: found ? "rgba(0,255,178,0.06)" : "rgba(255,123,245,0.06)",
          border: `1px solid ${found ? "rgba(0,255,178,0.40)" : "rgba(255,123,245,0.40)"}`,
          borderRadius: "6px",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
        }}
      >
        <div style={{ opacity: 0.6, fontSize: "10px", letterSpacing: "0.1em", marginBottom: "4px" }}>
          getTaskById(&quot;{id}&quot;)
        </div>
        {found ? (
          <div style={{ color: "#00FFB2" }}>
            ✓ returns Task → renders detail page
          </div>
        ) : (
          <div style={{ color: "#FF7BF5" }}>
            ✗ returns undefined → notFound() → not-found.tsx
          </div>
        )}
      </div>
      <p style={FOOT_TEXT}>
        Calling <code>notFound()</code> throws — Next catches it and routes to the boundary.
      </p>
    </div>
  );
}
