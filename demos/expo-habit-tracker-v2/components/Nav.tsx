/* Sticky top nav (guideline §3.1) — brand "Pulse" + the
   `v2 · list + form` state indicator + primary route links. The brand
   glyph uses the reserved streak accent. */

import { Link, usePathname } from "expo-router";
import { Platform, Pressable, Text, View, type ViewStyle } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { MAX_WIDTH } from "./ui";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/today", label: "Today" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const { theme } = useTheme();
  const pathname = usePathname();

  const stickyWeb: ViewStyle =
    Platform.OS === "web"
      ? ({ position: "sticky", top: 0 } as unknown as ViewStyle)
      : {};

  return (
    <View
      style={[
        {
          zIndex: 50,
          backgroundColor: theme.canvasRaised,
          borderBottomWidth: 1,
          borderBottomColor: theme.hairline,
        },
        stickyWeb,
      ]}
    >
      <View
        style={{
          width: "100%",
          maxWidth: MAX_WIDTH,
          alignSelf: "center",
          height: 60,
          paddingHorizontal: 24,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" asChild>
          <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ color: theme.streak, fontSize: 18, fontFamily: FONTS.sansBold }}>
              ▸
            </Text>
            <Text
              style={{
                fontFamily: FONTS.sansBold,
                fontSize: 18,
                letterSpacing: -0.3,
                color: theme.print,
              }}
            >
              Pulse
            </Text>
            <Text
              style={{
                fontFamily: FONTS.mono,
                fontSize: 11,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: theme.aluDk,
                marginLeft: 4,
              }}
            >
              v2 · list + form
            </Text>
          </Pressable>
        </Link>

        <View style={{ flexDirection: "row", gap: 2 }}>
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href as never} asChild>
                <Pressable style={{ paddingVertical: 8, paddingHorizontal: 10 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 12,
                      letterSpacing: 1.4,
                      textTransform: "uppercase",
                      color: active ? theme.today : theme.aluDk,
                    }}
                  >
                    {l.label}
                  </Text>
                </Pressable>
              </Link>
            );
          })}
        </View>
      </View>
    </View>
  );
}
