/* TodayInstrument — the STATIC Today screen, pure read off lib/habits:
   an app bar with the day's progress and a column of channel rows. As of
   v2 this is the home-page DEVICE PREVIEW only — it shows the seed state
   and never mutates. The live /today tab is the interactive FlatList in
   TodayList.tsx; keeping them separate lets the framed widget read the
   seed without the add-form being tappable in a confusing way.

   It draws a static "patch in a channel" affordance at the top to preview
   v2's add-form, plus the static fake `TabBar` so the framed device looks
   whole. The rows carry the v1 PressFade touch-feedback primitive. */

import { Text, View } from "react-native";
import { channelCode, getAll, todayProgress } from "@/lib/habits";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { AppBar, ChannelRow, Stage, TabBar } from "./instrument";

export default function TodayInstrument({ tabBar = true }: { tabBar?: boolean }) {
  const { theme } = useTheme();
  const habits = getAll();
  const { done, total } = todayProgress();
  const seg = `${String(done).padStart(2, "0")}/${String(total).padStart(2, "0")}`;

  return (
    <View style={{ flex: 1 }}>
      <AppBar title="Today · 22 May" subtitle={`${done} of ${total} done`} seg={seg} />
      <Stage>
        {/* static preview of the v2 add-form's collapsed affordance */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            borderWidth: 1,
            borderColor: theme.hairlineStrong,
            borderStyle: "dashed",
            borderRadius: 12,
            paddingVertical: 13,
            paddingHorizontal: 13,
          }}
        >
          <Text style={{ color: theme.streak, fontFamily: FONTS.sansBold, fontSize: 16 }}>＋</Text>
          <Text style={{ flex: 1, fontFamily: FONTS.sansSemi, fontSize: 14, color: theme.aluDk }}>
            Patch in a channel…
          </Text>
        </View>
        {habits.map((h) => (
          <ChannelRow
            key={h.id}
            ledRole={h.status}
            name={h.name}
            meta={`${channelCode(h.channel)} · ${h.window.toUpperCase()}`}
            streak={String(h.streak).padStart(2, "0")}
            on={h.status === "done"}
            dim={h.status === "rest"}
          />
        ))}
      </Stage>
      {tabBar ? <TabBar active="Today" /> : null}
    </View>
  );
}
