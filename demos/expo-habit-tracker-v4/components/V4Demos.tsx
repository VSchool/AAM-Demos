/* V4Demos (guideline §3.10) — the current-version deep-dive.
   Small illustrations specific to the files v4 introduces: the AsyncStorage
   persistence lifecycle, the kind-rest-day state machine the swipe now drives,
   and the new-files list. Co-located with the home-page "Inside v4" section. */

import { Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";

/* The persistence lifecycle: hydrate → mutate → persist → survives restart. */
const STEPS = [
  {
    step: "1",
    head: "Hydrate on launch",
    body: "AsyncStorage.getItem reads your saved roster; the splash holds until it resolves, so the first paint is already your data — not the seed.",
  },
  {
    step: "2",
    head: "Mutate as you go",
    body: "Throw a switch, park a channel on rest, patch in a new one — every action updates the in-memory Context store.",
  },
  {
    step: "3",
    head: "Persist on every change",
    body: "An effect mirrors the roster to AsyncStorage.setItem on each mutation. On web that's localStorage.",
  },
  {
    step: "4",
    head: "Survives a refresh",
    body: "Reload the page (or relaunch the app) and it rehydrates exactly where you left off. Reset to seed from Settings.",
  },
];

export function PersistFlow() {
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

/* The kind-rest-day state machine — what the bidirectional swipe commits. The
   point students should take away: rest NEVER touches the streak. */
const TRANSITIONS: { from: string; gesture: string; to: string; delta: string; role: "done" | "today" | "rest" }[] = [
  { from: "Today", gesture: "swipe right / tap", to: "Done", delta: "+1", role: "done" },
  { from: "Rest", gesture: "swipe right / tap", to: "Done", delta: "+1", role: "done" },
  { from: "Today", gesture: "swipe left", to: "Rest", delta: "held", role: "rest" },
  { from: "Done", gesture: "swipe left / tap", to: "Today", delta: "−1", role: "today" },
];

export function RestStateMachine() {
  const { theme } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      {TRANSITIONS.map((t, i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            backgroundColor: theme.canvas,
            borderWidth: 1,
            borderColor: theme.hairline,
            borderRadius: 9,
            paddingVertical: 9,
            paddingHorizontal: 11,
          }}
        >
          <Text style={{ fontFamily: FONTS.sansSemi, fontSize: 12.5, color: theme.print, minWidth: 44 }}>
            {t.from}
          </Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: theme.aluDk, flex: 1 }}>
            {t.gesture} →
          </Text>
          <Text style={{ fontFamily: FONTS.sansSemi, fontSize: 12.5, color: theme[t.role], minWidth: 44 }}>
            {t.to}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.monoBold,
              fontSize: 11,
              color: t.delta === "held" ? theme.rest : t.delta === "+1" ? theme.done : theme.streak,
              minWidth: 34,
              textAlign: "right",
            }}
          >
            {t.delta}
          </Text>
        </View>
      ))}
      <Text style={{ fontFamily: FONTS.sans, fontSize: 12, lineHeight: 18, color: theme.textMuted, marginTop: 2 }}>
        Entering done is the only +1; leaving done the only −1. A rest day pauses the streak — it
        neither climbs nor breaks. Pulse never punishes.
      </Text>
    </View>
  );
}

const NEW_FILES = [
  { name: "lib/habit-store.tsx", note: "hydrate + persist + resetToSeed; markDone / markRest" },
  { name: "components/motion.tsx", note: "layoutReflow() — the LayoutAnimation primitive" },
  { name: "components/ThrowRow.tsx", note: "bidirectional Pan — right = done, left = rest" },
  { name: "app/_layout.tsx", note: "splash now waits for AsyncStorage hydration" },
  { name: "+ async-storage", note: "new dependency this version introduces" },
];

export function NewFilesV4() {
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
