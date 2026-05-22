/* TodayInstrument — the Today screen rendered as the machined
   instrument: an app bar with the day's progress and a column of
   channel rows (one per habit). Pure read off lib/habits.

   v1: the rows now carry the PressFade touch-feedback primitive. The
   bottom tab bar is the only thing that differs by context — the
   home-page DEVICE PREVIEW draws the static fake `TabBar` (so the
   framed widget looks whole), while the LIVE /today tab passes
   `tabBar={false}` and lets the real Expo Router navigator render it. */

import { View } from "react-native";
import { channelCode, getAll, todayProgress } from "@/lib/habits";
import { AppBar, ChannelRow, Stage, TabBar } from "./instrument";

export default function TodayInstrument({ tabBar = true }: { tabBar?: boolean }) {
  const habits = getAll();
  const { done, total } = todayProgress();
  const seg = `${String(done).padStart(2, "0")}/${String(total).padStart(2, "0")}`;

  return (
    <View style={{ flex: 1 }}>
      <AppBar title="Today · 22 May" subtitle={`${done} of ${total} done`} seg={seg} />
      <Stage>
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
