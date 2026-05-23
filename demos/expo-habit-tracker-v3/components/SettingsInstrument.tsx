/* SettingsInstrument — the v1 Settings tab.
   The device's control panel: the net-new Coach-tone dial (Chill /
   Firm / Elite — a static-but-tappable PREVIEW; it drives real reminder
   copy at the v5 push beat), the daily-reminder segment clock, the
   day-mode switch (wired live to the theme), hardware toggles for
   haptics + LED brightness, and the honest fine print as an etched
   warning label. No fake tab bar — the live navigator draws it. */

import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
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
  const [coach, setCoach] = useState(1); // preview default: Firm

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

        {/* Honest fine print — the etched warning label (guideline §2.3). */}
        <View
          style={{
            backgroundColor: theme.lcd,
            borderWidth: 1,
            borderColor: theme.streak,
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
              color: theme.streak,
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
            Session memory only until v4. Refresh = reset, on purpose — persistence is the v4
            lesson, not the demo. No account, no cloud sync.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
