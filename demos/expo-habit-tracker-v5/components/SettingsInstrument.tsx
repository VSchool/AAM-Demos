/* SettingsInstrument — the Settings tab.
   The device's control panel: the day-mode switch (wired live to the
   theme), hardware toggles, the v4 "reset to seed" affordance, About,
   Log out, and the honest fine print. No fake tab bar — the live
   navigator draws it.

   (Coach tone + the daily-reminder console arrive in v6 — the push beat.
   v5 stops at the detail route, so Settings here is the v4 control panel
   plus the universal shell's About + Log out rows.) */

import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { useHabitStore } from "@/lib/habit-store";
import { useSession } from "@/lib/session";
import { PressFade } from "./motion";
import { AppBar, HardwareSwitch } from "./instrument";

/* label + sub-label on the left, a hardware switch on the right. */
function SwitchRow({
  label,
  sub,
  on,
  onPress,
}: {
  label: string;
  sub: string;
  on: boolean;
  onPress?: () => void;
}) {
  const { theme } = useTheme();
  const body = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        backgroundColor: theme.lcd,
        borderWidth: 1,
        borderColor: theme.hairlineStrong,
        borderRadius: 9,
        paddingVertical: 11,
        paddingHorizontal: 13,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: FONTS.mono,
            fontSize: 9,
            letterSpacing: 1.8,
            textTransform: "uppercase",
            color: theme.aluDk,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.sans,
            fontSize: 12.5,
            color: theme.textMuted,
            marginTop: 3,
          }}
        >
          {sub}
        </Text>
      </View>
      <HardwareSwitch on={on} />
    </View>
  );

  return onPress ? (
    <PressFade onPress={onPress} accessibilityRole="switch" accessibilityState={{ checked: on }}>
      {body}
    </PressFade>
  ) : (
    body
  );
}

export default function SettingsInstrument() {
  const { theme, themeName, toggleTheme } = useTheme();
  const { resetToSeed } = useHabitStore();
  const session = useSession();
  const [wiped, setWiped] = useState(false);

  const onReset = () => {
    resetToSeed();
    setWiped(true);
    setTimeout(() => setWiped(false), 1600);
  };

  return (
    <View style={{ flex: 1 }}>
      <AppBar title="Settings · device" />
      <ScrollView contentContainerStyle={{ padding: 14, gap: 12 }}>
        <SwitchRow
          label="Day mode"
          sub={themeName === "dark" ? "dark — glowing LCD on black" : "light — positive LCD on silver"}
          on={themeName === "light"}
          onPress={toggleTheme}
        />

        <SwitchRow label="Haptic snap" sub="mechanical feedback on throw" on />
        <SwitchRow label="LED brightness" sub="auto · dims at night" on />

        {/* v4 reset — now that state survives a refresh, this is the way back
            to the factory roster. Streak-orange because it's a destructive-ish
            control, not a status. */}
        <PressFade onPress={onReset} accessibilityRole="button" accessibilityLabel="Reset to seed roster">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              backgroundColor: theme.lcd,
              borderWidth: 1,
              borderColor: theme.streak,
              borderRadius: 9,
              paddingVertical: 11,
              paddingHorizontal: 13,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 9,
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                  color: theme.streak,
                }}
              >
                Reset to seed
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 12.5,
                  color: theme.textMuted,
                  marginTop: 3,
                }}
              >
                {wiped
                  ? "Wiped — five seed channels restored."
                  : "Clear saved channels and restore the factory roster."}
              </Text>
            </View>
            <Text style={{ fontFamily: FONTS.monoBold, fontSize: 13, color: theme.streak }}>
              {wiped ? "✓" : "⟲"}
            </Text>
          </View>
        </PressFade>

        {/* About — opens the in-app About screen (the build-info home). */}
        <Pressable
          onPress={() => router.push("/about")}
          accessibilityRole="button"
          accessibilityLabel="About Pulse"
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.lcd,
            borderWidth: 1,
            borderColor: theme.hairlineStrong,
            borderRadius: 9,
            paddingVertical: 13,
            paddingHorizontal: 13,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              color: theme.aluDk,
            }}
          >
            About Pulse
          </Text>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 13, color: theme.aluDk }}>›</Text>
        </Pressable>

        {/* Log out — returns to the mock login (clears the session only). */}
        <PressFade onPress={session.signOut} accessibilityRole="button" accessibilityLabel="Log out">
          <View
            style={{
              alignItems: "center",
              backgroundColor: theme.lcd,
              borderWidth: 1,
              borderColor: theme.hairlineStrong,
              borderRadius: 9,
              paddingVertical: 13,
              paddingHorizontal: 13,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.mono,
                fontSize: 10,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                color: theme.streak,
              }}
            >
              Log out
            </Text>
          </View>
        </PressFade>

        {/* Honest fine print — the etched label (guideline §2.3). */}
        <View
          style={{
            backgroundColor: theme.lcd,
            borderWidth: 1,
            borderColor: theme.done,
            borderLeftWidth: 3,
            borderRadius: 9,
            paddingVertical: 11,
            paddingHorizontal: 13,
            gap: 5,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.mono,
              fontSize: 9,
              letterSpacing: 1.8,
              textTransform: "uppercase",
              color: theme.done,
            }}
          >
            Honest fine print
          </Text>
          <Text
            style={{
              fontFamily: FONTS.sans,
              fontSize: 12.5,
              lineHeight: 19,
              color: theme.textMuted,
            }}
          >
            Your channels persist on this device with AsyncStorage — no account, no cloud sync. The
            login is a mock; your profile lives on this device. Reset to seed clears saved channels.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
