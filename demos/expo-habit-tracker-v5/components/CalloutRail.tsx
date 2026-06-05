/* ============================================================
   CalloutRail — the external teaching annotations (wide desktop only).

   The browser teaching surface. EXACTLY three notes about the phone, in
   the HELPER palette (pale-sky, constant across themes) so they read
   unmistakably as annotations, never as app surfaces:
     1. the "this is the app" disclaimer,
     2. the scan-to-open QR (only meaningful on desktop),
     3. the seven build states.
   The honest-state and "take the tour" cards were dropped — honesty lives
   in the in-app About screen, and the tour now auto-runs inside the phone.
   On a real phone / narrow viewport this rail isn't rendered at all; that
   info is reached in-app via About.
   ============================================================ */

import { Text, View, type ViewStyle } from "react-native";
import { FONTS, HELPER } from "@/theme/tokens";
import ExpoGoQR from "./ExpoGoQR";
import Progression from "./Progression";

/* A teaching-annotation card. Helper-palette so it never reads as an app
   surface. `pointer` prints the "this is about the phone" cue. */
function Note({
  tag,
  pointer = "◂ in the app",
  children,
  style,
}: {
  tag: string;
  pointer?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: HELPER.bg,
          borderWidth: 1,
          borderColor: HELPER.accent,
          borderLeftWidth: 3,
          borderRadius: 12,
          padding: 16,
          gap: 10,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text
          style={{
            fontFamily: FONTS.monoBold,
            fontSize: 10,
            letterSpacing: 1.6,
            textTransform: "uppercase",
            color: HELPER.accent,
          }}
        >
          {tag}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.mono,
            fontSize: 9.5,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: HELPER.textMuted,
          }}
        >
          {pointer}
        </Text>
      </View>
      {children}
    </View>
  );
}

export default function CalloutRail() {
  return (
    <View style={{ gap: 14 }}>
      {/* 1 · what this is */}
      <Note tag="Pulse · v5 · detail" pointer="◂ this is the app">
        <Text style={{ fontFamily: FONTS.sansBold, fontSize: 20, lineHeight: 25, color: HELPER.text }}>
          A habit tracker, built like a pocket instrument.
        </Text>
        <Text style={{ fontFamily: FONTS.sans, fontSize: 13, lineHeight: 20, color: HELPER.textMuted }}>
          The phone to the left is the real, running app — built with Expo / React Native. Everything in
          this column is a note about it, not a web page the app lives inside. On your own phone you'd see
          only the app; these notes are just for the browser.
        </Text>
      </Note>

      {/* 2 · run it on your phone — iOS OR Android */}
      <Note tag="Run it on your phone" pointer="iOS or Android">
        <Text style={{ fontFamily: FONTS.sans, fontSize: 12.5, lineHeight: 19, color: HELPER.textMuted }}>
          Scan to open Pulse on your own phone — the same app, identical on iPhone and Android. No app
          store, no account.
        </Text>
        <ExpoGoQR />
      </Note>

      {/* 3 · the seven states */}
      <Note tag="The seven states" pointer="one concept each">
        <Progression current={5} />
      </Note>
    </View>
  );
}
