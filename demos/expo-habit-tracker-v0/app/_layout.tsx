import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
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
import { SessionProvider } from "@/lib/session";
import { TourProvider, V0_TOUR } from "@/lib/tour";
import DeviceShell from "@/components/DeviceShell";

function Routes() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas }}>
      <StatusBar style={theme.name === "dark" ? "light" : "dark"} />
      {/* DeviceShell frames the scaffold in a phone bezel on a wide browser
          (fullscreen on a real phone / narrow), runs the mock-auth gate
          (login → welcome → app), and keeps the what's-new tour INSIDE the
          phone. v0 has no tabs yet — the single Today screen is the app. */}
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
    <ThemeProvider>
      {/* SessionProvider = the mock-auth gate (login → welcome → app). v0 has
          no store yet — Today reads the static seed roster. TourProvider
          drives the what's-new tour. */}
      <SessionProvider>
        <TourProvider steps={V0_TOUR}>
          {loaded ? <Routes /> : <Splash />}
        </TourProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

function Splash() {
  const { theme } = useTheme();
  return <View style={{ flex: 1, backgroundColor: theme.canvas }} />;
}
