/* TabScreen — the shell each (tabs) screen renders into. Centres the
   instrument in a phone-width column so the app surface reads like a
   device even on a wide web viewport, and fills the navigator scene so
   the instrument's flex layout (AppBar pinned, stage below) resolves. */

import { type ReactNode } from "react";
import { View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

export default function TabScreen({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas, alignItems: "center" }}>
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 560,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: theme.hairline,
        }}
      >
        {children}
      </View>
    </View>
  );
}
