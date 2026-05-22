/* ============================================================
   Pulse — motion primitives (the parallel Reanimated curriculum).
   v1's beat: touch-feedback baseline. A Pressable whose opacity is
   driven by a useSharedValue + useAnimatedStyle pair (UI-thread, no
   state re-render), eased with withTiming.

   The accessibility gate lands here too: useReducedMotion() is wired
   in from the FIRST motion beat (formally a v2 primitive — but every
   animation in Pulse gets it). When the user prefers reduced motion
   the opacity snaps instead of fading.
   ============================================================ */

import { type ReactNode } from "react";
import { Pressable, type PressableProps, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * PressFade — the v1 touch-feedback primitive. Dims to `dimTo` while
 * pressed, springs back to 1 on release. Reduced-motion users get an
 * instant change (duration 0), never a slower animation.
 */
export function PressFade({
  children,
  style,
  dimTo = 0.55,
  duration = 120,
  ...rest
}: PressableProps & {
  children: ReactNode;
  style?: ViewStyle;
  dimTo?: number;
  duration?: number;
}) {
  const opacity = useSharedValue(1);
  const reduce = useReducedMotion();

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  // Called from JS-thread press handlers; assigning a withTiming() to a
  // shared value from JS is supported and drives the animation on the UI thread.
  const to = (v: number) => {
    opacity.value = withTiming(v, { duration: reduce ? 0 : duration });
  };

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        to(dimTo);
        rest.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        to(1);
        rest.onPressOut?.(e);
      }}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
