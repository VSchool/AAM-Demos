/* V6Demos (guideline §3.10) — the current-version deep-dive.
   Illustrations specific to v6's files: the dynamic-route anatomy
   (file → URL → params), the detail-screen section map, and the
   new-files list. Co-located with the home-page "Inside v6" section. */

import { Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";

/* Three numbered steps showing how a dynamic route resolves:
   1. the file in app/  →  2. the URL the user hits  →  3. what the screen reads. */
const ROUTE_STEPS = [
  {
    step: "1",
    head: "The file IS the route",
    body: "app/habit/[id].tsx — bracket means dynamic segment. Drop it in, Expo Router registers it. No router config.",
  },
  {
    step: "2",
    head: "Tap pushes the URL",
    body: "On a row tap we call router.push('/habit/morning-walk'). Browser URL changes; native gets a real Stack push.",
  },
  {
    step: "3",
    head: "Read the matched value",
    body: "Inside the screen, useLocalSearchParams() returns { id: 'morning-walk' }. Look the habit up and render it.",
  },
];

export function RouteAnatomy() {
  const { theme } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      {ROUTE_STEPS.map((s) => (
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
            <Text
              style={{
                fontFamily: FONTS.sans,
                fontSize: 12.5,
                lineHeight: 18,
                color: theme.textMuted,
              }}
            >
              {s.body}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

/* The detail screen's section map — labels + a tiny diagrammatic preview of
   what each section is, so students see at a glance what HabitDetail renders. */
const DETAIL_SECTIONS = [
  { label: "Header", note: "◂ CH 0N · {name} · custom back bar" },
  { label: "LCD hero", note: "Streak in amber · best streak · re-skins per theme" },
  { label: "Last-30 matrix", note: "30 cells from habit.history · green/slate/red" },
  { label: "Meta", note: "CADENCE · WINDOW — mono key over value" },
  { label: "Why", note: "Italic quote · streak-orange left rule" },
  { label: "Actions", note: "Edit (stub) · Log (toggleDone) · Delete (removeHabit + back)" },
];

export function DetailScreenMap() {
  const { theme } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      {DETAIL_SECTIONS.map((s) => (
        <View
          key={s.label}
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            gap: 10,
            paddingVertical: 8,
            paddingHorizontal: 11,
            backgroundColor: theme.canvas,
            borderWidth: 1,
            borderColor: theme.hairline,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.monoBold,
              fontSize: 11,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              color: theme.today,
              minWidth: 92,
            }}
          >
            {s.label}
          </Text>
          <Text
            style={{
              flex: 1,
              fontFamily: FONTS.sans,
              fontSize: 12.5,
              lineHeight: 18,
              color: theme.textMuted,
            }}
          >
            {s.note}
          </Text>
        </View>
      ))}
    </View>
  );
}

const NEW_FILES = [
  { name: "app/habit/[id].tsx", note: "the dynamic route — bracket = matched segment" },
  { name: "components/HabitDetail.tsx", note: "the detail screen body (LCD + matrix + actions)" },
  { name: "lib/habit-store.tsx", note: "+ removeHabit(id) action (the Delete affordance)" },
  { name: "components/ThrowRow.tsx", note: "tap now pushes /habit/{id} (swipes unchanged)" },
  { name: "components/MotionFeatureBento.tsx", note: "+ live StackPushDemo tile (v6 row)" },
];

export function NewFilesV6() {
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
              minWidth: 200,
            }}
          >
            {d.name}
          </Text>
          <Text
            style={{
              flex: 1,
              fontFamily: FONTS.sans,
              fontSize: 12.5,
              color: theme.textMuted,
            }}
          >
            {d.note}
          </Text>
        </View>
      ))}
    </View>
  );
}
