/* ============================================================
   Pulse — habit detail (v5's beat: dynamic routes).

   File-based dynamic route. The bracketed segment in the filename
   (`[id]`) is what makes Expo Router treat any URL like
   `/habit/morning-walk` as a match, and lets us read the matched
   value through `useLocalSearchParams()`. There's no manual route
   registration — the file IS the route.

   Why headerShown: false here — the visual back bar is rendered
   inside <HabitDetail/> itself so it can use the instrument's own
   typography + tokens. The per-route <Stack.Screen options>
   override is also where v5's motion primitive lives: the screen
   slides in from the right (or 'none' under reduced-motion) instead
   of inheriting the root Stack's 'fade' default.
   ============================================================ */

import { Stack, router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";

import HabitDetail from "@/components/HabitDetail";
import { useHabitStore } from "@/lib/habit-store";
import { useTheme } from "@/theme/ThemeProvider";
import { FONTS } from "@/theme/tokens";

export default function HabitDetailScreen() {
  const { theme } = useTheme();
  // `id` is whatever the user typed after /habit/ in the URL. It can be a
  // string or string[] depending on the matcher; we only ever push a single
  // segment so the array case is just defensive.
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { habits } = useHabitStore();
  const habit = habits.find((h) => h.id === id);

  // Reduced-motion gate (v5 motion primitive is the screen transition itself).
  const reduce = useReducedMotion();
  const animation: "slide_from_right" | "none" = reduce ? "none" : "slide_from_right";

  // The detail screen fills the DeviceShell phone bezel — no web Nav, no
  // centred desktop column (the bezel is the frame now). The slide_from_right
  // push therefore happens INSIDE the phone, over the Today screen.
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          // v5 motion primitive: customize the route transition via
          // Stack.Screen options. slide_from_right is the canonical
          // iOS-native push feel, so the new screen reads unambiguously
          // as "a fresh route on top of the previous one."
          animation,
        }}
      />
      <View style={{ flex: 1, backgroundColor: theme.canvas }}>
        {habit ? <HabitDetail habit={habit} /> : <ChannelNotFound />}
      </View>
    </>
  );
}

/* If a deleted (or never-existed) id is opened via back-forward / bookmark,
   render a tiny in-theme fallback rather than crashing or rendering blank. */
function ChannelNotFound() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas, padding: 28, gap: 14 }}>
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: theme.aluDk,
        }}
      >
        Channel not found
      </Text>
      <Text
        style={{
          fontFamily: FONTS.sansSemi,
          fontSize: 18,
          color: theme.print,
          lineHeight: 25,
        }}
      >
        This channel was removed or never existed.
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back to Today"
        onPress={() => router.back()}
        style={{
          alignSelf: "flex-start",
          paddingVertical: 9,
          paddingHorizontal: 14,
          borderRadius: 7,
          borderWidth: 1,
          borderColor: theme.hairlineStrong,
          backgroundColor: theme.panel,
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.mono,
            fontSize: 10,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            color: theme.today,
          }}
        >
          ‹ Back
        </Text>
      </Pressable>
    </View>
  );
}
