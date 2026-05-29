/* ============================================================
   Pulse — habit store (guideline §2.2), now PERSISTENT (v4).
   The v4 beat: AsyncStorage. The store seeds from the static roster
   in lib/habits.ts the FIRST time it runs, then HYDRATES from
   AsyncStorage on every launch and PERSISTS on every mutation. On
   web AsyncStorage is localStorage — so the deployed build now
   survives a refresh (refresh NO LONGER resets; that's the v4 honest
   fine print). A resetToSeed() affordance keeps the demo resettable.

   v4 also makes REST a first-class, non-punishing state you can reach
   by gesture. The "instrument" language: adding a habit is "patching
   in a channel"; completing it is "throwing the switch"; a swipe the
   other way "parks it on rest" — a planned pause that HOLDS the streak
   rather than shattering it. Pulse never punishes.
   ============================================================ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAll,
  type Cadence,
  type Habit,
  type Window,
} from "./habits";
import { layoutReflow } from "@/components/motion";

/** Where the roster lives on disk (localStorage key on web). Versioned per
    demo version so each standalone app keeps isolated state — all versions
    deploy to the same origin, so the key (not the URL path) is the boundary. */
const STORAGE_KEY = "pulse.habits.v6";

/** The fields the add-a-channel form collects; everything else is derived. */
export interface NewHabit {
  name: string;
  cadence: Cadence;
  window: Window;
  why?: string;
}

interface HabitStoreValue {
  habits: Habit[];
  /** false until the first read from AsyncStorage resolves (drives the splash). */
  ready: boolean;
  /** patch in a new channel — auto channel #, status defaults to "today". */
  addHabit: (input: NewHabit) => void;
  /** tap / quick toggle: not-done→done (+1) · done→today (−1). */
  toggleDone: (id: string) => void;
  /** swipe RIGHT → complete: today/rest→done (+1) · done→done (no-op). */
  markDone: (id: string) => void;
  /** swipe LEFT → park on rest: today→rest (streak HOLDS) · done→today (−1) ·
      rest→rest (no-op). Rest NEVER touches the streak. */
  markRest: (id: string) => void;
  /** wipe persisted state and restore the seed roster (Settings affordance). */
  resetToSeed: () => void;
  /** v5: drop a channel from the roster (the Delete action on the detail
      screen). No re-channel-numbering — the gap stays so older entries keep
      their CH 0N identity. The reflow runs first so the list animates closed. */
  removeHabit: (id: string) => void;
  /** v5: edit a channel's user-set fields (name/cadence/window/why) from the
      detail screen's Edit action. PARTIAL — only the passed fields change;
      streak, bestStreak, history, status, channel and id are preserved (a
      rename never resets progress, and the id stays stable so the
      /habit/<id> route + history survive). */
  updateHabit: (id: string, patch: Partial<NewHabit>) => void;
  /** today's at-a-glance progress over the LIVE list (rest counts as kept). */
  progress: { done: number; total: number };
}

const HabitStoreContext = createContext<HabitStoreValue | null>(null);

/** A fresh, mutable copy of the seed roster (the module array stays pristine
    — the home-page DEVICE PREVIEW reads getAll() directly). */
function seedCopy(): Habit[] {
  return getAll().map((h) => ({ ...h }));
}

/** A stable-ish id for a freshly patched-in channel. */
function makeId(name: string, channel: number): string {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${slug || "channel"}-${channel}`;
}

export function HabitStoreProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [ready, setReady] = useState(false);
  // Gate the persist effect: don't write until hydration has finished, or the
  // empty initial state would clobber what's on disk before we've read it.
  const hydrated = useRef(false);

  // ---- HYDRATE on mount (the v4 lesson) -------------------------------
  // Read the roster back from AsyncStorage; fall back to the seed on a first
  // run or a parse error. The list arrival is wrapped in a LayoutAnimation so
  // the restored channels animate in (the v4 motion primitive).
  useEffect(() => {
    let alive = true;
    (async () => {
      let restored: Habit[] | null = null;
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length) restored = parsed as Habit[];
        }
      } catch {
        restored = null; // corrupt / unavailable → fall back to seed
      }
      if (!alive) return;
      layoutReflow();
      setHabits(restored ?? seedCopy());
      hydrated.current = true;
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ---- PERSIST on every mutation --------------------------------------
  // Once hydrated, mirror the live roster to AsyncStorage whenever it changes.
  useEffect(() => {
    if (!hydrated.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits)).catch(() => {});
  }, [habits]);

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
        // complete until you throw the switch. It never starts on a streak.
        status: "today",
        streak: 0,
        bestStreak: 0,
        history: [],
        why: input.why?.trim() || undefined,
      };
      return [...prev, next];
    });
  }, []);

  // tap / quick toggle. not-done→done bumps the streak (+ best on a new high);
  // done→today walks it back. A rest channel tapped counts as done.
  const toggleDone = useCallback((id: string) => {
    layoutReflow();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        if (h.status === "done") {
          return { ...h, status: "today", streak: Math.max(0, h.streak - 1) };
        }
        const streak = h.streak + 1;
        return { ...h, status: "done", streak, bestStreak: Math.max(h.bestStreak, streak) };
      }),
    );
  }, []);

  // swipe RIGHT → complete (idempotent toward done). today/rest→done (+1);
  // already-done stays done (no double count).
  const markDone = useCallback((id: string) => {
    layoutReflow();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id || h.status === "done") return h;
        const streak = h.streak + 1;
        return { ...h, status: "done", streak, bestStreak: Math.max(h.bestStreak, streak) };
      }),
    );
  }, []);

  // swipe LEFT → park on rest / un-throw. The kind-rest-day logic:
  //   today → rest   (a planned pause; the streak HOLDS, neither climbs nor breaks)
  //   done  → today  (un-throw a completion; streak −1)
  //   rest  → rest   (no-op)
  // Entering done is the ONLY +1; leaving done the only −1. Rest is untouched.
  const markRest = useCallback((id: string) => {
    layoutReflow();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        if (h.status === "done") {
          return { ...h, status: "today", streak: Math.max(0, h.streak - 1) };
        }
        if (h.status === "today") {
          return { ...h, status: "rest" }; // streak holds — Pulse never punishes
        }
        return h; // already resting
      }),
    );
  }, []);

  // Wipe disk + restore the seed roster, so the demo stays resettable now
  // that refresh no longer clears it (Settings affordance).
  const resetToSeed = useCallback(() => {
    layoutReflow();
    setHabits(seedCopy());
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, []);

  // Delete a channel (v5 — the Delete action on the detail screen). Fires
  // layoutReflow() first so the Today list animates the gap closed when the
  // user navigates back. Persist effect picks up the change automatically.
  const removeHabit = useCallback((id: string) => {
    layoutReflow();
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  // Edit a channel from the detail screen (v5). A PARTIAL update: only the
  // user-editable fields move; the id stays put (so the route + history hold)
  // and streak/bestStreak/history/status/channel are never touched. A blank
  // name falls back to the existing one — editing can't erase a channel's name.
  const updateHabit = useCallback((id: string, patch: Partial<NewHabit>) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const next = { ...h };
        if (patch.name !== undefined) next.name = patch.name.trim() || h.name;
        if (patch.cadence !== undefined) next.cadence = patch.cadence;
        if (patch.window !== undefined) next.window = patch.window;
        if ("why" in patch) next.why = patch.why?.trim() || undefined;
        return next;
      }),
    );
  }, []);

  const progress = useMemo(() => {
    const total = habits.length;
    const done = habits.filter((h) => h.status === "done" || h.status === "rest").length;
    return { done, total };
  }, [habits]);

  const value = useMemo<HabitStoreValue>(
    () => ({
      habits,
      ready,
      addHabit,
      toggleDone,
      markDone,
      markRest,
      resetToSeed,
      removeHabit,
      updateHabit,
      progress,
    }),
    [habits, ready, addHabit, toggleDone, markDone, markRest, resetToSeed, removeHabit, updateHabit, progress],
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
