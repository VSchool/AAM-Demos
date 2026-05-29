/* The v1 teaching beat: TAB NAVIGATION via Expo Router.
   This file IS the lesson. Dropping a `_layout.tsx` that exports <Tabs>
   into a route group turns the three sibling files (today / streaks /
   settings) into real tabs — no router config, no navigator wiring by
   hand. The group folder name `(tabs)` is parenthesised, so it groups
   the screens WITHOUT adding a segment to the URL: today still lives at
   /today, which is exactly where the Nav's "Today" link resolves.

   `/` (home) and `/about` stay OUTSIDE this group — they're the web
   teaching landing, not part of the app surface. The web Nav rides
   above the tab bar so you can step back out to them. */

import { type ComponentProps } from "react";
import { Tabs } from "expo-router";
import { View } from "react-native";
import InstrumentTabBar from "@/components/InstrumentTabBar";
import TourTarget from "@/components/TourTarget";
import { useTheme } from "@/theme/ThemeProvider";

export default function TabsLayout() {
  const { theme } = useTheme();
  // The web Nav was removed: the app now lives inside the DeviceShell phone
  // bezel, so the only navigation inside the phone is the app's own tab bar.
  // The tab bar is v1's new beat — wrap it in a TourTarget so the what's-new
  // tour can ring it ("three tabs now").
  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas }}>
      <Tabs
        tabBar={(props) => (
          <TourTarget id="tab-bar">
            <InstrumentTabBar
              {...(props as unknown as ComponentProps<typeof InstrumentTabBar>)}
            />
          </TourTarget>
        )}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="today" options={{ title: "Today" }} />
        <Tabs.Screen name="streaks" options={{ title: "Streaks" }} />
        <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      </Tabs>
    </View>
  );
}
