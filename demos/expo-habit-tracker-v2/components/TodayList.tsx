/* TodayList — the v2 Today tab. The teaching beat: a FlatList of
   channels, with the add-a-habit form pinned as its ListHeaderComponent,
   reading + mutating the in-memory store (lib/habit-store).

   Layout (heads-up): the AppBar is pinned above and the FlatList is
   flex:1 below it — the list scrolls itself, it is NOT wrapped in a
   ScrollView. TabScreen gives this view flex:1, which bounds the list.

   Motion: the seed channels mount at rest; a freshly patched-in channel
   springs into the list via the v2 SpringIn (withSpring) primitive. The
   home-page DEVICE PREVIEW uses the static TodayInstrument instead — this
   interactive list is only the live /today tab. */

import { useRef } from "react";
import { FlatList, View } from "react-native";
import { channelCode } from "@/lib/habits";
import { useHabitStore } from "@/lib/habit-store";
import { AppBar, ChannelRow } from "./instrument";
import { SpringIn } from "./motion";
import AddChannelPanel from "./AddChannelPanel";

const pad = (n: number) => String(n).padStart(2, "0");

export default function TodayList() {
  const { habits, addHabit, progress } = useHabitStore();
  const { done, total } = progress;
  const seg = `${pad(done)}/${pad(total)}`;

  // The ids present on first render are the seed channels — they were
  // always there, so they appear at rest. Anything added later isn't in
  // this set, so its row springs in. Captured once via a ref.
  const seedIds = useRef(new Set(habits.map((h) => h.id))).current;
  const nextChannel = habits.reduce((max, h) => Math.max(max, h.channel), 0) + 1;

  return (
    <View style={{ flex: 1 }}>
      <AppBar title="Today · 22 May" subtitle={`${done} of ${total} done`} seg={seg} />
      <FlatList
        style={{ flex: 1 }}
        data={habits}
        keyExtractor={(h) => h.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 14, gap: 10 }}
        ListHeaderComponent={<AddChannelPanel nextChannel={nextChannel} onAdd={addHabit} />}
        renderItem={({ item }) => (
          <SpringIn animate={!seedIds.has(item.id)}>
            <ChannelRow
              ledRole={item.status}
              name={item.name}
              meta={`${channelCode(item.channel)} · ${item.window.toUpperCase()}`}
              streak={pad(item.streak)}
              on={item.status === "done"}
              dim={item.status === "rest"}
            />
          </SpringIn>
        )}
      />
    </View>
  );
}
