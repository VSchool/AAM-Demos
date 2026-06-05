/* ============================================================
   Pulse — notifications (the v5 beat: expo-notifications).
   A daily local reminder you grant permission for and schedule; the
   Coach-tone dial (Chill / Firm / Elite — a preview since v1) finally
   goes LIVE here, choosing how the nudge talks to you.

   Honest split, mirroring v3's haptics: real OS notifications only fire
   on a DEVICE (Expo Go / a dev or EAS build). On the deployed WEB build
   there's no OS scheduler, so every call here no-ops — the app shows an
   in-app preview banner instead so the Coach tone is still visibly live.
   ============================================================ */

import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

export type CoachTone = "chill" | "firm" | "elite";

/** The Coach tone copy table — what the daily nudge actually says.
    One voice per hardware mode; this is the payload v5 schedules. */
export const COACH_COPY: Record<CoachTone, { label: string; title: string; body: string }> = {
  chill: {
    label: "Chill",
    title: "Whenever you're ready 🌱",
    body: "No rush — your channels are here when you want them. A little still counts.",
  },
  firm: {
    label: "Firm",
    title: "Time to check in",
    body: "Your channels are waiting. Throw a few switches and keep the streaks honest.",
  },
  elite: {
    label: "Elite",
    title: "No excuses. Move.",
    body: "Streaks don't build themselves. Hit your channels now — future you is watching.",
  },
};

export const COACH_ORDER: CoachTone[] = ["chill", "firm", "elite"];

const isNative = Platform.OS !== "web";

/* Tell the OS how to present a notification while the app is foregrounded.
   Native only — the web build has no handler to set. */
if (isNative) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export type PermissionState = "unknown" | "granted" | "denied" | "web";

/** Ask the OS for permission to post notifications. Web has no OS
    scheduler, so it reports "web" without prompting. */
export async function requestPermission(): Promise<PermissionState> {
  if (!isNative) return "web";
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted" ? "granted" : "denied";
  } catch {
    return "denied";
  }
}

/** Schedule a repeating daily reminder at hour:minute with the Coach-tone
    copy. Cancels any prior schedule first so there's only ever one. Returns
    the notification id, or null on web / failure. */
export async function scheduleDailyReminder(
  hour: number,
  minute: number,
  tone: CoachTone,
): Promise<string | null> {
  if (!isNative) return null;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const copy = COACH_COPY[tone];
    return await Notifications.scheduleNotificationAsync({
      content: { title: copy.title, body: copy.body },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  } catch {
    return null;
  }
}

/** Tear down the scheduled reminder (the Disable path). */
export async function cancelReminder(): Promise<void> {
  if (!isNative) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    /* no-op */
  }
}
