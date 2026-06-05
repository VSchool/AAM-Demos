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
import { HardwareSwitch } from "@/components/instrument";

const SOURCE = "https://github.com/VSchool/AAM-Demos/tree/main/demos/expo-habit-tracker-v0";

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
  const { theme, themeName, toggleTheme } = useTheme();
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
              each version adding exactly one mobile concept. You're looking at v0 — the static scaffold.
            </Text>
          </Section>

          {/* Day mode lives here in v0 — there's no Settings tab yet (tabs are
              the v1 beat), so About is the scaffold's only control surface. */}
          <Section tag="Day mode">
            <Pressable
              onPress={toggleTheme}
              accessibilityRole="switch"
              accessibilityState={{ checked: themeName === "light" }}
              accessibilityLabel="Day mode"
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: theme.lcd,
                borderWidth: 1,
                borderColor: theme.hairlineStrong,
                borderRadius: 9,
                paddingVertical: 11,
                paddingHorizontal: 13,
              }}
            >
              <Text style={{ fontFamily: FONTS.sans, fontSize: 12.5, color: theme.textMuted }}>
                {themeName === "dark" ? "Dark — glowing LCD on black" : "Light — positive LCD on silver"}
              </Text>
              <HardwareSwitch on={themeName === "light"} />
            </Pressable>
          </Section>

          <Section tag="The seven states">
            <Progression current={0} />
            <Text style={{ fontFamily: FONTS.sans, fontSize: 12.5, lineHeight: 19, color: theme.textMuted }}>
              Scaffold → tabs → list + form → swipe → storage → dynamic-route detail → push + coach. v0 is the
              bare starting point; each later version adds exactly one concept.
            </Text>
          </Section>

          <Section tag="Static for now, on purpose">
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
                v0 is read-only: the five channels render from typed sample data (lib/habits.ts), with no
                interaction yet. Navigation (v1), a live list + store (v2), the throw (v3) and persistence
                (v4) come next. No account, no cloud, no server; the login is a mock.
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
