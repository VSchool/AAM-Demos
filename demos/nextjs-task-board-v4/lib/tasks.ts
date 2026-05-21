// ============================================================
// Cadence task data — typed, static, intentionally small.
// In v1 this is read from the client via useEffect.
// In v2 it's read by a server component at request time.
// In v4 the same data drives generateStaticParams for /tasks/[id].
// Real persistence (database, API routes, auth) is Week 6 territory.
// ============================================================

export type TaskStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "blocked"
  | "done"
  | "canceled";

export type TaskPriority = "P0" | "P1" | "P2" | "P3";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string; // initials
  due: string; // "today" | "May 19" | "overdue" | "—"
  labels: string[];
  updated: string; // relative time, e.g. "2 min ago"
}

const TASKS: Task[] = [
  {
    id: "CDN-042",
    title: "Wire client-side filter to server-rendered task list",
    description:
      "Confirm the filter state lives in the client wrapper, not the server parent. The server component should still own the data read from lib/tasks.ts; the client component receives the array as a prop and slices it locally.",
    status: "in_progress",
    priority: "P0",
    assignee: "MP",
    due: "today",
    labels: ["server-component", "routing"],
    updated: "2 min ago",
  },
  {
    id: "CDN-041",
    title: "Add generateStaticParams to the dynamic detail route",
    description:
      "Pre-render every known task at build time so the static export works. generateStaticParams returns an array of { id } objects matching app/tasks/[id]/page.tsx.",
    status: "in_progress",
    priority: "P1",
    assignee: "EK",
    due: "May 19",
    labels: ["routing"],
    updated: "14 min ago",
  },
  {
    id: "CDN-040",
    title: "Add hover state to status flags",
    description:
      "Chevron flags should lift slightly on hover with a 100ms transition. Confirm contrast on every status color stays above 4.5:1.",
    status: "in_progress",
    priority: "P2",
    assignee: "MP",
    due: "May 21",
    labels: ["ui", "a11y"],
    updated: "1 hr ago",
  },
  {
    id: "CDN-039",
    title: "Convert /tasks page to an async server component",
    description:
      "Lift the data read out of useEffect; render at request time, no spinner state machine. This is the v2 transition.",
    status: "blocked",
    priority: "P1",
    assignee: "ZR",
    due: "overdue",
    labels: ["server-component", "blocked-by-design"],
    updated: "yesterday",
  },
  {
    id: "CDN-038",
    title: "Draft a shared layout.tsx with the global nav and footer",
    description:
      "One layout wraps every page; loading.tsx and error.tsx land here too. This is the v6 work.",
    status: "todo",
    priority: "P2",
    assignee: "BY",
    due: "May 22",
    labels: ["chore", "layout"],
    updated: "yesterday",
  },
  {
    id: "CDN-037",
    title: "Audit AI-generated TypeScript prop types",
    description:
      "Confirm every component prop has an explicit interface. Watch for AI generating `any` or implicit any types.",
    status: "todo",
    priority: "P3",
    assignee: "MP",
    due: "May 26",
    labels: ["chore"],
    updated: "2 days ago",
  },
  {
    id: "CDN-036",
    title: "Wire error.tsx at the detail route boundary",
    description:
      "error.tsx catches errors thrown inside its segment. Test with an intentional throw inside /tasks/[id]/page.tsx.",
    status: "todo",
    priority: "P2",
    assignee: "EK",
    due: "May 23",
    labels: ["error-state"],
    updated: "2 days ago",
  },
  {
    id: "CDN-035",
    title: "Audit AI-generated JSX for raw HTML injection of user input",
    description:
      "React escapes {userInput} in JSX by default. Watch for AI generating render paths that bypass this protection.",
    status: "done",
    priority: "P1",
    assignee: "MP",
    due: "May 14",
    labels: ["security"],
    updated: "Fri",
  },
  {
    id: "CDN-034",
    title: "Scaffold three file-routed pages",
    description: "v0 work: home, /tasks, /about via App Router file-based routing.",
    status: "done",
    priority: "P2",
    assignee: "MP",
    due: "May 13",
    labels: ["routing"],
    updated: "Thu",
  },
  {
    id: "CDN-033",
    title: "Pick a UI kit direction for the task-board demo",
    description:
      "Three directions surveyed: Build Log (Linear-spine), Broadsheet (paper + serif), Inverted Studio (violet canvas). Locked direction C.",
    status: "done",
    priority: "P2",
    assignee: "MP",
    due: "May 18",
    labels: ["design"],
    updated: "today",
  },
  {
    id: "CDN-031",
    title: "Stub loading.tsx with skeleton component",
    description:
      "Was canceled in favor of the v6 plan — loading.tsx ships as part of the layout-states state, not as a one-off.",
    status: "canceled",
    priority: "P3",
    assignee: "EK",
    due: "—",
    labels: [],
    updated: "last week",
  },
  {
    id: "CDN-030",
    title: "Prototype kanban drag-and-drop",
    description:
      "Out of scope for this progressive demo — kept here as a future-work marker. Real DnD belongs after persistence lands in W6.",
    status: "backlog",
    priority: "P3",
    assignee: "BY",
    due: "—",
    labels: ["future"],
    updated: "last week",
  },
];

// Read function — used by v1 from a client component via useEffect,
// by v2 from a server component directly, by v4 inside generateStaticParams.
export function getTasks(): Task[] {
  return TASKS;
}

export function getTaskById(id: string): Task | undefined {
  return TASKS.find((t) => t.id === id);
}

// Convenience for chevron flag labels: maps internal status to display text.
export const STATUS_LABEL: Record<TaskStatus, string> = {
  backlog: "Backlog",
  todo: "Todo",
  in_progress: "In progress",
  blocked: "Blocked",
  done: "Done",
  canceled: "Canceled",
};

// Deterministic color slot for a tag label. Same label string -> same color
// everywhere it renders (task card, detail meta, anywhere else).
export function labelClass(label: string): string {
  let h = 0;
  for (let i = 0; i < label.length; i++) {
    h = (h * 31 + label.charCodeAt(i)) | 0;
  }
  const slot = Math.abs(h) % 6;
  return `cn-task-label cn-task-label-c${slot}`;
}

// Deterministic color slot for an assignee avatar. Same assignee string ->
// same color everywhere it renders. Palette deliberately excludes the violet
// canvas family so avatars always pop on the Details aside.
export function avatarClass(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) | 0;
  }
  const slot = Math.abs(h) % 6;
  return `cn-avatar cn-avatar-c${slot}`;
}
