/* Progression (guideline §3.4) — the v0→v6 version timeline.
   Current marked, past versions link to their deployed URL, future
   versions stay locked. The spine matches the locked teaching beats. */

import { Linking, Pressable, Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";

const STEPS = [
  { v: 0, label: "scaffold" },
  { v: 1, label: "tabs" },
  { v: 2, label: "list + form" },
  { v: 3, label: "the throw" },
  { v: 4, label: "storage" },
  { v: 5, label: "detail · dynamic routes" },
  { v: 6, label: "push + coach" },
];

const BASE = "https://vschool.github.io/AAM-Demos/expo-habit-tracker-";

export default function Progression({ current }: { current: number }) {
  const { theme } = useTheme();

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginVertical: 4 }}>
      {STEPS.map((s) => {
        const isCurrent = s.v === current;
        const isPast = s.v < current;
        const label = `v${s.v} · ${s.label}`;

        const base = {
          flexDirection: "row" as const,
          alignItems: "center" as const,
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 6,
          borderWidth: 1,
        };
        const text = {
          fontFamily: FONTS.mono,
          fontSize: 11,
          letterSpacing: 1,
          textTransform: "uppercase" as const,
        };

        if (isCurrent) {
          return (
            <View
              key={s.v}
              style={[base, { backgroundColor: theme.today, borderColor: theme.today }]}
            >
              <Text style={[text, { color: "#1A0F00", fontFamily: FONTS.monoBold }]}>
                {label}
              </Text>
            </View>
          );
        }
        if (isPast) {
          return (
            <Pressable
              key={s.v}
              onPress={() => Linking.openURL(`${BASE}v${s.v}/`)}
              style={[
                base,
                { backgroundColor: theme.panel, borderColor: theme.hairlineStrong },
              ]}
            >
              <Text style={[text, { color: theme.print }]}>{label}</Text>
            </Pressable>
          );
        }
        return (
          <View
            key={s.v}
            style={[
              base,
              { backgroundColor: "transparent", borderColor: theme.hairline, opacity: 0.5 },
            ]}
          >
            <Text style={[text, { color: theme.aluDk }]}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}
