/* ============================================================
   WelcomeScreen — the one-time post-login welcome.

   Shown once per sign-in, between login and the app. A real app's
   "you're in" moment: brand, a warm one-liner, and a light summary of
   what Pulse does — then "Get started" drops you into Today, where the
   what's-new tour auto-runs. Not a tab, not revisited; pure onboarding.
   ============================================================ */

import { Pressable, Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";

function SummaryRow({ tone, label, text }: { tone: "done" | "today" | "streak"; label: string; text: string }) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
      <View
        style={{
          width: 9,
          height: 9,
          borderRadius: 5,
          marginTop: 5,
          backgroundColor: theme[tone],
          shadowColor: theme.glow ? theme[tone] : "transparent",
          shadowOpacity: theme.glow ? 0.9 : 0,
          shadowRadius: theme.glow ? 5 : 0,
        }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: FONTS.sansSemi, fontSize: 14.5, color: theme.print }}>{label}</Text>
        <Text style={{ fontFamily: FONTS.sans, fontSize: 12.5, lineHeight: 18, color: theme.textMuted }}>
          {text}
        </Text>
      </View>
    </View>
  );
}

export default function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas, padding: 26, justifyContent: "center", gap: 26 }}>
      <View style={{ gap: 10 }}>
        <Text
          style={{
            fontFamily: FONTS.mono,
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: theme.streak,
          }}
        >
          Welcome to Pulse
        </Text>
        <Text style={{ fontFamily: FONTS.sansBold, fontSize: 27, lineHeight: 32, color: theme.print }}>
          A habit tracker in your pocket.
        </Text>
        <Text style={{ fontFamily: FONTS.sans, fontSize: 14, lineHeight: 21, color: theme.textMuted }}>
          Built like a pocket instrument — channels you check in on, momentum you can see, kind rest days
          that never break your streak.
        </Text>
      </View>

      <View style={{ gap: 16 }}>
        <SummaryRow
          tone="today"
          label="Track today"
          text="Swipe a channel right to complete it, left for a guilt-free rest day."
        />
        <SummaryRow
          tone="streak"
          label="Watch momentum build"
          text="Streaks and a 30-day history show your consistency at a glance."
        />
        <SummaryRow
          tone="done"
          label="Yours, on this device"
          text="Everything saves locally — no account, no cloud, no catch."
        />
      </View>

      <Pressable
        onPress={onStart}
        accessibilityRole="button"
        accessibilityLabel="Get started"
        style={{
          backgroundColor: theme.streak,
          borderRadius: 11,
          paddingVertical: 15,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.monoBold,
            fontSize: 13,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            color: "#0B0C0E",
          }}
        >
          Get started ▸
        </Text>
      </Pressable>
    </View>
  );
}
