import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import {
  SpaceMono_400Regular,
  SpaceMono_700Bold,
} from "@expo-google-fonts/space-mono";

import { ThemeProvider, useTheme } from "@/theme/ThemeProvider";
import { HabitStoreProvider } from "@/lib/habit-store";
import ThemeToggle from "@/components/ThemeToggle";

function Routes() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas }}>
      <StatusBar style={theme.name === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.canvas },
          animation: "fade",
        }}
      />
      {/* Day-mode switch + palette panel — present on every screen. */}
      <ThemeToggle />
    </View>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  });

  return (
    // GestureHandlerRootView is required for v3's swipe-to-complete "Throw"
    // (react-native-gesture-handler) to receive touches — it wraps everything.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        {/* The v2 in-memory store wraps the whole app. The Today tab reads +
            mutates it; refresh resets to the seed (persistence is v4). */}
        <HabitStoreProvider>
          {loaded ? <Routes /> : <Splash />}
        </HabitStoreProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function Splash() {
  const { theme } = useTheme();
  return <View style={{ flex: 1, backgroundColor: theme.canvas }} />;
}
