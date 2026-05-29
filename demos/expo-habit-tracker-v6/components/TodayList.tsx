/* TodayList — the live Today tab. A FlatList of channels (v2) with the
   add-a-habit form pinned as its ListHeaderComponent, reading + mutating
   the persistent store.

   v3: each row is a ThrowRow — swipe the switch to complete a habit.
   v4: the swipe is bidirectional — swipe RIGHT completes, swipe LEFT parks
   the channel on a kind rest day (the streak HOLDS). All commits persist
   to AsyncStorage, and a swipe-to-rest REFLOWS the row via the v4
   LayoutAnimation primitive.
   v6: TAPPING a row now opens the detail screen (the deliberate UX
   evolution that comes with the dynamic-routes beat) — swipes still
   complete/rest. The tap-to-complete affordance migrates into Log on
   the detail screen.

   Layout (heads-up): the AppBar is pinned above and the FlatList is
   flex:1 below it — the list scrolls itself, it is NOT wrapped in a
   ScrollView. TabScreen gives this view flex:1, which bounds the list.

   Motion: seed channels mount at rest; a freshly patched-in channel springs
   in via the v2 SpringIn primitive. The home-page DEVICE PREVIEW uses the
   static TodayInstrument instead — this interactive list is only /today. */

import { useRef } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { channelCode } from "@/lib/habits";
import { useHabitStore } from "@/lib/habit-store";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { AppBar } from "./instrument";
import { SpringIn } from "./motion";
import AddChannelPanel from "./AddChannelPanel";
import ThrowRow from "./ThrowRow";
import TourTarget from "./TourTarget";

const pad = (n: number) => String(n).padStart(2, "0");

/* The in-app entry to the build info (the "more about this version" the
   user reaches at the bottom of the home screen on a real phone). On a wide
   browser the same info also rides the external rail; here it's always
   reachable in-app so device + browser stay identical. */
function MoreAboutRow() {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={() => router.push("/about")}
      accessibilityRole="button"
      accessibilityLabel="More about this version"
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 4,
        paddingVertical: 12,
        paddingHorizontal: 13,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.hairline,
        backgroundColor: theme.canvasRaised,
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 10.5,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          color: theme.aluDk,
        }}
      >
        ⓘ  More about this version
      </Text>
      <Text style={{ fontFamily: FONTS.mono, fontSize: 13, color: theme.aluDk }}>›</Text>
    </Pressable>
  );
}

export default function TodayList() {
  const { habits, addHabit, markDone, markRest, progress } = useHabitStore();
  const { done, total } = progress;
  const seg = `${pad(done)}/${pad(total)}`;

  // The ids present on first render are the channels restored from storage —
  // they were already there, so they appear at rest. Anything added later
  // isn't in this set, so its row springs in. Captured once via a ref.
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
        ListFooterComponent={<MoreAboutRow />}
        renderItem={({ item, index }) => {
          const row = (
            <SpringIn animate={!seedIds.has(item.id)}>
              <ThrowRow
                id={item.id}
                status={item.status}
                name={item.name}
                meta={`${channelCode(item.channel)} · ${item.window.toUpperCase()}`}
                streak={pad(item.streak)}
                onSwipeRight={() => markDone(item.id)}
                onSwipeLeft={() => markRest(item.id)}
              />
            </SpringIn>
          );
          // The first row is the tour's spotlight target ("tap to open detail").
          return index === 0 ? <TourTarget id="first-channel">{row}</TourTarget> : row;
        }}
      />
    </View>
  );
}
