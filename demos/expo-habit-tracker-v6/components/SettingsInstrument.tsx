/* SettingsInstrument — the Settings tab.
   The device's control panel: the Coach-tone dial (Chill / Firm / Elite),
   the daily-reminder console, the day-mode switch (wired live to the
   theme), hardware toggles, the v4 "reset to seed" affordance, and the
   honest fine print. No fake tab bar — the live navigator draws it.

   v6 brings the Coach tone + daily reminder LIVE (the push beat): the dial
   now drives real notification copy, and the reminder console requests
   permission and schedules a daily local notification on a device. On the
   web build there's no OS scheduler, so it shows an in-app preview banner
   instead — landing with the SequenceIn (withSequence) arrival. */

import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { useHabitStore } from "@/lib/habit-store";
import { useReminder } from "@/lib/reminder";
import { useSession } from "@/lib/session";
import { COACH_ORDER, COACH_COPY } from "@/lib/notifications";
import { PressFade } from "./motion";
import ReminderPreview from "./ReminderPreview";
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

/* A small etched pill button (used by the reminder console). */
function ActionButton({
  label,
  tone = "today",
  onPress,
}: {
  label: string;
  tone?: "today" | "streak" | "muted";
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const color = tone === "streak" ? theme.streak : tone === "muted" ? theme.aluDk : theme.today;
  return (
    <PressFade
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{
        paddingVertical: 9,
        paddingHorizontal: 14,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: color,
        backgroundColor: theme.lcd,
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 10,
          letterSpacing: 1,
          textTransform: "uppercase",
          color,
        }}
      >
        {label}
      </Text>
    </PressFade>
  );
}

export default function SettingsInstrument() {
  const { theme, themeName, toggleTheme } = useTheme();
  const { resetToSeed } = useHabitStore();
  const reminder = useReminder();
  const session = useSession();
  const [wiped, setWiped] = useState(false);
  // bump to remount the preview banner so the SequenceIn arrival replays.
  const [previewNonce, setPreviewNonce] = useState(0);

  const coachIndex = COACH_ORDER.indexOf(reminder.tone);

  const onReset = () => {
    resetToSeed();
    setWiped(true);
    setTimeout(() => setWiped(false), 1600);
  };

  // status line under the reminder console
  const statusLine =
    reminder.permission === "web"
      ? "Web preview only — real OS reminders fire on a device build."
      : reminder.permission === "denied"
        ? "Permission denied — enable notifications in your OS settings."
        : reminder.enabled
          ? `Scheduled · fires daily at ${reminder.timeLabel}.`
          : "Enable to grant permission and schedule the daily nudge.";

  return (
    <View style={{ flex: 1 }}>
      <AppBar title="Settings · device" />
      <ScrollView contentContainerStyle={{ padding: 14, gap: 12 }}>
        <Field label="Coach tone" hint="reminder personality">
          <SegmentedControl
            options={COACH_ORDER.map((t) => COACH_COPY[t].label)}
            active={coachIndex}
            onChange={(i) => {
              reminder.setTone(COACH_ORDER[i]);
              setPreviewNonce((n) => n + 1); // replay the preview in the new voice
            }}
          />
          <Text
            style={{
              fontFamily: FONTS.sans,
              fontSize: 11.5,
              color: theme.textMuted,
              marginTop: 2,
            }}
          >
            Live — sets how your daily reminder talks to you. The preview below updates instantly.
          </Text>
        </Field>

        <Field label="Daily reminder">
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <BigClock time={reminder.timeLabel} />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <ActionButton label="Preview" tone="muted" onPress={() => setPreviewNonce((n) => n + 1)} />
              {reminder.enabled ? (
                <ActionButton label="Disable" tone="streak" onPress={reminder.disable} />
              ) : (
                <ActionButton label="Enable" tone="today" onPress={() => void reminder.enable()} />
              )}
            </View>
          </View>
          <Text
            style={{
              fontFamily: FONTS.sans,
              fontSize: 11.5,
              color: theme.textMuted,
              marginTop: 2,
            }}
          >
            {statusLine}
          </Text>
          {/* The live notification preview — keyed so it re-runs the
              withSequence arrival when the tone changes or you tap Preview. */}
          <View style={{ marginTop: 8 }}>
            <ReminderPreview
              key={`${reminder.tone}-${previewNonce}`}
              title={reminder.copy.title}
              body={reminder.copy.body}
              timeLabel={reminder.timeLabel}
              toneLabel={reminder.copy.label}
            />
          </View>
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
            Your channels + Coach tone persist on this device (no account, no cloud sync). v6's daily
            reminder is a real local notification — but it only fires on a phone (Expo Go or a native
            build). This deployed web build has no OS scheduler, so Enable just shows the in-app
            preview above. Reset to seed clears saved channels.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
