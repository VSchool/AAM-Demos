/* V3Demos (guideline §3.10) — the current-version deep-dive.
   Small illustrations specific to the files v3 introduces: the anatomy of
   "The Throw" gesture pipeline, and the new-files list. Co-located with
   the home-page "Inside v3" section. */

import { Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";

/* The Throw, step by step: gesture → threshold → spring/snap/haptic → store. */
const STEPS = [
  {
    step: "1",
    head: "Swipe the switch",
    body: "Gesture.Pan() drives the knob across its track — translationX maps onto a shared value.",
  },
  {
    step: "2",
    head: "Cross the threshold",
    body: "Past halfway, the throw commits on release; short drags spring back, no change.",
  },
  {
    step: "3",
    head: "Spring · snap · thunk",
    body: "withSpring settles the knob with an overshoot, the LED color-snaps amber→green, a heavy haptic fires.",
  },
  {
    step: "4",
    head: "Streak ticks up",
    body: "toggleDone bumps the channel's streak (un-throw walks it back). Refresh still resets.",
  },
];

export function ThrowAnatomy() {
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
              color: theme.today,
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

const NEW_FILES = [
  { name: "components/ThrowRow.tsx", note: "Gesture.Pan() switch + spring + LED snap" },
  { name: "lib/haptics.ts", note: "throwHaptic — Heavy impact, web no-op" },
  { name: "store › toggleDone", note: "commit the throw: complete / un-throw + streak" },
  { name: "_layout › GHRootView", note: "GestureHandlerRootView wraps the app" },
  { name: "+ expo-haptics", note: "new dependency this version introduces" },
];

export function NewFilesV3() {
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
              minWidth: 158,
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
