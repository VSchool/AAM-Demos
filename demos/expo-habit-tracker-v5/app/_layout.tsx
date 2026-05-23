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
import { HabitStoreProvider, useHabitStore } from "@/lib/habit-store";
import { ReminderProvider } from "@/lib/reminder";
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
    // GestureHandlerRootView is required for the swipe-to-complete "Throw"
    // (react-native-gesture-handler) to receive touches — it wraps everything.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        {/* The persistent store wraps the whole app. v4: it hydrates from
            AsyncStorage on launch, so the splash also waits for that read.
            v5: the reminder store (Coach tone + daily reminder) sits inside it. */}
        <HabitStoreProvider>
          <ReminderProvider>
            <AppGate fontsLoaded={loaded} />
          </ReminderProvider>
        </HabitStoreProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

/* Hold the splash until BOTH the fonts have loaded AND the store has
   hydrated from AsyncStorage (v4) — so the first paint already shows your
   persisted channels, never the seed flashing past first. */
function AppGate({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { ready } = useHabitStore();
  return fontsLoaded && ready ? <Routes /> : <Splash />;
}

function Splash() {
  const { theme } = useTheme();
  return <View style={{ flex: 1, backgroundColor: theme.canvas }} />;
}
