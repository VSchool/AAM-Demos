"use client";

// Mini-demos for the v5 deep-dive bento on the home page.

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
// "edit + delete" big tile — deleted-banner toggle demo
// ============================================================

export function DeletedBannerDemo() {
  const [exists, setExists] = useState(true);
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        <button type="button" onClick={() => setExists(true)} style={exists ? PILL_ACTIVE : PILL}>
          task exists
        </button>
        <button type="button" onClick={() => setExists(false)} style={!exists ? PILL_ACTIVE : PILL}>
          deleteTask(id)
        </button>
      </div>
      <div
        style={{
          padding: "10px",
          background: exists ? "rgba(0,255,178,0.06)" : "rgba(255,123,245,0.06)",
          border: `1px solid ${exists ? "rgba(0,255,178,0.40)" : "rgba(255,123,245,0.40)"}`,
          borderRadius: "6px",
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", marginBottom: "4px", color: exists ? "#00FFB2" : "#FF7BF5" }}>
          {exists ? "TaskDetailActions.tsx" : "DeletedBanner"}
        </div>
        {exists ? (
          <div style={{ fontSize: "12px" }}>
            <div style={{ fontWeight: 700 }}>CDN-042</div>
            <div style={{ display: "flex", gap: "5px", marginTop: "6px" }}>
              <span style={{ ...PILL_ACTIVE, padding: "3px 8px" }}>edit</span>
              <span style={{ ...PILL, color: "#FF7BF5", borderColor: "rgba(255,123,245,0.5)", padding: "3px 8px" }}>delete</span>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: "12px" }}>
            <div style={{ fontWeight: 700 }}>Deleted in this session.</div>
            <div style={{ opacity: 0.75, marginTop: "4px" }}>
              The pre-rendered HTML is still there. The actions block reflects the live
              store.
            </div>
          </div>
        )}
      </div>
      <p style={FOOT_TEXT}>
        Detail page renders even after delete — the actions block adapts.
      </p>
    </div>
  );
}

// ============================================================
// "Store actions" — click each action to see its signature
// ============================================================

const ACTIONS = [
  {
    key: "create",
    label: "createTask",
    sig: 'createTask(input: { title, status, priority })',
    body: "Generates a new ID, appends to the head of the list. Sync.",
  },
  {
    key: "update",
    label: "updateTask",
    sig: "updateTask(id, patch: Partial<Task>)",
    body: "Find by ID, merge the patch, replace in place. Sync.",
  },
  {
    key: "delete",
    label: "deleteTask",
    sig: "deleteTask(id: string)",
    body: "Filter the array. The deleted-banner pattern handles the orphan view.",
  },
];

export function StoreActionsDemo() {
  const [key, setKey] = useState("create");
  const a = ACTIONS.find((x) => x.key === key)!;
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "5px", marginBottom: "10px", flexWrap: "wrap" }}>
        {ACTIONS.map((x) => (
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
      <pre
        style={{
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,253,245,0.10)",
          borderRadius: "6px",
          padding: "8px 10px",
          fontFamily: "var(--font-mono)",
          fontSize: "10.5px",
          margin: 0,
          color: "#FFE066",
          marginBottom: "6px",
          whiteSpace: "pre-wrap",
        }}
      >
        <code>{a.sig}</code>
      </pre>
      <div style={{ fontSize: "12px", opacity: 0.85, lineHeight: 1.5 }}>{a.body}</div>
      <p style={FOOT_TEXT}>All three are <code>useCallback</code>-wrapped on the store.</p>
    </div>
  );
}

// ============================================================
// "Persistence" — create then reload, watch state wipe
// ============================================================

const SEED = [
  { id: "CDN-040", title: "Hover state" },
  { id: "CDN-041", title: "Static params" },
];

export function PersistenceDemo() {
  const [tasks, setTasks] = useState(SEED);
  const [n, setN] = useState(100);
  const add = () => {
    const next = `CDN-${n}`;
    setTasks((prev) => [{ id: next, title: "New task" }, ...prev]);
    setN((v) => v + 1);
  };
  const reload = () => {
    setTasks(SEED);
    setN(100);
  };
  const dirty = tasks.length !== SEED.length;
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        <button type="button" onClick={add} style={PILL_ACTIVE}>
          + create
        </button>
        <button type="button" onClick={reload} style={{ ...PILL, color: dirty ? "#FF7BF5" : "rgba(255,253,245,0.85)" }}>
          ↻ reload
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", minHeight: "90px" }}>
        {tasks.map((t) => (
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
          </div>
        ))}
      </div>
      <p style={FOOT_TEXT}>
        Reload resets to <code>getTasks()</code>. W6 is where persistence joins in.
      </p>
    </div>
  );
}

// ============================================================
// "Where the store lives" — layout tree, highlight provider
// ============================================================

export function StoreLocationDemo() {
  const [route, setRoute] = useState<"tasks" | "detail">("tasks");
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        <button type="button" onClick={() => setRoute("tasks")} style={route === "tasks" ? PILL_ACTIVE : PILL}>
          /tasks
        </button>
        <button type="button" onClick={() => setRoute("detail")} style={route === "detail" ? PILL_ACTIVE : PILL}>
          /tasks/[id]
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
          lineHeight: 1.65,
        }}
      >
        <div>app/layout.tsx</div>
        <div style={{ paddingLeft: "12px" }}>
          ├ &lt;Nav /&gt;
        </div>
        <div style={{ paddingLeft: "12px", color: "#00FFB2", fontWeight: 700 }}>
          └ &lt;TaskStoreProvider initial=&#123;getTasks()&#125;&gt;
        </div>
        <div style={{ paddingLeft: "24px", color: route === "tasks" ? "#FFE066" : "rgba(255,253,245,0.6)" }}>
          {"  └ /tasks · <TaskBoard />"}
        </div>
        <div style={{ paddingLeft: "24px", color: route === "detail" ? "#FFE066" : "rgba(255,253,245,0.6)" }}>
          {"  └ /tasks/[id] · <TaskDetailActions />"}
        </div>
      </div>
      <p style={FOOT_TEXT}>
        Both routes render inside the provider — they share one store.
      </p>
    </div>
  );
}

// ============================================================
// "Files added" — click each file to see its role
// ============================================================

const V5_FILES = [
  {
    path: "lib/task-store.tsx",
    role: "Extended from v3. Adds createTask / updateTask / deleteTask actions.",
  },
  {
    path: "components/NewTaskForm.tsx",
    role: "Pill button reveals an inline form. Submit calls createTask.",
  },
  {
    path: "components/TaskBoard.tsx",
    role: "Wraps the columns. Renders NewTaskForm at the top.",
  },
  {
    path: "components/TaskDetailActions.tsx",
    role: "Sits on every detail page. Edit inline, delete with confirm, deleted-banner fallback.",
  },
];

export function FilesAddedDemo() {
  const [idx, setIdx] = useState(0);
  const f = V5_FILES[idx];
  return (
    <div style={SCREEN_STYLE}>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "10px" }}>
        {V5_FILES.map((file, i) => (
          <button
            key={file.path}
            type="button"
            onClick={() => setIdx(i)}
            style={{
              ...(idx === i ? PILL_ACTIVE : PILL),
              justifyContent: "flex-start",
              borderRadius: "5px",
              width: "100%",
              fontSize: "10.5px",
              padding: "5px 9px",
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
          borderLeft: "3px solid #FFE066",
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", opacity: 0.6, marginBottom: "4px" }}>
          ROLE
        </div>
        <div style={{ fontSize: "12px", lineHeight: 1.5 }}>{f.role}</div>
      </div>
      <p style={FOOT_TEXT}>One existing file extended, three new components.</p>
    </div>
  );
}
