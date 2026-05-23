/* V1Demos (guideline §3.10) — the current-version deep-dive.
   Small illustrations specific to the files v1 introduces: the tab
   route map (the (tabs) group → URLs), and the new-files list.
   Co-located with the home-page "Inside v1" section. */

import { Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";

/* the (tabs) group → URL structure */
const TAB_ROUTES = [
  { path: "/today", file: "app/(tabs)/today.tsx", desc: "The channel list — now tab 1 of 3." },
  { path: "/streaks", file: "app/(tabs)/streaks.tsx", desc: "The meter-bridge of momentum." },
  { path: "/settings", file: "app/(tabs)/settings.tsx", desc: "Coach dial, reminder, fine print." },
];

export function TabRouteMap() {
  const { theme } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      <View
        style={{
          backgroundColor: theme.canvas,
          borderWidth: 1,
          borderColor: theme.hairlineStrong,
          borderRadius: 9,
          padding: 12,
          gap: 3,
        }}
      >
        <Text style={{ fontFamily: FONTS.monoBold, fontSize: 13, color: theme.streak }}>
          app/(tabs)/_layout.tsx
        </Text>
        <Text style={{ fontFamily: FONTS.sans, fontSize: 12.5, color: theme.textMuted }}>
          Exports {"<Tabs>"} — the parenthesised group wires three tabs without adding a URL segment.
        </Text>
      </View>
      {TAB_ROUTES.map((r) => (
        <View
          key={r.path}
          style={{
            backgroundColor: theme.canvas,
            borderWidth: 1,
            borderColor: theme.hairline,
            borderRadius: 9,
            padding: 12,
            gap: 3,
            marginLeft: 14,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontFamily: FONTS.monoBold, fontSize: 13, color: theme.today }}>
              {r.path}
            </Text>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: theme.aluDk }}>
              {r.file}
            </Text>
          </View>
          <Text style={{ fontFamily: FONTS.sans, fontSize: 12.5, color: theme.textMuted }}>
            {r.desc}
          </Text>
        </View>
      ))}
    </View>
  );
}

const NEW_FILES = [
  { name: "app/(tabs)/", note: "_layout (Tabs) + today · streaks · settings" },
  { name: "InstrumentTabBar", note: "the real tab bar, dressed as hardware" },
  { name: "motion.tsx", note: "PressFade — useSharedValue opacity + a11y gate" },
  { name: "StreaksInstrument", note: "the meter-bridge (uptime + LED bars)" },
  { name: "SettingsInstrument", note: "Coach dial, reminder, theme switch" },
];

export function NewFilesV1() {
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
              minWidth: 130,
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
