/* TabScreen — the shell each (tabs) screen renders into. The app now runs
   inside the DeviceShell phone bezel, which already constrains width to a
   device, so this is just a canvas-filling container (the old centred
   560px web column + side hairlines are gone — the bezel is the frame). */

import { type ReactNode } from "react";
import { View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

export default function TabScreen({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return <View style={{ flex: 1, backgroundColor: theme.canvas }}>{children}</View>;
}
