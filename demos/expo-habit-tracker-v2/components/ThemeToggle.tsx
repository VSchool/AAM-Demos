/* ThemeToggle = the in-app "day mode" switch AND the guideline's
   PaletteToggle chrome (§3.5) in one floating instrument.
   - The hardware switch flips dark ⇄ light (Pulse's net feature).
   - "Palette" opens a panel showing the live design system for the
     CURRENT theme — surfaces, the 4 reserved roles, the helper palette
     — each swatch click-to-copy. Reserved hexes change with the theme,
     which is the teaching point: same roles, re-skinned.
   Lives in app/_layout.tsx so every screen carries it. */

import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { FONTS, HELPER, RESERVED_ROLES } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";

function copyHex(hex: string) {
  if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText(hex).catch(() => {});
  }
}

const fixed = (s: ViewStyle): ViewStyle =>
  Platform.OS === "web" ? ({ position: "fixed", ...s } as unknown as ViewStyle) : { position: "absolute", ...s };

export default function ThemeToggle() {
  const { theme, themeName, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const isDark = themeName === "dark";

  const surfaces = [
    { token: "canvas", hex: theme.canvas, role: "Device body / page" },
    { token: "panel", hex: theme.panel, role: "Channel card" },
    { token: "lcd", hex: theme.lcd, role: "Segment readout face" },
    { token: "print", hex: theme.print, role: "Screen-print text" },
    { token: "alu", hex: theme.alu, role: "Machined-aluminum label" },
  ];
  const reserved = RESERVED_ROLES.map((r) => ({
    token: r.role,
    hex: theme[r.role],
    role: r.meaning,
  }));
  const helper = [
    { token: "helper.bg", hex: HELPER.bg, role: "Annotation panel" },
    { token: "helper.accent", hex: HELPER.accent, role: "Annotation accent" },
    { token: "helper.text", hex: HELPER.text, role: "Annotation text" },
  ];

  const onCopy = (hex: string) => {
    copyHex(hex);
    setCopied(hex);
    setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1100);
  };

  const Swatch = ({ token, hex, role }: { token: string; hex: string; role: string }) => (
    <Pressable
      onPress={() => onCopy(hex)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: theme.hairline,
        backgroundColor: theme.canvas,
      }}
    >
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 6,
          backgroundColor: hex,
          borderWidth: 1,
          borderColor: theme.hairlineStrong,
        }}
      />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontFamily: FONTS.monoBold, fontSize: 11.5, color: theme.print }}>
          {token}
        </Text>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: theme.aluDk }}>
          {copied === hex ? "copied ✓" : hex}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: FONTS.sans,
          fontSize: 10.5,
          color: theme.aluDk,
          maxWidth: 120,
          textAlign: "right",
        }}
      >
        {role}
      </Text>
    </Pressable>
  );

  const Group = ({
    title,
    blurb,
    items,
  }: {
    title: string;
    blurb: string;
    items: { token: string; hex: string; role: string }[];
  }) => (
    <View style={{ gap: 6, marginBottom: 16 }}>
      <Text
        style={{
          fontFamily: FONTS.monoBold,
          fontSize: 10.5,
          letterSpacing: 1.6,
          textTransform: "uppercase",
          color: theme.streak,
        }}
      >
        {title}
      </Text>
      <Text style={{ fontFamily: FONTS.sans, fontSize: 11.5, color: theme.aluDk }}>{blurb}</Text>
      <View style={{ gap: 6, marginTop: 4 }}>
        {items.map((s) => (
          <Swatch key={s.token} {...s} />
        ))}
      </View>
    </View>
  );

  return (
    <>
      {/* palette panel + backdrop */}
      {open ? (
        <>
          <Pressable
            onPress={() => setOpen(false)}
            style={fixed({ top: 0, left: 0, right: 0, bottom: 0, zIndex: 78 })}
          />
          <View
            style={fixed({
              right: 22,
              bottom: 78,
              zIndex: 79,
              width: 340,
              maxWidth: "92%" as unknown as number,
              maxHeight: 520,
              backgroundColor: theme.panel,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.hairlineStrong,
              overflow: "hidden",
            })}
          >
            <View
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: theme.hairline,
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 10,
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                  color: theme.aluDk,
                }}
              >
                UI kit · {themeName} theme
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.sansBold,
                  fontSize: 18,
                  color: theme.print,
                  marginTop: 3,
                }}
              >
                Pulse palette
              </Text>
            </View>
            <ScrollView style={{ padding: 16 }} contentContainerStyle={{ paddingBottom: 8 }}>
              <Group
                title="Surfaces"
                blurb="The machined body, panels and LCD face."
                items={surfaces}
              />
              <Group
                title="Reserved roles ★"
                blurb="One meaning each, never decoration. Hexes change per theme; roles never do."
                items={reserved}
              />
              <Group
                title="Helper palette"
                blurb="Teaching-annotation colors — kept separate from the brand, constant across themes."
                items={helper}
              />
              <Text
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 11,
                  lineHeight: 17,
                  color: theme.aluDk,
                  marginTop: 4,
                }}
              >
                Tap a swatch to copy its hex. These map to the tokens in{" "}
                <Text style={{ fontFamily: FONTS.mono }}>theme/tokens.ts</Text>.
              </Text>
            </ScrollView>
          </View>
        </>
      ) : null}

      {/* the FAB: theme switch + palette opener */}
      <View
        style={fixed({
          right: 22,
          bottom: 22,
          zIndex: 80,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        })}
      >
        <Pressable
          onPress={toggleTheme}
          accessibilityLabel="Toggle day mode"
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingVertical: 9,
            paddingHorizontal: 12,
            borderRadius: 999,
            backgroundColor: theme.panel,
            borderWidth: 1,
            borderColor: theme.hairlineStrong,
            ...(Platform.OS === "web"
              ? ({ boxShadow: "0 12px 28px rgba(0,0,0,0.28)" } as unknown as ViewStyle)
              : { shadowColor: "#000", shadowOpacity: 0.28, shadowRadius: 14, shadowOffset: { width: 0, height: 8 } }),
          }}
        >
          <Text style={{ fontSize: 13, opacity: isDark ? 1 : 0.4 }}>☾</Text>
          <View
            style={{
              width: 34,
              height: 18,
              borderRadius: 9,
              backgroundColor: theme.lcd,
              borderWidth: 1,
              borderColor: theme.hairlineStrong,
              justifyContent: "center",
            }}
          >
            <View
              style={{
                position: "absolute",
                left: isDark ? 2 : 18,
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: isDark ? theme.alu : theme.today,
              }}
            />
          </View>
          <Text style={{ fontSize: 13, opacity: isDark ? 0.4 : 1 }}>☀</Text>
        </Pressable>

        <Pressable
          onPress={() => setOpen((v) => !v)}
          accessibilityLabel="Open palette"
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingVertical: 9,
            paddingHorizontal: 14,
            borderRadius: 999,
            backgroundColor: open ? theme.print : theme.panel,
            borderWidth: 1,
            borderColor: open ? theme.print : theme.hairlineStrong,
            ...(Platform.OS === "web"
              ? ({ boxShadow: "0 12px 28px rgba(0,0,0,0.28)" } as unknown as ViewStyle)
              : { shadowColor: "#000", shadowOpacity: 0.28, shadowRadius: 14, shadowOffset: { width: 0, height: 8 } }),
          }}
        >
          <View
            style={{
              width: 16,
              height: 16,
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {[theme.done, theme.today, theme.streak, theme.rest].map((c, i) => (
              <View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c }} />
            ))}
          </View>
          <Text
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              color: open ? theme.canvas : theme.aluDk,
            }}
          >
            {open ? "Close" : "Palette"}
          </Text>
        </Pressable>
      </View>
    </>
  );
}
