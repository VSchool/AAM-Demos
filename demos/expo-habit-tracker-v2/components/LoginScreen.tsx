/* ============================================================
   LoginScreen — the mock sign-in (the app's first screen).

   Teaches the login PATTERN: branded header, email + password fields,
   a primary action that takes you into the app. It's a MOCK — any input
   (or none) signs you in; nothing is sent anywhere. The fine print is
   honest about that and points at the optional "make it real" path.

   Pure in-app screen (theme tokens, fills the device) so it's identical
   in the browser bezel and on a real phone.
   ============================================================ */

import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { TextField } from "./instrument";

function LabeledField({
  label,
  value,
  onChangeText,
  placeholder,
  secure,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (s: string) => void;
  placeholder: string;
  secure?: boolean;
  keyboardType?: "email-address" | "default";
}) {
  const { theme } = useTheme();
  return (
    <View style={{ gap: 6 }}>
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
      <View
        style={{
          backgroundColor: theme.lcd,
          borderWidth: 1,
          borderColor: theme.hairlineStrong,
          borderRadius: 9,
          paddingVertical: 13,
          paddingHorizontal: 13,
        }}
      >
        <TextField
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

export default function LoginScreen({ onSignIn }: { onSignIn: (email?: string) => void }) {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas, padding: 26, justifyContent: "center", gap: 22 }}>
      {/* brand */}
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
          <Text style={{ color: theme.streak, fontSize: 26, fontFamily: FONTS.sansBold }}>▸</Text>
          <Text style={{ fontFamily: FONTS.sansBold, fontSize: 30, letterSpacing: -0.5, color: theme.print }}>
            Pulse
          </Text>
        </View>
        <Text style={{ fontFamily: FONTS.sans, fontSize: 14, lineHeight: 20, color: theme.textMuted }}>
          A habit tracker in your pocket. Sign in to pick up where you left off.
        </Text>
      </View>

      {/* fields */}
      <View style={{ gap: 14 }}>
        <LabeledField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
        />
        <LabeledField
          label="Password"
          value={pw}
          onChangeText={setPw}
          placeholder="••••••••"
          secure
        />
      </View>

      {/* primary action */}
      <Pressable
        onPress={() => onSignIn(email.trim() || undefined)}
        accessibilityRole="button"
        accessibilityLabel="Sign in"
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
          Sign in ▸
        </Text>
      </Pressable>

      {/* honest mock note */}
      <Text style={{ fontFamily: FONTS.sans, fontSize: 11.5, lineHeight: 17, color: theme.aluDk, textAlign: "center" }}>
        This login is a <Text style={{ color: theme.textMuted }}>mock</Text> — any details sign you in, nothing
        leaves your device. Wiring it to real auth (Firebase, Supabase, your own backend) is an optional next
        step you choose.
      </Text>
    </View>
  );
}
