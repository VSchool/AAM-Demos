/* InstrumentTabBar — the real Expo Router tab bar, dressed as the
   instrument's hardware tab strip (the v0 fake `TabBar` is now driven
   by actual navigation). Passed to <Tabs tabBar={…}> in the (tabs)
   layout. Each tab is a PressFade Pressable, so the v1 touch-feedback
   primitive rides the real navigator: the label dims under your finger
   via a useSharedValue opacity, then springs back.

   Typed against a minimal local shape rather than expo-router's internal
   build paths, so it stays robust across SDK bumps. */

import { Platform, Text, View, type ViewStyle } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { PressFade } from "./motion";

interface TabBarProps {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (e: {
      type: "tabPress";
      target: string;
      canPreventDefault: true;
    }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
  descriptors: Record<string, { options: { title?: string } }>;
  insets?: { bottom?: number };
}

const TITLES: Record<string, string> = {
  today: "Today",
  streaks: "Streaks",
  settings: "Settings",
};

export default function InstrumentTabBar({
  state,
  navigation,
  descriptors,
  insets,
}: TabBarProps) {
  const { theme } = useTheme();
  const bottomPad = (insets?.bottom ?? 0) > 0 ? insets!.bottom! : 14;

  return (
    <View
      style={{
        backgroundColor: theme.name === "dark" ? "#0A0B0C" : "#EBECE6",
        borderTopWidth: 1,
        borderTopColor: theme.hairline,
        paddingTop: 8,
        paddingBottom: bottomPad,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          maxWidth: 560,
          alignSelf: "center",
          paddingHorizontal: 10,
        }}
      >
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const label =
            descriptors[route.key]?.options.title ?? TITLES[route.name] ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          const activeBg: ViewStyle = focused
            ? {
                backgroundColor: theme.name === "dark" ? "#1C1F23" : "#FFFFFF",
                borderWidth: 1,
                borderColor: theme.hairlineStrong,
                ...(theme.glow
                  ? ({ boxShadow: "0 0 10px rgba(255,178,0,0.15)" } as unknown as ViewStyle)
                  : Platform.OS === "web"
                    ? ({ boxShadow: "0 1px 2px rgba(0,0,0,0.06)" } as unknown as ViewStyle)
                    : {}),
              }
            : {};

          return (
            <PressFade
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 9,
                marginHorizontal: 3,
                borderRadius: 7,
                ...activeBg,
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 10,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  color: focused ? theme.today : theme.aluDk,
                }}
              >
                {label}
              </Text>
            </PressFade>
          );
        })}
      </View>
    </View>
  );
}
