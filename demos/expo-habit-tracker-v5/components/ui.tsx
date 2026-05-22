/* ============================================================
   Pulse — shared UI primitives (the teaching-landing chrome).
   Themed Text/layout building blocks used across the home page,
   About page and chrome components. The product instrument lives
   in components/instrument.tsx; this file is the page around it.
   ============================================================ */

import { type ReactNode } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type TextProps,
  type TextStyle,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import { Link } from "expo-router";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";

export const MAX_WIDTH = 1080;

/* Centred, max-width page column for web; full-bleed on native. */
export function Page({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const pad = width < 640 ? 18 : 28;
  return (
    <View style={{ backgroundColor: theme.canvas, flex: 1 }}>
      <View
        style={{
          width: "100%",
          maxWidth: MAX_WIDTH,
          alignSelf: "center",
          paddingHorizontal: pad,
          paddingTop: 44,
          paddingBottom: 96,
        }}
      >
        {children}
      </View>
    </View>
  );
}

/* Mono eyebrow with a leading ▸, the section's "01 · label" pattern. */
export function Eyebrow({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <Text
      style={{
        fontFamily: FONTS.mono,
        fontSize: 11,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: theme.today,
        marginBottom: 14,
      }}
    >
      {"▸  "}
      {children}
    </Text>
  );
}

export function SectionTag({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <Text
      style={{
        fontFamily: FONTS.mono,
        fontSize: 10.5,
        letterSpacing: 2.2,
        textTransform: "uppercase",
        color: theme.aluDk,
        marginBottom: 12,
      }}
    >
      {children}
    </Text>
  );
}

export function H1({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const size = width < 520 ? 36 : width < 900 ? 46 : 56;
  return (
    <Text
      style={{
        fontFamily: FONTS.sansBold,
        fontSize: size,
        lineHeight: size * 1.02,
        letterSpacing: -size * 0.03,
        color: theme.print,
        marginBottom: 16,
        maxWidth: 18 * (size * 0.62),
      }}
    >
      {children}
    </Text>
  );
}

export function H2({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const size = width < 520 ? 28 : 38;
  return (
    <Text
      style={{
        fontFamily: FONTS.sansBold,
        fontSize: size,
        lineHeight: size * 1.05,
        letterSpacing: -size * 0.025,
        color: theme.print,
        marginBottom: 18,
      }}
    >
      {children}
    </Text>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <Text
      style={{
        fontFamily: FONTS.sans,
        fontSize: 17,
        lineHeight: 27,
        color: theme.textMuted,
        maxWidth: 640,
        marginBottom: 32,
      }}
    >
      {children}
    </Text>
  );
}

/* Body text on canvas. */
export function Body({ style, children, ...rest }: TextProps & { children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <Text
      {...rest}
      style={[
        { fontFamily: FONTS.sans, fontSize: 14, lineHeight: 22, color: theme.textMuted },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

/* Inline mono "code" chip. */
export function Code({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <Text
      style={{
        fontFamily: FONTS.mono,
        fontSize: 12.5,
        color: theme.today,
        backgroundColor: theme.lcd,
      }}
    >
      {" "}
      {children}{" "}
    </Text>
  );
}

export function Section({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[{ marginTop: 52 }, style]}>{children}</View>;
}

export function Hairline() {
  const { theme } = useTheme();
  return (
    <View
      style={{ height: 1, backgroundColor: theme.hairline, marginVertical: 8 }}
    />
  );
}

/* Primary chevron CTA (the "throw a switch" filled button). */
export function PrimaryButton({
  label,
  href,
  onPress,
  tone = "streak",
}: {
  label: string;
  href?: string;
  onPress?: () => void;
  tone?: "streak" | "done" | "today";
}) {
  const { theme } = useTheme();
  const bg = theme[tone];
  const inner = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: bg,
        paddingVertical: 13,
        paddingHorizontal: 22,
        ...(theme.glow
          ? {
              shadowColor: bg,
              shadowOpacity: 0.4,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 0 },
            }
          : {
              shadowColor: "#000",
              shadowOpacity: 0.18,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
            }),
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.sansBold,
          fontSize: 15,
          letterSpacing: 0.2,
          color: theme.name === "dark" ? "#0B0C0E" : "#160701",
        }}
      >
        {label}
      </Text>
    </View>
  );
  if (href) {
    return (
      <Link href={href as never} asChild>
        <Pressable>{inner}</Pressable>
      </Link>
    );
  }
  return <Pressable onPress={onPress}>{inner}</Pressable>;
}

/* Secondary outline button — mono, etched. */
export function GhostButton({ label, href }: { label: string; href?: string }) {
  const { theme } = useTheme();
  const inner = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 13,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: theme.hairlineStrong,
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 12,
          letterSpacing: 1.8,
          textTransform: "uppercase",
          color: theme.aluDk,
        }}
      >
        {label}
      </Text>
    </View>
  );
  if (href) {
    return (
      <Link href={href as never} asChild>
        <Pressable>{inner}</Pressable>
      </Link>
    );
  }
  return inner;
}

/* A raised instrument panel — the card surface everything sits on. */
export function Panel({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.panel,
          borderWidth: 1,
          borderColor: theme.hairline,
          borderRadius: 14,
          padding: 18,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/* Cross-platform monospace-friendly default — applied app-wide via _layout. */
export const webSelectNone: TextStyle =
  Platform.OS === "web" ? ({ userSelect: "none" } as TextStyle) : {};

export const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
});
