import { type ReactNode } from "react";
import { View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

export default function TabScreen({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas }}>{children}</View>
  );
}
