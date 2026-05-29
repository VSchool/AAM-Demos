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
import { SessionProvider } from "@/lib/session";
import { TourProvider, V6_TOUR } from "@/lib/tour";
import DeviceShell from "@/components/DeviceShell";

function Routes() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas }}>
      <StatusBar style={theme.name === "dark" ? "light" : "dark"} />
      {/* DeviceShell frames the whole app in a phone bezel on a wide browser
          (full-screen on a real phone / narrow), runs the mock-auth gate
          (login → welcome → app), and keeps the app's own navigation (tabs +
          the v6 detail push + the what's-new tour) INSIDE the phone. The
          day-mode toggle now lives in Settings — there's no floating chrome. */}
      <DeviceShell>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.canvas },
            animation: "fade",
          }}
        />
      </DeviceShell>
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
        {/* SessionProvider = the mock-auth gate (login → welcome → app).
            The persistent store wraps the app (v4 hydrates from AsyncStorage;
            v5's reminder store sits inside it). TourProvider drives the
            what's-new walkthrough + its spotlight targets. */}
        <SessionProvider>
          <HabitStoreProvider>
            <ReminderProvider>
              <TourProvider steps={V6_TOUR}>
                <AppGate fontsLoaded={loaded} />
              </TourProvider>
            </ReminderProvider>
          </HabitStoreProvider>
        </SessionProvider>
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
