/* SettingsInstrument — the Settings tab.
   The device's control panel: the net-new Coach-tone dial (Chill /
   Firm / Elite — a static-but-tappable PREVIEW; it drives real reminder
   copy at the v5 push beat), the daily-reminder segment clock, the
   day-mode switch (wired live to the theme), hardware toggles for
   haptics + LED brightness, the v4 "reset to seed" affordance, and the
   honest fine print as an etched label. No fake tab bar — the live
   navigator draws it.

   v4 rewrites the fine print: state now PERSISTS locally (AsyncStorage =
   localStorage on web), so a refresh no longer resets — which is exactly
   why a manual reset-to-seed now exists. */

import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { useHabitStore } from "@/lib/habit-store";
import { PressFade } from "./motion";
import {
  AppBar,
  BigClock,
  Field,
  HardwareSwitch,
  SegmentedControl,
} from "./instrument";

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
  const [coach, setCoach] = useState(1); // preview default: Firm
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
        <Field label="Coach tone" hint="reminder personality">
          <SegmentedControl options={["Chill", "Firm", "Elite"]} active={coach} onChange={setCoach} />
          <Text
            style={{
              fontFamily: FONTS.sans,
              fontSize: 11.5,
              color: theme.textMuted,
              marginTop: 2,
            }}
          >
            Preview — sets how the daily nudge talks to you. Wires into real notifications at v5.
          </Text>
        </Field>

        <Field label="Daily reminder">
          <BigClock time="09:00" />
        </Field>

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

        {/* Honest fine print — the etched label (guideline §2.3), now flipped
            by persistence. */}
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
            As of v4 your channels PERSIST on this device (AsyncStorage — localStorage in the web
            build), so a refresh no longer resets. There's still no account and no cloud sync — it
            lives only here. Use “Reset to seed” to start over. Daily reminders land in v5.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
