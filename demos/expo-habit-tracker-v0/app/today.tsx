/* /today — v0's single screen: the static channel list rendered as the
   machined instrument, inside the phone. No interaction yet (throwing the
   switch is the v3 lesson) and no navigation yet (real tabs are v1). A
   footer row reaches the in-app About (build info + day-mode), since v0
   has no Settings tab. */

import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import TodayInstrument from "@/components/TodayInstrument";

/* The in-app entry to the build info (and v0's day-mode toggle, since there's
   no Settings tab yet). Always reachable so device + browser stay identical. */
function MoreAboutRow() {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={() => router.push("/about")}
      accessibilityRole="button"
      accessibilityLabel="More about this version"
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
        paddingVertical: 12,
        paddingHorizontal: 13,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.hairline,
        backgroundColor: theme.canvasRaised,
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 10.5,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          color: theme.aluDk,
        }}
      >
        ⓘ  More about this version
      </Text>
      <Text style={{ fontFamily: FONTS.mono, fontSize: 13, color: theme.aluDk }}>›</Text>
    </Pressable>
  );
}

export default function Today() {
  return (
    <View style={{ flex: 1 }}>
      <TodayInstrument tabBar={false} footer={<MoreAboutRow />} />
    </View>
  );
}
