/* ExpoGoQR (guideline §9) — scan-to-open card for the home page.
   v0 ships as a web export on GitHub Pages, so the QR points at the
   deployed web build — scan it to open Pulse on a phone browser.
   The native Expo Go / EAS preview lands at v5 (push can't run on web). */

import QRCode from "react-native-qrcode-svg";
import { Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";

const DEPLOY_URL = "https://vschool.github.io/AAM-Demos/expo-habit-tracker-v1/";

export default function ExpoGoQR() {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 18,
        alignItems: "center",
        backgroundColor: theme.panel,
        borderWidth: 1,
        borderColor: theme.hairline,
        borderRadius: 14,
        padding: 18,
      }}
    >
      <View
        style={{
          backgroundColor: "#FFFFFF",
          padding: 10,
          borderRadius: 10,
        }}
      >
        <QRCode value={DEPLOY_URL} size={104} backgroundColor="#FFFFFF" color="#0B0C0E" />
      </View>
      <View style={{ flex: 1, gap: 6 }}>
        <Text
          style={{
            fontFamily: FONTS.mono,
            fontSize: 10,
            letterSpacing: 1.6,
            textTransform: "uppercase",
            color: theme.aluDk,
          }}
        >
          Try it on a phone
        </Text>
        <Text style={{ fontFamily: FONTS.sansSemi, fontSize: 16, color: theme.print }}>
          Scan to open Pulse
        </Text>
        <Text style={{ fontFamily: FONTS.sans, fontSize: 12.5, lineHeight: 19, color: theme.textMuted }}>
          Opens the deployed web build in your phone's browser. The native Expo Go preview
          arrives at v5, where push notifications need a real device.
        </Text>
      </View>
    </View>
  );
}
