/* SettingsInstrument — the Settings tab.
   The device's control panel: the day-mode switch (wired live to the
   theme), hardware toggles, About, Log out, and the honest fine print.
   No fake tab bar — the live navigator draws it.

   (No "reset to seed" here — v3's store is in-memory, so a refresh already
   resets to the seed; persistence + reset arrive at v4. Coach tone + the
   daily reminder arrive at v6 — the push beat.) */

import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
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
  const session = useSession();

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
            Your channels live in memory for this session — a refresh resets to the seed roster
            (persistence arrives at v4). No account, no cloud, no server. The login is a mock; your
            profile lives on this device.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
