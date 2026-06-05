import { type ComponentProps } from "react";
import { Tabs } from "expo-router";
import { View } from "react-native";
import InstrumentTabBar from "@/components/InstrumentTabBar";
import { useTheme } from "@/theme/ThemeProvider";

export default function TabsLayout() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas }}>
      <Tabs
        tabBar={(props) => (
          <InstrumentTabBar
            {...(props as unknown as ComponentProps<typeof InstrumentTabBar>)}
          />
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
