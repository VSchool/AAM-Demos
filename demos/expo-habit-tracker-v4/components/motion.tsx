/* ============================================================
   Pulse — motion primitives (the parallel Reanimated curriculum).
   v1's beat: touch-feedback baseline (PressFade). A Pressable whose
   opacity is driven by a useSharedValue + useAnimatedStyle pair
   (UI-thread, no state re-render), eased with withTiming.

   v2's beat: native spring easing on a list insert (SpringIn). When
   you patch in a channel the new row settles into place with
   withSpring, the physical, mechanical feel a switch deserves.

   v4's beat: LayoutAnimation (layoutReflow). A single, web-safe call
   that tells RN to TWEEN the next layout change instead of jumping to
   it. We fire it right before the store mutates so two moments animate:
   the restored channels arriving when persisted state hydrates at
   launch, and a row REFLOWING the instant it's swiped to rest (LED→slate,
   switch→neutral, the streak readout swapping to a calm grey).

   The accessibility gate lives here too: useReducedMotion() is wired
   into every Pulse animation. When the user prefers reduced motion the
   opacity snaps, the spring becomes an instant placement, and
   layoutReflow becomes a no-op — never a slower animation.
   ============================================================ */

import { useEffect, type ReactNode } from "react";
import {
  AccessibilityInfo,
  LayoutAnimation,
  Platform,
  Pressable,
  UIManager,
  type PressableProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

/* LayoutAnimation needs an opt-in on old-architecture Android; harmless
   elsewhere. iOS + RN-web enable it by default. */
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* The reduced-motion gate for layoutReflow(). It's called from the store
   (not a component), so it can't use the useReducedMotion() hook — instead
   we cache the OS setting at module scope and keep it current via a
   subscription. On web this reads the prefers-reduced-motion media query. */
let reduceMotion = false;
AccessibilityInfo.isReduceMotionEnabled?.()
  .then((v) => {
    reduceMotion = v;
  })
  .catch(() => {});
AccessibilityInfo.addEventListener?.("reduceMotionChanged", (v) => {
  reduceMotion = v;
});

/* A short, gentle ease applied to the NEXT layout pass — covers rows being
   created (hydration restore), updated (a reflow), and removed. */
const REFLOW = {
  duration: 220,
  create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
  update: { type: LayoutAnimation.Types.easeInEaseOut },
  delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
} as const;

/**
 * layoutReflow — the v4 motion primitive. Call it on the JS thread
 * immediately BEFORE a state change that alters layout; RN then animates
 * the difference rather than snapping. Used by the store on hydration
 * (channels arrive) and on swipe-to-rest (the row reflows). A no-op for
 * reduced-motion users.
 */
export function layoutReflow() {
  if (reduceMotion) return;
  LayoutAnimation.configureNext(REFLOW);
}

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

/**
 * SpringIn — the v2 motion primitive. On mount, the wrapped view settles
 * into place: it springs up from a small offset and fades in, using
 * withSpring for native, slightly-overshooting easing — the mechanical
 * feel of a channel dropping into the rack. Used on newly patched-in rows.
 *
 * `animate={false}` mounts at rest with no motion — that's how the seed
 * channels appear (they were always there; only NEW rows should spring).
 * Reduced-motion users always get the instant, at-rest placement.
 */
export function SpringIn({
  children,
  style,
  animate = true,
}: {
  children: ReactNode;
  style?: ViewStyle;
  animate?: boolean;
}) {
  const reduce = useReducedMotion();
  // Start at rest (1) when we shouldn't animate, otherwise from the pre-entry
  // state (0) and spring to 1.
  const progress = useSharedValue(animate && !reduce ? 0 : 1);

  useEffect(() => {
    if (animate && !reduce) {
      progress.value = withSpring(1, { damping: 14, stiffness: 180 });
    } else {
      progress.value = 1;
    }
    // run once on mount — the row's identity is fixed by its FlatList key
  }, [animate, reduce, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: (1 - progress.value) * 14 },
      { scale: 0.97 + progress.value * 0.03 },
    ],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
