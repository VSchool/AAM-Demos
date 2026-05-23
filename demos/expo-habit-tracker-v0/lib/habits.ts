/* ============================================================
   Pulse — shared data layer (guideline §2.2)
   Typed sample habits + getAll/getById + status/label maps.
   v0 imports this for the static instrument; the in-memory
   Context store (lib/habit-store.tsx) arrives at the CRUD/
   persistence beat (v2/v4), not here. Session-only until v4 —
   refresh = reset, on purpose.

   In Pulse's "instrument" language a habit is a CHANNEL: it has
   a channel number (CH 01…), an indicator LED, a segment streak
   readout, and a switch you throw.
   ============================================================ */

import type { ReservedRole } from "@/theme/tokens";

export type Cadence = "daily" | "weekdays" | "custom";
export type Window = "morning" | "anytime" | "evening" | "nightly";

/** A habit's live state today maps 1:1 to a reserved role. */
export type HabitStatus = ReservedRole;

export interface Habit {
  id: string;
  /** auto-assigned channel index, 1-based — rendered as "CH 0N". */
  channel: number;
  name: string;
  cadence: Cadence;
  window: Window;
  /** today's state — drives the indicator LED + switch position. */
  status: HabitStatus;
  /** current consecutive-day streak (the orange segment readout). */
  streak: number;
  /** best streak ever reached. */
  bestStreak: number;
  /** last-30-day history, newest last. "done" | "rest" | "miss". */
  history: ("done" | "rest" | "miss")[];
  /** the "why" — surfaced on the detail screen. */
  why?: string;
}

/** Stable sample roster — five live channels for the v0 Today screen. */
const HABITS: Habit[] = [
  {
    id: "morning-walk",
    channel: 1,
    name: "Morning walk",
    cadence: "daily",
    window: "morning",
    status: "done",
    streak: 12,
    bestStreak: 21,
    history: makeHistory(12, [5, 16]),
    why: "Light before screens. Sets the whole day's tempo.",
  },
  {
    id: "read-10",
    channel: 2,
    name: "Read 10 pages",
    cadence: "daily",
    window: "nightly",
    status: "today",
    streak: 4,
    bestStreak: 19,
    history: makeHistory(4, [9, 14]),
    why: "Ten pages a night is twelve books a year. Compounding.",
  },
  {
    id: "drink-water",
    channel: 3,
    name: "Drink water",
    cadence: "daily",
    window: "anytime",
    status: "done",
    streak: 31,
    bestStreak: 31,
    history: makeHistory(31, [3, 15]),
    why: "Eight glasses keeps the headaches away. Future me says thanks.",
  },
  {
    id: "long-run",
    channel: 4,
    name: "Long run",
    cadence: "weekdays",
    window: "morning",
    status: "rest",
    streak: 8,
    bestStreak: 17,
    history: makeHistory(8, [], [1, 6, 13]),
    why: "Rest is part of training. A planned rest day never breaks the chain.",
  },
  {
    id: "sketch",
    channel: 5,
    name: "Sketch",
    cadence: "custom",
    window: "evening",
    status: "today",
    streak: 2,
    bestStreak: 9,
    history: makeHistory(2, [4, 8, 17]),
    why: "Twenty minutes with a pen. No outcome required.",
  },
];

/**
 * Builds a 30-cell history ending today. `streakLen` trailing cells are
 * "done"; `restDays`/`missDays` (offsets from the start) mark exceptions.
 */
function makeHistory(
  streakLen: number,
  missDays: number[] = [],
  restDays: number[] = [],
): ("done" | "rest" | "miss")[] {
  const len = 30;
  // Every cell is "done" except the explicitly marked rest/miss days; the
  // trailing `streakLen` cells are guaranteed clear so the live streak reads true.
  const safeMiss = missDays.filter((d) => d <= len - streakLen);
  const safeRest = restDays.filter((d) => d <= len - streakLen);
  return Array.from({ length: len }, (_, i) => {
    const fromStart = i + 1;
    if (safeRest.includes(fromStart)) return "rest";
    if (safeMiss.includes(fromStart)) return "miss";
    return "done";
  });
}

export function getAll(): Habit[] {
  return HABITS;
}

export function getById(id: string): Habit | undefined {
  return HABITS.find((h) => h.id === id);
}

/** Today's at-a-glance progress (e.g. "5 of 7"). Rest counts as resolved. */
export function todayProgress(): { done: number; total: number } {
  const total = HABITS.length;
  const done = HABITS.filter((h) => h.status === "done" || h.status === "rest").length;
  return { done, total };
}

/** Human label for a reserved status role. */
export const STATUS_LABEL: Record<HabitStatus, string> = {
  done: "Done",
  today: "Due today",
  streak: "On a streak",
  rest: "Rest day",
};

/** Channel code helper — "CH 01", "CH 02", … */
export function channelCode(channel: number): string {
  return `CH ${String(channel).padStart(2, "0")}`;
}

/** Short uppercase descriptor used on channel rows, e.g. "DAILY · MORNING". */
export function cadenceLabel(cadence: Cadence, window: Window): string {
  const c =
    cadence === "weekdays" ? "WEEKDAYS" : cadence === "custom" ? "CUSTOM" : "DAILY";
  return `${c} · ${window.toUpperCase()}`;
}
