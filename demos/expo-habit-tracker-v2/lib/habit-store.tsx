/* ============================================================
   Pulse — in-memory habit store (guideline §2.2).
   The CRUD beat. A Context-based store seeded from the static
   roster in lib/habits.ts; the Today tab reads the live list and
   mutates it by patching in new channels. Session-only, on purpose
   — there's no AsyncStorage yet, so a refresh resets to the seed.
   Real persistence is the v4 lesson (the honest fine print says so).

   In Pulse's "instrument" language adding a habit is "patching in a
   channel": it takes the next free channel number, lands in the
   "today" state (due, not yet done — completion is v3's swipe), and
   springs into the list via the v2 withSpring motion primitive.
   ============================================================ */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getAll,
  type Cadence,
  type Habit,
  type Window,
} from "./habits";

/** The fields the add-a-channel form collects; everything else is derived. */
export interface NewHabit {
  name: string;
  cadence: Cadence;
  window: Window;
  why?: string;
}

interface HabitStoreValue {
  habits: Habit[];
  /** patch in a new channel — auto channel #, status defaults to "today". */
  addHabit: (input: NewHabit) => void;
  /** today's at-a-glance progress over the LIVE list (rest counts as kept). */
  progress: { done: number; total: number };
}

const HabitStoreContext = createContext<HabitStoreValue | null>(null);

/** A stable-ish id for a freshly patched-in channel. */
function makeId(name: string, channel: number): string {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${slug || "channel"}-${channel}`;
}

export function HabitStoreProvider({ children }: { children: ReactNode }) {
  // Seed from the static roster — a fresh copy so the module array stays
  // pristine (the home-page DEVICE PREVIEW reads getAll() directly and must
  // keep showing the seed state regardless of what's added here).
  const [habits, setHabits] = useState<Habit[]>(() => getAll().map((h) => ({ ...h })));

  const addHabit = useCallback((input: NewHabit) => {
    setHabits((prev) => {
      const channel = prev.reduce((max, h) => Math.max(max, h.channel), 0) + 1;
      const next: Habit = {
        id: makeId(input.name, channel),
        channel,
        name: input.name.trim() || `Channel ${channel}`,
        cadence: input.cadence,
        window: input.window,
        // A new channel is due today, not yet done — there's nothing to
        // complete until v3's swipe "Throw". It never starts on a streak.
        status: "today",
        streak: 0,
        bestStreak: 0,
        history: [],
        why: input.why?.trim() || undefined,
      };
      return [...prev, next];
    });
  }, []);

  const progress = useMemo(() => {
    const total = habits.length;
    const done = habits.filter((h) => h.status === "done" || h.status === "rest").length;
    return { done, total };
  }, [habits]);

  const value = useMemo<HabitStoreValue>(
    () => ({ habits, addHabit, progress }),
    [habits, addHabit, progress],
  );

  return <HabitStoreContext.Provider value={value}>{children}</HabitStoreContext.Provider>;
}

export function useHabitStore(): HabitStoreValue {
  const ctx = useContext(HabitStoreContext);
  if (!ctx) {
    throw new Error("useHabitStore must be used inside <HabitStoreProvider>");
  }
  return ctx;
}
