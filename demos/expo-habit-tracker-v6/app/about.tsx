/* ============================================================
   /about — the in-app "About Pulse" screen (NOT a web page).

   The home for everything that doesn't belong on the working tabs: what
   Pulse is, the seven-state build arc, the on-device honesty note, and the
   source link. Reached from the "More about this version" row on Today and
   from Settings → About. Pushed like the detail screen (slide-in), so it
   reads as a real route inside the phone — identical on browser + device.

   On a wide browser this same info also appears as the external rail
   annotations; here it's the in-app, always-reachable copy.
   ============================================================ */

import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { router, Stack } from "expo-router";
import { useReducedMotion } from "react-native-reanimated";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import Progression from "@/components/Progression";

const SOURCE = "https://github.com/VSchool/AAM-Demos/tree/main/demos/expo-habit-tracker-v6";

function Section({ tag, children }: { tag: string; children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 9.5,
          letterSpacing: 1.8,
          textTransform: "uppercase",
          color: theme.streak,
        }}
      >
        {tag}
      </Text>
      {children}
    </View>
  );
}

export default function About() {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const animation: "slide_from_right" | "none" = reduce ? "none" : "slide_from_right";

  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation }} />
      <View style={{ flex: 1, backgroundColor: theme.canvas }}>
        {/* in-app back bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: theme.appbarTo,
            borderBottomWidth: 1,
            borderBottomColor: theme.name === "dark" ? "#000" : theme.hairlineStrong,
            paddingHorizontal: 14,
            paddingTop: 12,
            paddingBottom: 12,
          }}
        >
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back" hitSlop={10}>
            <Text style={{ fontFamily: FONTS.sansBold, fontSize: 18, color: theme.today }}>‹</Text>
          </Pressable>
          <Text
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11,
              letterSpacing: 2.2,
              textTransform: "uppercase",
              color: theme.alu,
            }}
          >
            About Pulse
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 18, gap: 22 }}>
          <Section tag="What this is">
            <Text style={{ fontFamily: FONTS.sansBold, fontSize: 22, lineHeight: 28, color: theme.print }}>
              A habit tracker, built like a pocket instrument.
            </Text>
            <Text style={{ fontFamily: FONTS.sans, fontSize: 14, lineHeight: 21, color: theme.textMuted }}>
              Pulse is a real Expo / React Native app, built across seven progressive states for Week 5 Day 4 —
              each version adding exactly one mobile concept. You're looking at the final state, v6.
            </Text>
          </Section>

          <Section tag="The seven states">
            <Progression current={6} />
            <Text style={{ fontFamily: FONTS.sans, fontSize: 12.5, lineHeight: 19, color: theme.textMuted }}>
              Scaffold → tabs → list + form → swipe → storage → dynamic-route detail → push + coach. v6 adds
              push notifications + a Coach tone on top of v5's detail screen.
            </Text>
          </Section>

          <Section tag="On-device, on purpose">
            <View
              style={{
                backgroundColor: theme.lcd,
                borderWidth: 1,
                borderColor: theme.done,
                borderLeftWidth: 3,
                borderRadius: 10,
                padding: 14,
              }}
            >
              <Text style={{ fontFamily: FONTS.sans, fontSize: 13, lineHeight: 20, color: theme.textMuted }}>
                Your channels + Coach tone save on this device with AsyncStorage — no account, no cloud, no
                server. The login is a mock; wiring real auth and sync is an optional next step you choose.
                Reset to seed any time from Settings.
              </Text>
            </View>
          </Section>

          <Section tag="Source">
            <Pressable onPress={() => Linking.openURL(SOURCE)} accessibilityRole="link" accessibilityLabel="View source on GitHub">
              <Text
                style={{
                  fontFamily: FONTS.monoBold,
                  fontSize: 12,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: theme.today,
                }}
              >
                View on GitHub ↗
              </Text>
            </Pressable>
          </Section>
        </ScrollView>
      </View>
    </>
  );
}
