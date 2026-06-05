/* ============================================================
   tour — the "what's new" walkthrough engine.

   A real app shows you what changed after an update. This drives that:
   an overlay that auto-runs on first entry to the app, steps through the
   version's NEW things, and SPOTLIGHTS what's visibly new with a bold,
   theme-coloured ring that moves from element to element as the cards
   advance. When a change isn't visible on the current screen, the step
   has no target and the card just explains it (what carried over vs.
   what's new). When finished it collapses into a "What's new" pill that
   re-opens it any time.

   Spotlighting is measurement-based: a <TourTarget id> wrapper reports
   its on-screen rect (via measureInWindow) into this context; the overlay
   reads the active step's target rect — converted to coordinates relative
   to the phone screen — and draws the ring there. Per-version the STEPS
   change; the engine doesn't.
   ============================================================ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type Rect = { x: number; y: number; w: number; h: number };

export type TourStep = {
  tag: string;
  title: string;
  body: string;
  /** id of a <TourTarget> to ring; omit for an explanatory (no-highlight) step. */
  target?: string;
};

/* v2's steps. The new beat is the add-a-channel form, so the first step
   rings it; the second explains the list/store behind it. */
export const V2_TOUR: TourStep[] = [
  {
    tag: "v2 · what's new",
    title: "Patch in a channel",
    body:
      "Since the last version, Today is a live list you can grow. Tap “Patch in a channel” to add a habit — give it a label, cadence, and window — and it springs into the list.",
    target: "add-form",
  },
  {
    tag: "the list",
    title: "A real FlatList + store",
    body:
      "The roster is a React Native FlatList backed by a Context store you read and write. (Completing a channel — the “throw” — and saving across refreshes arrive in the next versions.)",
  },
];

type TourCtx = {
  open: boolean;
  step: number;
  steps: TourStep[];
  openTour: () => void;
  close: () => void;
  next: () => void;
  back: () => void;
  /** target rects in window coords, keyed by id. */
  targets: Record<string, Rect>;
  setTargetRect: (id: string, rect: Rect | null) => void;
  /** the phone screen container's window rect, for relative conversion. */
  screenRect: Rect | null;
  setScreenRect: (rect: Rect | null) => void;
  /** version marker → re-measure targets when it changes (step/open). */
  measureTick: number;
};

const Ctx = createContext<TourCtx | null>(null);

export function TourProvider({ steps, children }: { steps: TourStep[]; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [targets, setTargets] = useState<Record<string, Rect>>({});
  const [screenRect, setScreenRect] = useState<Rect | null>(null);
  const [measureTick, setMeasureTick] = useState(0);

  const setTargetRect = useCallback((id: string, rect: Rect | null) => {
    setTargets((prev) => {
      if (!rect) {
        if (!(id in prev)) return prev;
        const nextT = { ...prev };
        delete nextT[id];
        return nextT;
      }
      return { ...prev, [id]: rect };
    });
  }, []);

  const value: TourCtx = {
    open,
    step,
    steps,
    openTour: () => {
      setStep(0);
      setOpen(true);
      setMeasureTick((t) => t + 1);
    },
    close: () => setOpen(false),
    next: () => {
      setStep((s) => {
        const ns = Math.min(s + 1, steps.length - 1);
        return ns;
      });
      setMeasureTick((t) => t + 1);
    },
    back: () => {
      setStep((s) => Math.max(s - 1, 0));
      setMeasureTick((t) => t + 1);
    },
    targets,
    setTargetRect,
    screenRect,
    setScreenRect,
    measureTick,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTour(): TourCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTour must be used within a TourProvider");
  return ctx;
}
