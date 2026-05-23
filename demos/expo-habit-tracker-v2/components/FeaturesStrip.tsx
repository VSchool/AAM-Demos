/* FeaturesStrip (guideline §3.3) — the at-a-glance preview of what
   the FINAL app does. A tablist of the six top-level features; tap a
   pill to reveal its one-line caption. Each pill carries a reserved
   tone, lit only when active (reserved-color discipline §7). */

import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { Body } from "./ui";

type Tone = "today" | "streak" | "done" | "rest";

const FEATURES: { word: string; tone: Tone; caption: string }[] = [
  { word: "Today", tone: "today", caption: "Every channel's state in one glance — what's due now, what's done." },
  { word: "Streaks", tone: "streak", caption: "Momentum you can see: a meter-bridge of live streak readouts and 7-day bars." },
  { word: "Add", tone: "done", caption: "“Patch in a channel” — name it, set cadence + window, and it joins the rack." },
  { word: "Swipe", tone: "streak", caption: "The Throw: swipe to complete — a spring, a haptic thunk, the LED snaps green. (v3)" },
  { word: "Persist", tone: "done", caption: "Habits and completions survive a restart once AsyncStorage lands. (v4)" },
  { word: "Remind", tone: "today", caption: "A daily nudge with a Coach tone you dial — Chill, Firm, or Elite. (v5)" },
];

export default function FeaturesStrip() {
  const { theme } = useTheme();
  const [active, setActive] = useState(0);

  return (
    <View style={{ gap: 14 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {FEATURES.map((f, i) => {
          const isActive = active === i;
          const accent = theme[f.tone];
          return (
            <Pressable
              key={f.word}
              onPress={() => setActive(i)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingVertical: 9,
                paddingHorizontal: 14,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: isActive ? accent : theme.hairlineStrong,
                backgroundColor: isActive
                  ? theme.name === "dark"
                    ? "rgba(255,255,255,0.04)"
                    : "#FFFFFF"
                  : "transparent",
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: isActive ? accent : theme.aluDk,
                  shadowColor: isActive && theme.glow ? accent : "transparent",
                  shadowOpacity: isActive && theme.glow ? 0.9 : 0,
                  shadowRadius: isActive && theme.glow ? 6 : 0,
                }}
              />
              <Text
                style={{
                  fontFamily: FONTS.sansSemi,
                  fontSize: 14,
                  letterSpacing: -0.1,
                  color: isActive ? theme.print : theme.aluDk,
                }}
              >
                {f.word}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 9.5,
                  color: theme.aluDk,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Body style={{ fontSize: 14.5, color: theme.textMuted, minHeight: 44 }}>
        {FEATURES[active].caption}
      </Body>
    </View>
  );
}
