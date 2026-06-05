/* Day/night switch — a small floating affordance on every screen. */

import { Platform, Pressable, Text, View, type ViewStyle } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

const fixed = (s: ViewStyle): ViewStyle =>
  Platform.OS === "web"
    ? ({ position: "fixed", ...s } as unknown as ViewStyle)
    : { position: "absolute", ...s };

export default function ThemeToggle() {
  const { theme, themeName, toggleTheme } = useTheme();
  const isDark = themeName === "dark";

  return (
    <Pressable
      onPress={toggleTheme}
      accessibilityLabel="Toggle day mode"
      accessibilityRole="switch"
      accessibilityState={{ checked: !isDark }}
      style={fixed({
        right: 14,
        top: 14,
        zIndex: 80,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 9,
        borderRadius: 999,
        backgroundColor: theme.panel,
        borderWidth: 1,
        borderColor: theme.hairlineStrong,
        ...(Platform.OS === "web"
          ? ({ boxShadow: "0 6px 18px rgba(0,0,0,0.28)" } as unknown as ViewStyle)
          : { shadowColor: "#000", shadowOpacity: 0.28, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }),
      })}
    >
      <Text style={{ fontSize: 12, opacity: isDark ? 1 : 0.4 }}>☾</Text>
      <View
        style={{
          width: 28,
          height: 14,
          borderRadius: 7,
          backgroundColor: theme.lcd,
          borderWidth: 1,
          borderColor: theme.hairlineStrong,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            position: "absolute",
            left: isDark ? 1 : 14,
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: isDark ? theme.alu : theme.today,
          }}
        />
      </View>
      <Text style={{ fontSize: 12, opacity: isDark ? 0.4 : 1 }}>☀</Text>
    </Pressable>
  );
}
