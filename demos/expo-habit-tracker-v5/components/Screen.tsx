/* Screen — the shared page chassis: pinned Nav, a scrolling body
   wrapped in the centred Page column, and the Footer. Every route
   renders its content inside <Screen>. */

import { type ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import Nav from "./Nav";
import Footer from "./Footer";
import { Page } from "./ui";

export default function Screen({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas }}>
      <Nav />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <Page>{children}</Page>
        <Footer />
      </ScrollView>
    </View>
  );
}
