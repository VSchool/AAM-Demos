/* VersionDemos (guideline §3.9) — the v0…v5 mini-demo registry.
   Each export is a self-contained "fake screen" illustrating that
   version's concept without real navigation. Used by the About page
   bento and home-page progression deep-dives. State is local/static. */

import { type ReactNode } from "react";
import { Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { Led, HardwareSwitch, Segment, TabBar } from "./instrument";

/* A compact inset "screen" — the dark device stage without the frame. */
function MiniFrame({ label, children }: { label: string; children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      <View
        style={{
          backgroundColor: theme.canvas,
          borderWidth: 1,
          borderColor: theme.hairlineStrong,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 10,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: theme.aluDk,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function MiniRow({
  role,
  name,
  streak,
  on,
}: {
  role: "done" | "today" | "rest" | "off";
  name: string;
  streak: string;
  on: boolean;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 9,
        paddingHorizontal: 11,
        backgroundColor: theme.panel,
        borderRadius: 9,
      }}
    >
      <Led role={role} size={9} />
      <Text style={{ flex: 1, fontFamily: FONTS.sansSemi, fontSize: 12.5, color: theme.print }}>
        {name}
      </Text>
      <Segment value={streak} size={11} role={role === "rest" ? "rest" : "streak"} />
      <HardwareSwitch on={on} />
    </View>
  );
}

export function DemoV0() {
  return (
    <MiniFrame label="static · no interaction yet">
      <View style={{ padding: 12, gap: 8 }}>
        <MiniRow role="done" name="Morning walk" streak="12" on />
        <MiniRow role="today" name="Read 10 pages" streak="04" on={false} />
        <MiniRow role="rest" name="Long run" streak="08" on={false} />
      </View>
    </MiniFrame>
  );
}

export function DemoV1() {
  return (
    <MiniFrame label="3 tabs wired via Expo Router">
      <View style={{ padding: 12, gap: 8 }}>
        <MiniRow role="done" name="Morning walk" streak="12" on />
        <MiniRow role="today" name="Read 10 pages" streak="04" on={false} />
      </View>
      <TabBar active="Today" />
    </MiniFrame>
  );
}

export function DemoV2() {
  const { theme } = useTheme();
  return (
    <MiniFrame label="FlatList + add-a-channel form">
      <View style={{ padding: 12, gap: 8 }}>
        <MiniRow role="done" name="Drink water" streak="31" on />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            padding: 11,
            borderWidth: 1,
            borderColor: theme.hairlineStrong,
            borderRadius: 9,
            borderStyle: "dashed",
          }}
        >
          <Text style={{ color: theme.streak, fontFamily: FONTS.sansBold }}>＋</Text>
          <Text style={{ fontFamily: FONTS.sans, fontSize: 12.5, color: theme.aluDk }}>
            Patch in a channel…
          </Text>
        </View>
      </View>
    </MiniFrame>
  );
}

export function DemoV3() {
  const { theme } = useTheme();
  return (
    <MiniFrame label="swipe-to-complete — “The Throw”">
      <View style={{ padding: 12, gap: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingVertical: 9,
            paddingHorizontal: 11,
            backgroundColor: theme.panel,
            borderRadius: 9,
          }}
        >
          <Led role="done" size={9} />
          <Text style={{ flex: 1, fontFamily: FONTS.sansSemi, fontSize: 12.5, color: theme.print }}>
            Read 10 pages
          </Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: theme.done }}>▸ thrown</Text>
          <HardwareSwitch on />
        </View>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: theme.aluDk }}>
          spring + haptic · LED snaps amber→green
        </Text>
      </View>
    </MiniFrame>
  );
}

export function DemoV4() {
  const { theme } = useTheme();
  return (
    <MiniFrame label="survives restart · AsyncStorage">
      <View style={{ padding: 12, gap: 8 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 3 }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <View
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: 2,
                backgroundColor:
                  i === 5 || i === 16 ? theme.rest : i > 27 ? theme.done : theme.done,
                opacity: i === 5 || i === 16 ? 1 : 0.85,
              }}
            />
          ))}
        </View>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: theme.aluDk }}>
          streak grid restored from disk · rest days kept
        </Text>
      </View>
    </MiniFrame>
  );
}

export function DemoV5() {
  const { theme } = useTheme();
  return (
    <MiniFrame label="daily reminder + Coach tone">
      <View style={{ padding: 12, gap: 10 }}>
        <View
          style={{
            backgroundColor: theme.lcd,
            borderRadius: 9,
            padding: 11,
            borderWidth: 1,
            borderColor: theme.hairlineStrong,
          }}
        >
          <Text style={{ fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1.4, color: theme.aluDk }}>
            DAILY REMINDER
          </Text>
          <Segment value="09:00" role="today" size={22} />
        </View>
        <View style={{ flexDirection: "row", gap: 6 }}>
          {["Chill", "Firm", "Elite"].map((t, i) => (
            <View
              key={t}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 7,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: i === 1 ? theme.today : theme.hairlineStrong,
                backgroundColor: i === 1 ? (theme.name === "dark" ? "#1C1F23" : "#FFF") : "transparent",
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 10,
                  textTransform: "uppercase",
                  color: i === 1 ? theme.today : theme.aluDk,
                }}
              >
                {t}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </MiniFrame>
  );
}

export const VERSIONS: {
  v: number;
  title: string;
  concept: string;
  blurb: string;
  Demo: () => ReactNode;
}[] = [
  {
    v: 0,
    title: "Scaffold",
    concept: "RN components + StyleSheet",
    blurb:
      "The shell: an Expo + Expo Router project, the Pulse theme tokens for both faces, the shared chrome suite, and a static channel list. No real feature beyond routing yet.",
    Demo: DemoV0,
  },
  {
    v: 1,
    title: "Tabs",
    concept: "Expo Router tab navigation",
    blurb: "Today / Streaks / Settings become three real tabs wired by file-based routing.",
    Demo: DemoV1,
  },
  {
    v: 2,
    title: "List + form",
    concept: "FlatList + TextInput",
    blurb: "The Today list renders from a FlatList and you can patch in a new channel via a form.",
    Demo: DemoV2,
  },
  {
    v: 3,
    title: "The Throw",
    concept: "Swipe gesture + haptics",
    blurb: "Swipe-to-complete: the hero motion moment — spring, haptic, LED color-snap.",
    Demo: DemoV3,
  },
  {
    v: 4,
    title: "Storage",
    concept: "AsyncStorage persistence",
    blurb: "Habits and completions survive a restart, and kind rest-day logic keeps streaks alive.",
    Demo: DemoV4,
  },
  {
    v: 5,
    title: "Push + Coach",
    concept: "EAS push notifications",
    blurb: "A daily reminder with a Coach tone you dial — Chill, Firm, or Elite.",
    Demo: DemoV5,
  },
];
