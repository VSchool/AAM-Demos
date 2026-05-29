/* Footer (guideline §3.2) — copyright, version string, source link.
   Boring on purpose. */

import { Linking, Pressable, Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { MAX_WIDTH } from "./ui";

const SOURCE =
  "https://github.com/VSchool/AAM-Demos/tree/main/demos/expo-habit-tracker-v6";

export default function Footer() {
  const { theme } = useTheme();
  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: theme.hairline,
        backgroundColor: theme.canvasRaised,
        paddingVertical: 26,
        marginTop: 56,
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: MAX_WIDTH,
          alignSelf: "center",
          paddingHorizontal: 24,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.mono,
            fontSize: 11,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            color: theme.aluDk,
          }}
        >
          Pulse · expo-habit-tracker · v6 · final
        </Text>
        <Pressable onPress={() => Linking.openURL(SOURCE)}>
          <Text
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              color: theme.textMuted,
            }}
          >
            Source ↗
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
