/* ThrowRow — v3's hero "Throw", v4 BIDIRECTIONAL, now v5: the TAP
   path opens the per-habit detail screen instead of toggling done.
   Swipes are unchanged.
     • swipe RIGHT → complete (today/rest→done, +1; done stays done)
     • swipe LEFT  → park on rest (today→rest, streak HOLDS) or un-throw
                     a completion (done→today, −1)
     • TAP         → push '/habit/{id}' (v5 — was toggle done in v4)

   The reason for the swap: tapping a row in a list-of-things is the
   universal "open detail" affordance on iOS/Android. Throwing the
   switch by gesture stays the deliberate, satisfying commit. The
   v3 a11y "activate" action label is renamed "Open detail" to match.
   The heavy haptic still fires only when a swipe newly completes —
   the tap is a navigation, not a commitment. */

import { Text, View } from "react-native";
import { router } from "expo-router";
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

// Module-scope so the Reanimated worklet can call it via runOnJS.
function openDetail(id: string) {
  router.push(`/habit/${id}`);
}

const TRACK_W = 46;
const TRACK_H = 26;
const KNOB = TRACK_H - 6;
const KNOB_TRAVEL = TRACK_W - KNOB - 4; // left:2 → right:2
const FINGER_TRAVEL = 90; // px of swipe for a full throw
const COMMIT_PX = FINGER_TRAVEL * 0.5; // how far you must drag to commit
const SPRING = { damping: 12, stiffness: 220 }; // the mechanical snap

export default function ThrowRow({
  id,
  status,
  name,
  meta,
  streak,
  onSwipeRight,
  onSwipeLeft,
  onTap,
}: {
  /** v5: the habit id. Used to build the detail-route URL on tap. */
  id: string;
  status: ReservedRole;
  name: string;
  meta: string;
  streak: string;
  /** swipe right: complete (idempotent toward done). */
  onSwipeRight: () => void;
  /** swipe left: park on rest / un-throw a completion. */
  onSwipeLeft: () => void;
  /** Optional tap override. When absent (the production /today case) tap
      pushes the detail route — the v5 default. The motion-tour demo passes
      its own toggle handler so it can run in isolation without navigating. */
  onTap?: () => void;
}) {
  const { theme } = useTheme();
  const done = status === "done";
  const dim = status === "rest";
  const reduce = useReducedMotion();

  // 0 = off, 1 = thrown (done). Seeded from the committed state; the gesture
  // owns it while dragging, then springs to the resulting done-ness.
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
      // right drag pushes the knob toward 1, left drag toward 0 (a left drag
      // from a not-done row clamps at 0 — the LED reflow is the feedback there).
      const next = startP.value + e.translationX / FINGER_TRAVEL;
      p.value = next < 0 ? 0 : next > 1 ? 1 : next;
    })
    .onEnd((e) => {
      if (e.translationX > COMMIT_PX) {
        // RIGHT → complete. Result is always done, so the knob springs on.
        p.value = reduce ? 1 : withSpring(1, SPRING);
        if (!done) runOnJS(throwHaptic)(); // only a NEW completion thunks
        runOnJS(onSwipeRight)();
      } else if (e.translationX < -COMMIT_PX) {
        // LEFT → rest / un-throw. Result is never done, so the knob springs off.
        p.value = reduce ? 0 : withSpring(0, SPRING);
        runOnJS(onSwipeLeft)();
      } else {
        // short drag — settle back to the committed state, no change.
        p.value = reduce ? (done ? 1 : 0) : withSpring(done ? 1 : 0, SPRING);
      }
    });

  // v5: tap now opens the detail screen — the universal list affordance.
  // Throwing the switch by swipe stays the deliberate, satisfying commit.
  // An onTap override is honored for in-page demos (motion tour) that can't
  // navigate away.
  const tap = Gesture.Tap()
    .maxDuration(260)
    .onEnd(() => {
      if (onTap) runOnJS(onTap)();
      else runOnJS(openDetail)(id);
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
        accessibilityRole="button"
        accessibilityState={{ checked: done }}
        accessibilityLabel={`${name} — ${done ? "done" : dim ? "resting" : "due today"}`}
        accessibilityHint="Tap to open detail; swipe right to complete; swipe left to rest"
        accessibilityActions={[
          { name: "activate", label: "Open detail" },
          { name: "complete", label: "Mark done" },
          { name: "rest", label: "Mark rest" },
        ]}
        onAccessibilityAction={(e) => {
          if (e.nativeEvent.actionName === "rest") onSwipeLeft();
          else if (e.nativeEvent.actionName === "complete") onSwipeRight();
          else if (onTap) onTap();
          else openDetail(id);
        }}
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
            {dim ? "RESTING · STREAK HELD" : meta}
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
