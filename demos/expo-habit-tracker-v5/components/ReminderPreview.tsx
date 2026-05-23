/* ReminderPreview — an in-app mock of the daily reminder notification.
   This is how v5 stays visibly LIVE on the web build (where the OS can't
   post a real notification): it renders the exact Coach-tone copy that
   would be scheduled, landing with the v5 SequenceIn (withSequence)
   overshoot-and-settle. Styled as a notification banner in the Pulse
   instrument language. Remount via `key` to replay the arrival. */

import { Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { SequenceIn } from "./motion";

export default function ReminderPreview({
  title,
  body,
  timeLabel,
  toneLabel,
}: {
  title: string;
  body: string;
  timeLabel: string;
  toneLabel: string;
}) {
  const { theme } = useTheme();
  return (
    <SequenceIn>
      <View
        style={{
          backgroundColor: theme.appbarTo,
          borderWidth: 1,
          borderColor: theme.hairlineStrong,
          borderRadius: 14,
          padding: 13,
          gap: 7,
          ...(theme.glow
            ? {
                shadowColor: "#000",
                shadowOpacity: 0.5,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 8 },
              }
            : {}),
        }}
      >
        {/* banner header — app glyph + name + delivery time */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              backgroundColor: theme.lcd,
              borderWidth: 1,
              borderColor: theme.hairlineStrong,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: theme.streak, fontSize: 11, fontFamily: FONTS.sansBold }}>▸</Text>
          </View>
          <Text
            style={{
              fontFamily: FONTS.mono,
              fontSize: 9.5,
              letterSpacing: 1.6,
              textTransform: "uppercase",
              color: theme.aluDk,
              flex: 1,
            }}
          >
            Pulse · {toneLabel}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.mono,
              fontSize: 9.5,
              letterSpacing: 1,
              color: theme.aluDk,
            }}
          >
            {timeLabel}
          </Text>
        </View>
        <Text style={{ fontFamily: FONTS.sansBold, fontSize: 14.5, color: theme.print }}>
          {title}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.sans,
            fontSize: 12.5,
            lineHeight: 18,
            color: theme.textMuted,
          }}
        >
          {body}
        </Text>
      </View>
    </SequenceIn>
  );
}
