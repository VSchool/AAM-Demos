"use client";

// Mini interactive demos for each version state (v0–v6).
// Each demo lives inside an ExpandableTile on the /about page and illustrates
// what that version introduced — file routing, useEffect, server rendering,
// client filter, dynamic route, CRUD, loading/error boundaries.
// All demos are self-contained: no real navigation, no real persistence.

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

const URL_BAR_STYLE: React.CSSProperties = {
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
  marginBottom: "10px",
};

const PILL_STYLE: React.CSSProperties = {
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

const PILL_ACTIVE_STYLE: React.CSSProperties = {
  ...PILL_STYLE,
  background: "#00FFB2",
  color: "#002418",
  border: "1px solid #00FFB2",
  fontWeight: 700,
};

const ROW_STYLE: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  padding: "8px 10px",
  background: "rgba(255,253,245,0.04)",
  border: "1px solid rgba(255,253,245,0.08)",
  borderRadius: "6px",
};

const STATUS_DOT: Record<string, string> = {
  todo: "rgba(255,253,245,0.5)",
  doing: "#FFE066",
  done: "#00FFB2",
};

const STATUS_LABEL: Record<string, string> = {
  todo: "Todo",
  doing: "Doing",
  done: "Done",
};

// ---------- v0 · scaffold + file routing ----------

const V0_ROUTES = [
  { file: "app/page.tsx", url: "/", preview: "Cadence — home" },
  { file: "app/tasks/page.tsx", url: "/tasks", preview: "All tasks." },
  { file: "app/about/page.tsx", url: "/about", preview: "About the demo." },
];

export function DemoV0() {
  const [active, setActive] = useState(0);
  const r = V0_ROUTES[active];
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", opacity: 0.6, marginBottom: "6px" }}>
            FILES
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {V0_ROUTES.map((rt, i) => (
              <button
                key={rt.file}
                type="button"
                onClick={() => setActive(i)}
                style={{
                  ...PILL_STYLE,
                  ...(active === i ? PILL_ACTIVE_STYLE : {}),
                  justifyContent: "flex-start",
                  width: "100%",
                  borderRadius: "6px",
                }}
              >
                {rt.file}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={URL_BAR_STYLE}>
            <span style={{ opacity: 0.5 }}>localhost</span>
            <span>{r.url}</span>
          </div>
          <div
            style={{
              background: "rgba(255,253,245,0.04)",
              border: "1px solid rgba(255,253,245,0.08)",
              borderRadius: "6px",
              padding: "16px",
              minHeight: "70px",
              display: "grid",
              placeContent: "center",
              fontWeight: 600,
            }}
          >
            {r.preview}
          </div>
        </div>
      </div>
      <p style={{ marginTop: "10px", opacity: 0.65, fontSize: "12px" }}>
        Drop a <code>page.tsx</code> into a folder under <code>app/</code> and the
        folder path becomes the URL. No router config — file = route.
      </p>
    </div>
  );
}

// ---------- v1 · client list (useState + useEffect) ----------

const SAMPLE_TASKS = [
  { id: "CDN-042", title: "Wire client filter", status: "doing" },
  { id: "CDN-041", title: "Add generateStaticParams", status: "doing" },
  { id: "CDN-040", title: "Hover state for flags", status: "todo" },
];

export function DemoV1() {
  const [phase, setPhase] = useState<"idle" | "loading" | "ready">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const run = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("loading");
    timerRef.current = setTimeout(() => setPhase("ready"), 700);
  };

  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        <button type="button" onClick={run} style={PILL_ACTIVE_STYLE}>
          ▸ Mount component
        </button>
        <button
          type="button"
          onClick={() => {
            if (timerRef.current) clearTimeout(timerRef.current);
            setPhase("idle");
          }}
          style={PILL_STYLE}
        >
          Reset
        </button>
      </div>
      <div style={{ minHeight: "110px" }}>
        {phase === "idle" && (
          <div style={{ opacity: 0.55, fontSize: "12px" }}>
            Click <em>Mount</em>. <code>useEffect</code> fires once, kicks off the
            fetch, sets state when it returns.
          </div>
        )}
        {phase === "loading" && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: 0.85 }}>
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: "2px solid rgba(255,253,245,0.25)",
                borderTopColor: "#FFE066",
                animation: "spin 0.7s linear infinite",
                display: "inline-block",
              }}
            />
            <span>Loading tasks…</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
        {phase === "ready" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {SAMPLE_TASKS.map((t) => (
              <div key={t.id} style={ROW_STYLE}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", opacity: 0.6 }}>
                  {t.id}
                </span>
                <span style={{ flex: 1 }}>{t.title}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: STATUS_DOT[t.status],
                    }}
                  />
                  {STATUS_LABEL[t.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <p style={{ marginTop: "10px", opacity: 0.65, fontSize: "12px" }}>
        Cost: a spinner flash every visit, plus the JS bundle to run{" "}
        <code>useEffect</code>. v2 deletes both.
      </p>
    </div>
  );
}

// ---------- v2 · server list ----------

export function DemoV2() {
  const [mode, setMode] = useState<"client" | "server">("server");
  const [clientPhase, setClientPhase] = useState<"loading" | "ready">("loading");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (mode === "client") {
      setClientPhase("loading");
      timerRef.current = setTimeout(() => setClientPhase("ready"), 650);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mode]);

  const ready =
    mode === "server" ? true : clientPhase === "ready";

  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        <button
          type="button"
          onClick={() => setMode("client")}
          style={mode === "client" ? PILL_ACTIVE_STYLE : PILL_STYLE}
        >
          Client (v1)
        </button>
        <button
          type="button"
          onClick={() => setMode("server")}
          style={mode === "server" ? PILL_ACTIVE_STYLE : PILL_STYLE}
        >
          Server (v2)
        </button>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            opacity: 0.6,
            alignSelf: "center",
          }}
        >
          {mode === "server" ? "rendered at build time" : "rendered in browser"}
        </span>
      </div>
      <div style={{ minHeight: "110px" }}>
        {!ready ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: 0.85 }}>
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: "2px solid rgba(255,253,245,0.25)",
                borderTopColor: "#FFE066",
                animation: "spin 0.7s linear infinite",
              }}
            />
            <span>Loading tasks…</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {SAMPLE_TASKS.map((t) => (
              <div key={t.id} style={ROW_STYLE}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", opacity: 0.6 }}>
                  {t.id}
                </span>
                <span style={{ flex: 1 }}>{t.title}</span>
                <span style={{ fontSize: "11px", opacity: 0.65 }}>{STATUS_LABEL[t.status]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <p style={{ marginTop: "10px", opacity: 0.65, fontSize: "12px" }}>
        Same UI. Server mode skips the spinner — the HTML arrives already populated.
      </p>
    </div>
  );
}

// ---------- v3 · client filter on a server list ----------

const V3_TASKS = [
  { id: "CDN-042", title: "Wire client filter", status: "doing" },
  { id: "CDN-041", title: "Add generateStaticParams", status: "doing" },
  { id: "CDN-040", title: "Hover state for flags", status: "todo" },
  { id: "CDN-039", title: "Convert /tasks to server", status: "done" },
  { id: "CDN-038", title: "Shared layout.tsx", status: "todo" },
];

type StatusFilter = "all" | "todo" | "doing" | "done";

export function DemoV3() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const visible =
    filter === "all" ? V3_TASKS : V3_TASKS.filter((t) => t.status === filter);

  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
        {(["all", "todo", "doing", "done"] as StatusFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            style={filter === f ? PILL_ACTIVE_STYLE : PILL_STYLE}
          >
            {f === "all" ? "All" : STATUS_LABEL[f]}
            <span style={{ opacity: 0.7, marginLeft: "4px" }}>
              {f === "all" ? V3_TASKS.length : V3_TASKS.filter((t) => t.status === f).length}
            </span>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", minHeight: "150px" }}>
        {visible.length === 0 ? (
          <div style={{ opacity: 0.5, fontSize: "12px" }}>No matches.</div>
        ) : (
          visible.map((t) => (
            <div key={t.id} style={ROW_STYLE}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", opacity: 0.6 }}>
                {t.id}
              </span>
              <span style={{ flex: 1 }}>{t.title}</span>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: STATUS_DOT[t.status],
                }}
              />
            </div>
          ))
        )}
      </div>
      <p style={{ marginTop: "10px", opacity: 0.65, fontSize: "12px" }}>
        Server owns the array. Client owns the chips. Filter is instant — no
        re-fetch.
      </p>
    </div>
  );
}

// ---------- v4 · dynamic detail route ----------

const V4_TASKS = [
  {
    id: "CDN-042",
    title: "Wire client filter",
    status: "doing",
    assignee: "MP",
    desc: "Filter state lives in the client wrapper, not the server parent.",
  },
  {
    id: "CDN-041",
    title: "Add generateStaticParams",
    status: "doing",
    assignee: "EK",
    desc: "Pre-render every known task at build time for the static export.",
  },
  {
    id: "CDN-040",
    title: "Hover state for flags",
    status: "todo",
    assignee: "MP",
    desc: "Flags lift slightly on hover. Confirm contrast stays above 4.5:1.",
  },
];

export function DemoV4() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = V4_TASKS.find((t) => t.id === openId);

  return (
    <div style={SCREEN_STYLE}>
      <div style={URL_BAR_STYLE}>
        <span style={{ opacity: 0.5 }}>localhost</span>
        <span>/tasks{open ? `/${open.id}` : ""}</span>
      </div>
      {!open ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {V4_TASKS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setOpenId(t.id)}
              style={{
                ...ROW_STYLE,
                textAlign: "left",
                color: "inherit",
                cursor: "pointer",
                font: "inherit",
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", opacity: 0.6 }}>
                {t.id}
              </span>
              <span style={{ flex: 1 }}>{t.title}</span>
              <span style={{ opacity: 0.5, fontSize: "11px" }}>open →</span>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setOpenId(null)}
            style={{ ...PILL_STYLE, marginBottom: "10px" }}
          >
            ← Back to /tasks
          </button>
          <div
            style={{
              background: "rgba(255,253,245,0.04)",
              border: "1px solid rgba(255,253,245,0.08)",
              borderRadius: "8px",
              padding: "12px",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", opacity: 0.6 }}>
              {open.id} · {open.assignee}
            </div>
            <div style={{ fontWeight: 700, fontSize: "15px", margin: "4px 0 8px" }}>
              {open.title}
            </div>
            <div style={{ opacity: 0.8, fontSize: "12.5px" }}>{open.desc}</div>
          </div>
        </div>
      )}
      <p style={{ marginTop: "10px", opacity: 0.65, fontSize: "12px" }}>
        <code>app/tasks/[id]/page.tsx</code> handles every task id with one file.
        <code>generateStaticParams</code> pre-renders an HTML page per id at build.
      </p>
    </div>
  );
}

// ---------- v5 · CRUD UI on a client-side store ----------

let nextId = 100;

export function DemoV5() {
  const [tasks, setTasks] = useState([
    { id: "CDN-042", title: "Wire client filter" },
    { id: "CDN-041", title: "Add generateStaticParams" },
    { id: "CDN-040", title: "Hover state for flags" },
  ]);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const add = () => {
    const title = draft.trim();
    if (!title) return;
    setTasks((prev) => [{ id: `CDN-${nextId++}`, title }, ...prev]);
    setDraft("");
  };
  const startEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditDraft(title);
  };
  const commitEdit = () => {
    if (!editingId) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === editingId ? { ...t, title: editDraft.trim() || t.title } : t)),
    );
    setEditingId(null);
  };
  const del = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
          placeholder="New task title…"
          style={{
            flex: 1,
            background: "rgba(255,253,245,0.06)",
            border: "1px solid rgba(255,253,245,0.18)",
            borderRadius: "6px",
            padding: "6px 10px",
            color: "#FFFDF5",
            fontSize: "12.5px",
            fontFamily: "var(--font-sans)",
          }}
        />
        <button type="button" onClick={add} style={PILL_ACTIVE_STYLE}>
          + Add
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", minHeight: "110px" }}>
        {tasks.length === 0 ? (
          <div style={{ opacity: 0.5, fontSize: "12px" }}>Empty board.</div>
        ) : (
          tasks.map((t) => (
            <div key={t.id} style={ROW_STYLE}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", opacity: 0.6 }}>
                {t.id}
              </span>
              {editingId === t.id ? (
                <input
                  value={editDraft}
                  onChange={(e) => setEditDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitEdit();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onBlur={commitEdit}
                  autoFocus
                  style={{
                    flex: 1,
                    background: "rgba(255,253,245,0.10)",
                    border: "1px solid rgba(255,253,245,0.25)",
                    borderRadius: "4px",
                    padding: "3px 8px",
                    color: "#FFFDF5",
                    font: "inherit",
                  }}
                />
              ) : (
                <span style={{ flex: 1 }}>{t.title}</span>
              )}
              <button
                type="button"
                onClick={() => startEdit(t.id, t.title)}
                style={{ ...PILL_STYLE, padding: "3px 8px", fontSize: "10px" }}
              >
                edit
              </button>
              <button
                type="button"
                onClick={() => del(t.id)}
                style={{
                  ...PILL_STYLE,
                  padding: "3px 8px",
                  fontSize: "10px",
                  borderColor: "rgba(255,123,245,0.5)",
                  color: "#FF7BF5",
                }}
              >
                delete
              </button>
            </div>
          ))
        )}
      </div>
      <p style={{ marginTop: "10px", opacity: 0.65, fontSize: "12px" }}>
        All changes live in a <code>useState</code> store. Refresh this page and
        the demo resets — the patterns are real, the persistence is theatre.
      </p>
    </div>
  );
}

// ---------- v6 · loading.tsx + error.tsx ----------

export function DemoV6() {
  const [scene, setScene] = useState<"idle" | "loading" | "loaded" | "error">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const triggerLoad = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setScene("loading");
    timerRef.current = setTimeout(() => setScene("loaded"), 900);
  };
  const triggerError = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setScene("error");
  };
  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setScene("idle");
  };

  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
        <button type="button" onClick={triggerLoad} style={PILL_ACTIVE_STYLE}>
          Slow load
        </button>
        <button
          type="button"
          onClick={triggerError}
          style={{
            ...PILL_STYLE,
            borderColor: "rgba(255,123,245,0.5)",
            color: "#FF7BF5",
          }}
        >
          Throw error
        </button>
        <button type="button" onClick={reset} style={PILL_STYLE}>
          Reset
        </button>
      </div>
      <div style={{ minHeight: "130px" }}>
        {scene === "idle" && (
          <div style={{ opacity: 0.55, fontSize: "12px" }}>
            Pick a button. <em>Slow load</em> shows <code>loading.tsx</code> for a
            beat. <em>Throw error</em> bounces to <code>error.tsx</code> with a
            retry handler.
          </div>
        )}
        {scene === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ height: "14px", width: "30%", background: "rgba(255,253,245,0.10)", borderRadius: "4px", animation: "pulse 1.2s ease-in-out infinite" }} />
            <div style={{ height: "22px", width: "70%", background: "rgba(255,253,245,0.10)", borderRadius: "4px", animation: "pulse 1.2s ease-in-out infinite" }} />
            <div style={{ height: "10px", width: "90%", background: "rgba(255,253,245,0.08)", borderRadius: "4px", animation: "pulse 1.2s ease-in-out infinite" }} />
            <div style={{ height: "10px", width: "80%", background: "rgba(255,253,245,0.08)", borderRadius: "4px", animation: "pulse 1.2s ease-in-out infinite" }} />
            <div style={{ height: "10px", width: "60%", background: "rgba(255,253,245,0.08)", borderRadius: "4px", animation: "pulse 1.2s ease-in-out infinite" }} />
            <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
          </div>
        )}
        {scene === "loaded" && (
          <div
            style={{
              background: "rgba(0,255,178,0.06)",
              border: "1px solid rgba(0,255,178,0.30)",
              borderRadius: "8px",
              padding: "12px",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#00FFB2", marginBottom: "4px" }}>
              CDN-042 · MP
            </div>
            <div style={{ fontWeight: 700, marginBottom: "4px" }}>
              Wire client filter to server-rendered task list
            </div>
            <div style={{ opacity: 0.75, fontSize: "12.5px" }}>
              Segment hydrated. Skeleton swapped out — same nav and footer stayed
              mounted the whole time.
            </div>
          </div>
        )}
        {scene === "error" && (
          <div
            style={{
              background: "rgba(255,123,245,0.06)",
              border: "1px solid rgba(255,123,245,0.40)",
              borderRadius: "8px",
              padding: "12px",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#FF7BF5", marginBottom: "4px" }}>
              ERROR · caught by error.tsx
            </div>
            <div style={{ fontWeight: 700, marginBottom: "6px" }}>
              Something broke inside this segment.
            </div>
            <div style={{ opacity: 0.75, fontSize: "12.5px", marginBottom: "10px" }}>
              Nav and footer are still here. Only the segment was replaced.
            </div>
            <button type="button" onClick={reset} style={PILL_ACTIVE_STYLE}>
              ↻ Try again
            </button>
          </div>
        )}
      </div>
      <p style={{ marginTop: "10px", opacity: 0.65, fontSize: "12px" }}>
        Both files are co-located with the segment they protect — Next.js wires
        the Suspense boundary and the error boundary automatically.
      </p>
    </div>
  );
}
