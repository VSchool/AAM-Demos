/* The mechanical "thunk" that fires when a switch is thrown (v3's hero
   moment). expo-haptics has no web backend, so it's a no-op there — the
   deployed web build still runs the spring + LED snap, just without the
   buzz. Called via runOnJS from the gesture worklet. */

import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

export function throwHaptic() {
  if (Platform.OS === "web") return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
}
