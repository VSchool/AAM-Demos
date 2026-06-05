import { Stack, router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";

import HabitDetail from "@/components/HabitDetail";
import { useHabitStore } from "@/lib/habit-store";
import { useTheme } from "@/theme/ThemeProvider";
import { FONTS } from "@/theme/tokens";

export default function HabitDetailScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { habits } = useHabitStore();
  const habit = habits.find((h) => h.id === id);

  const reduce = useReducedMotion();
  const animation: "slide_from_right" | "none" = reduce ? "none" : "slide_from_right";

  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation }} />
      <View style={{ flex: 1, backgroundColor: theme.canvas }}>
        {habit ? <HabitDetail habit={habit} /> : <ChannelNotFound />}
      </View>
    </>
  );
}

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
