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
import { SessionProvider } from "@/lib/session";
import { TourProvider, V2_TOUR } from "@/lib/tour";
import DeviceShell from "@/components/DeviceShell";

function Routes() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas }}>
      <StatusBar style={theme.name === "dark" ? "light" : "dark"} />
      {/* DeviceShell frames the app in a phone bezel on a wide browser
          (fullscreen on a real phone / narrow), runs the mock-auth gate
          (login → welcome → app), and keeps the tabs + the what's-new tour
          INSIDE the phone. The day-mode toggle now lives in Settings. */}
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
    // GestureHandlerRootView is required for v3's swipe-to-complete "Throw"
    // (react-native-gesture-handler) to receive touches — it wraps everything.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        {/* SessionProvider = the mock-auth gate (login → welcome → app). The
            v2 in-memory store wraps the app (refresh resets to seed —
            persistence is v4). TourProvider drives the what's-new tour. */}
        <SessionProvider>
          <HabitStoreProvider>
            <TourProvider steps={V2_TOUR}>
              {loaded ? <Routes /> : <Splash />}
            </TourProvider>
          </HabitStoreProvider>
        </SessionProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function Splash() {
  const { theme } = useTheme();
  return <View style={{ flex: 1, backgroundColor: theme.canvas }} />;
}
