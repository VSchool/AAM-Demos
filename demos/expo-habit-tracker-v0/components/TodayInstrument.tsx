/* TodayInstrument — the v0 "single screen, static habit list".
   The Today screen rendered as the machined instrument: an app bar
   with the day's progress, a column of channel rows (one per habit),
   and the visual tab bar (real tabs arrive in v1). Pure read off
   lib/habits — no interaction yet. Reused by the home-page device
   preview and the /today route. */

import { View } from "react-native";
import { channelCode, getAll, todayProgress } from "@/lib/habits";
import { AppBar, ChannelRow, Stage, TabBar } from "./instrument";

export default function TodayInstrument() {
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
      <TabBar active="Today" />
    </View>
  );
}
