/* ThrowRow — the v3 hero moment: "The Throw". A channel row you complete
   by SWIPING the switch across its track (or tapping it). The teaching
   beat is react-native-gesture-handler's Gesture.Pan(); the motion is
   withSpring on release with an overshoot, the LED color-snaps amber→green
   when the throw commits, and a heavy haptic fires — gated by
   useReducedMotion(), which makes the throw an instant placement.

   Used by the live Today tab. The static ChannelRow in instrument.tsx is
   unchanged and still draws the home-page preview + version mini-demos. */

import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { FONTS, type ReservedRole } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { throwHaptic } from "@/lib/haptics";
import { Led, Segment } from "./instrument";

const TRACK_W = 46;
const TRACK_H = 26;
const KNOB = TRACK_H - 6;
const KNOB_TRAVEL = TRACK_W - KNOB - 4; // left:2 → right:2
const FINGER_TRAVEL = 90; // px of swipe for a full throw
const SPRING = { damping: 12, stiffness: 220 }; // the mechanical snap

export default function ThrowRow({
  status,
  name,
  meta,
  streak,
  onToggle,
}: {
  status: ReservedRole;
  name: string;
  meta: string;
  streak: string;
  onToggle: () => void;
}) {
  const { theme } = useTheme();
  const done = status === "done";
  const dim = status === "rest";
  const reduce = useReducedMotion();

  // 0 = off, 1 = thrown. Seeded from the committed state; the gesture owns it.
  const p = useSharedValue(done ? 1 : 0);
  const startP = useSharedValue(0);

  const trackOn = theme.name === "dark" ? "#0F2417" : "#D2F0DF";
  const trackOff = theme.name === "dark" ? "#0A0B0C" : "#D9DAD2";
  const knobOff = theme.name === "dark" ? "#C8CDD3" : "#FFFFFF";

  const pan = Gesture.Pan()
    // only a horizontal drag activates — vertical movement falls through to
    // the FlatList so the list still scrolls.
    .activeOffsetX([-14, 14])
    .failOffsetY([-12, 12])
    .onBegin(() => {
      startP.value = p.value;
    })
    .onChange((e) => {
      const next = startP.value + e.translationX / FINGER_TRAVEL;
      p.value = next < 0 ? 0 : next > 1 ? 1 : next;
    })
    .onEnd(() => {
      const target = p.value > 0.5 ? 1 : 0;
      p.value = reduce ? target : withSpring(target, SPRING);
      const was = done ? 1 : 0;
      if (target !== was) {
        if (target === 1) runOnJS(throwHaptic)();
        runOnJS(onToggle)();
      }
    });

  // tap-to-throw — the accessible path, and a quick alternative to swiping.
  const tap = Gesture.Tap()
    .maxDuration(260)
    .onEnd(() => {
      const target = done ? 0 : 1;
      p.value = reduce ? target : withSpring(target, SPRING);
      if (target === 1) runOnJS(throwHaptic)();
      runOnJS(onToggle)();
    });

  const gesture = Gesture.Exclusive(pan, tap);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [trackOff, trackOn]),
    borderColor: interpolateColor(p.value, [0, 1], [theme.hairlineStrong, theme.done]),
  }));
  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: p.value * KNOB_TRAVEL }],
    backgroundColor: interpolateColor(p.value, [0, 1], [knobOff, theme.done]),
  }));

  return (
    <GestureDetector gesture={gesture}>
      <View
        accessibilityRole="switch"
        accessibilityState={{ checked: done }}
        accessibilityLabel={`${name} — ${done ? "done" : "not done"}`}
        accessibilityHint="Swipe or tap to throw the switch and complete"
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 11,
          backgroundColor: theme.panel,
          borderWidth: 1,
          borderColor: theme.hairline,
          borderRadius: 12,
          paddingVertical: 11,
          paddingHorizontal: 12,
        }}
      >
        <Led role={dim ? "rest" : status} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              fontFamily: FONTS.sansSemi,
              fontSize: 14,
              letterSpacing: -0.1,
              color: theme.print,
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              letterSpacing: 0.4,
              color: theme.aluDk,
              marginTop: 1,
            }}
          >
            {meta}
          </Text>
        </View>
        {dim ? (
          <Text style={{ fontFamily: FONTS.monoBold, fontSize: 13, color: theme.rest }}>
            {streak}
          </Text>
        ) : (
          <Segment value={streak} />
        )}
        {/* the animated hardware switch — the knob is what you throw */}
        <Animated.View
          style={[
            {
              width: TRACK_W,
              height: TRACK_H,
              borderRadius: TRACK_H / 2,
              borderWidth: 1,
              justifyContent: "center",
            },
            trackStyle,
          ]}
        >
          <Animated.View
            style={[
              {
                position: "absolute",
                left: 2,
                width: KNOB,
                height: KNOB,
                borderRadius: KNOB / 2,
              },
              knobStyle,
            ]}
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
