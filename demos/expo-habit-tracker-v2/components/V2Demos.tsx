/* V2Demos (guideline §3.10) — the current-version deep-dive.
   Small illustrations specific to the files v2 introduces: the data
   flow through the new in-memory store, and the new-files list.
   Co-located with the home-page "Inside v2" section. */

import { Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";

/* The add-a-channel data flow: form → store → FlatList re-render. */
const FLOW = [
  {
    step: "1",
    head: "Seed the store",
    body: "HabitStoreProvider copies lib/habits.getAll() into Context state once on mount.",
  },
  {
    step: "2",
    head: "Type + submit",
    body: "The TextInput form collects name, cadence, window, why and calls addHabit().",
  },
  {
    step: "3",
    head: "Mutate state",
    body: "addHabit() assigns the next CH number, defaults status to today, appends to the list.",
  },
  {
    step: "4",
    head: "FlatList re-renders",
    body: "The new row mounts and springs in via withSpring; refresh resets to the seed.",
  },
];

export function AddFlowMap() {
  const { theme } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      {FLOW.map((f) => (
        <View
          key={f.step}
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
            {f.step}
          </Text>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ fontFamily: FONTS.sansSemi, fontSize: 13.5, color: theme.print }}>
              {f.head}
            </Text>
            <Text style={{ fontFamily: FONTS.sans, fontSize: 12.5, lineHeight: 18, color: theme.textMuted }}>
              {f.body}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const NEW_FILES = [
  { name: "lib/habit-store.tsx", note: "Context in-memory store — seed + addHabit" },
  { name: "TodayList.tsx", note: "the FlatList Today tab (reads + mutates store)" },
  { name: "AddChannelPanel.tsx", note: "inline expanding add-a-channel form" },
  { name: "instrument › TextField", note: "themed TextInput for the silver/black faces" },
  { name: "motion › SpringIn", note: "withSpring new-row insert + a11y gate" },
];

export function NewFilesV2() {
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
              minWidth: 150,
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
