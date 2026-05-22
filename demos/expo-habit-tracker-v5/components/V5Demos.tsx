/* V5Demos (guideline §3.10) — the current-version deep-dive.
   Illustrations specific to the files v5 introduces: the push-notification
   lifecycle, the Coach-tone voices the dial now drives, and the new-files
   list. Co-located with the home-page "Inside v5" section. */

import { Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { COACH_ORDER, COACH_COPY } from "@/lib/notifications";

/* The daily-reminder lifecycle: permission → schedule → fire → Coach tone. */
const STEPS = [
  {
    step: "1",
    head: "Ask permission",
    body: "Notifications.requestPermissionsAsync() prompts once. Granted on a device; web has no OS scheduler, so it reports back as web.",
  },
  {
    step: "2",
    head: "Schedule the daily trigger",
    body: "scheduleNotificationAsync with a DAILY trigger at your reminder time. Re-scheduling cancels the old one so there's only ever one.",
  },
  {
    step: "3",
    head: "It fires every day",
    body: "The OS posts the notification at 09:00 whether or not the app is open. Persisted, so it survives a restart (the v4 beat).",
  },
  {
    step: "4",
    head: "In your Coach's voice",
    body: "The dial picks the copy — Chill, Firm, or Elite. On web the same copy lands as an in-app preview banner instead.",
  },
];

export function PushFlow() {
  const { theme } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      {STEPS.map((s) => (
        <View
          key={s.step}
          style={{
            flexDirection: "row",
            gap: 11,
            backgroundColor: theme.canvas,
            borderWidth: 1,
            borderColor: theme.hairline,
            borderRadius: 9,
            padding: 12,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.monoBold,
              fontSize: 13,
              color: theme.done,
              minWidth: 16,
            }}
          >
            {s.step}
          </Text>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ fontFamily: FONTS.sansSemi, fontSize: 13.5, color: theme.print }}>
              {s.head}
            </Text>
            <Text style={{ fontFamily: FONTS.sans, fontSize: 12.5, lineHeight: 18, color: theme.textMuted }}>
              {s.body}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

/* The three Coach voices — the literal copy the dial schedules. Showing them
   side by side is the most diagnostic artifact for "the tone is live." */
export function CoachVoices() {
  const { theme } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      {COACH_ORDER.map((tone) => {
        const c = COACH_COPY[tone];
        return (
          <View
            key={tone}
            style={{
              backgroundColor: theme.canvas,
              borderWidth: 1,
              borderColor: theme.hairline,
              borderLeftWidth: 3,
              borderLeftColor: theme.today,
              borderRadius: 9,
              padding: 12,
              gap: 3,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.mono,
                fontSize: 9,
                letterSpacing: 1.8,
                textTransform: "uppercase",
                color: theme.today,
              }}
            >
              {c.label}
            </Text>
            <Text style={{ fontFamily: FONTS.sansSemi, fontSize: 13.5, color: theme.print }}>
              {c.title}
            </Text>
            <Text style={{ fontFamily: FONTS.sans, fontSize: 12, lineHeight: 17, color: theme.textMuted }}>
              {c.body}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const NEW_FILES = [
  { name: "lib/notifications.ts", note: "permission + scheduleDailyReminder + Coach copy" },
  { name: "lib/reminder.tsx", note: "live Coach tone + reminder state, persisted" },
  { name: "components/ReminderPreview.tsx", note: "in-app banner — the web-safe preview" },
  { name: "components/motion.tsx", note: "SequenceIn — the withSequence arrival" },
  { name: "+ expo-notifications", note: "new dependency this version introduces" },
];

export function NewFilesV5() {
  const { theme } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      {NEW_FILES.map((d) => (
        <View key={d.name} style={{ flexDirection: "row", alignItems: "baseline", gap: 10 }}>
          <Text
            style={{
              fontFamily: FONTS.monoBold,
              fontSize: 12.5,
              color: theme.done,
              minWidth: 180,
            }}
          >
            {d.name}
          </Text>
          <Text style={{ flex: 1, fontFamily: FONTS.sans, fontSize: 12.5, color: theme.textMuted }}>
            {d.note}
          </Text>
        </View>
      ))}
    </View>
  );
}
