/* ============================================================
   Pulse — reminder store (v5). Holds the live Coach tone + the daily
   reminder settings, and drives expo-notifications. Persisted to
   AsyncStorage (riding the v4 beat) so your Coach tone and reminder
   survive a restart. Web has no OS scheduler, so enabling there just
   flips the in-app preview on; native actually schedules.
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
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  cancelReminder,
  requestPermission,
  scheduleDailyReminder,
  COACH_COPY,
  type CoachTone,
  type PermissionState,
} from "./notifications";

const STORAGE_KEY = "pulse.reminder.v5";
const isNative = Platform.OS !== "web";

interface Persisted {
  tone: CoachTone;
  enabled: boolean;
  hour: number;
  minute: number;
}

const DEFAULTS: Persisted = { tone: "firm", enabled: false, hour: 9, minute: 0 };

interface ReminderValue {
  tone: CoachTone;
  enabled: boolean;
  hour: number;
  minute: number;
  permission: PermissionState;
  /** the live copy for the current tone — used by the preview banner. */
  copy: { label: string; title: string; body: string };
  /** "09:00" */
  timeLabel: string;
  setTone: (tone: CoachTone) => void;
  /** request permission + schedule the daily reminder (native); web flips on. */
  enable: () => Promise<void>;
  disable: () => void;
}

const ReminderContext = createContext<ReminderValue | null>(null);

const pad = (n: number) => String(n).padStart(2, "0");

export function ReminderProvider({ children }: { children: ReactNode }) {
  const [tone, setToneState] = useState<CoachTone>(DEFAULTS.tone);
  const [enabled, setEnabled] = useState(DEFAULTS.enabled);
  const [hour] = useState(DEFAULTS.hour);
  const [minute] = useState(DEFAULTS.minute);
  const [permission, setPermission] = useState<PermissionState>(isNative ? "unknown" : "web");
  const hydrated = useRef(false);

  // Hydrate persisted reminder settings on mount.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && alive) {
          const p = JSON.parse(raw) as Partial<Persisted>;
          if (p.tone) setToneState(p.tone);
          if (typeof p.enabled === "boolean") setEnabled(p.enabled);
        }
      } catch {
        /* fall back to defaults */
      } finally {
        hydrated.current = true;
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Persist on change (once hydrated, so we don't clobber the stored value).
  useEffect(() => {
    if (!hydrated.current) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ tone, enabled, hour, minute } satisfies Persisted),
    ).catch(() => {});
  }, [tone, enabled, hour, minute]);

  const setTone = useCallback(
    (next: CoachTone) => {
      setToneState(next);
      // If a reminder is already live on a device, reschedule with the new voice.
      if (enabled && isNative) scheduleDailyReminder(hour, minute, next);
    },
    [enabled, hour, minute],
  );

  const enable = useCallback(async () => {
    const perm = await requestPermission();
    setPermission(perm);
    if (perm === "granted") {
      await scheduleDailyReminder(hour, minute, tone);
      setEnabled(true);
    } else if (perm === "web") {
      // No OS scheduler on web — enabling just turns on the in-app preview.
      setEnabled(true);
    }
  }, [hour, minute, tone]);

  const disable = useCallback(() => {
    setEnabled(false);
    cancelReminder();
  }, []);

  const value = useMemo<ReminderValue>(
    () => ({
      tone,
      enabled,
      hour,
      minute,
      permission,
      copy: COACH_COPY[tone],
      timeLabel: `${pad(hour)}:${pad(minute)}`,
      setTone,
      enable,
      disable,
    }),
    [tone, enabled, hour, minute, permission, setTone, enable, disable],
  );

  return <ReminderContext.Provider value={value}>{children}</ReminderContext.Provider>;
}

export function useReminder(): ReminderValue {
  const ctx = useContext(ReminderContext);
  if (!ctx) throw new Error("useReminder must be used inside <ReminderProvider>");
  return ctx;
}
