import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, View, type ViewStyle } from "react-native";
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
      <ThemeToggle />
    </View>
  );
}

/* On web we paint a dark "desk" surround and float a phone-shaped frame in
   the centre, so this reads as a mobile app no matter how wide the browser
   window gets. On native, the device IS the frame — render the routes flat. */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== "web") return <>{children}</>;

  const surround: ViewStyle = {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A0B0C",
    padding: 20,
  };
  const frame: ViewStyle = {
    width: "100%",
    maxWidth: 400,
    height: "100%",
    maxHeight: 860,
    borderRadius: 44,
    borderWidth: 10,
    borderColor: "#1A1B1F",
    overflow: "hidden",
    backgroundColor: "#000",
    ...(({
      boxShadow:
        "0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset",
    } as unknown) as ViewStyle),
  };

  return (
    <View style={surround}>
      <View style={frame}>{children}</View>
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <HabitStoreProvider>
          <ReminderProvider>
            <PhoneFrame>
              <AppGate fontsLoaded={loaded} />
            </PhoneFrame>
          </ReminderProvider>
        </HabitStoreProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function AppGate({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { ready } = useHabitStore();
  return fontsLoaded && ready ? <Routes /> : <Splash />;
}

function Splash() {
  const { theme } = useTheme();
  return <View style={{ flex: 1, backgroundColor: theme.canvas }} />;
}
