/* MotionFeatureBento — the parallel curriculum (guideline §3.6, §4).
   The Expo analog of Cadence's CssFeatureBento: one Reanimated v3
   primitive per version, shown as expandable tiles. The current
   version's tile is `live`; future ones read `ships in vN`. Each tile
   reveals a description, a copy-pasteable snippet, and an instruction
   string so students get the prompt to apply it in their own project. */

import { type ComponentType, type ReactNode } from "react";
import { Text, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import ExpandableBento from "./ExpandableBento";
import ExpandableTile from "./ExpandableTile";
import { PressFade } from "./motion";
import { Body } from "./ui";

interface MotionFeature {
  v: number;
  name: string;
  primitive: string;
  description: string;
  snippet: string;
  instruction: string;
  /** an optional live mini-demo, rendered only on the version's live tile. */
  Demo?: ComponentType;
}

/* The v1 primitive, live: a real PressFade pill you can hold down to watch
   the opacity ease in and out. Reads back whether the OS reduced-motion
   setting is on, since that gate is wired into every Pulse animation. */
function PressFadeDemo() {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  return (
    <View style={{ gap: 8, alignItems: "flex-start" }}>
      <PressFade
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          backgroundColor: theme.panel,
          borderWidth: 1,
          borderColor: theme.hairlineStrong,
          borderRadius: 999,
          paddingVertical: 11,
          paddingHorizontal: 18,
        }}
      >
        <View
          style={{
            width: 9,
            height: 9,
            borderRadius: 5,
            backgroundColor: theme.done,
            shadowColor: theme.glow ? theme.done : "transparent",
            shadowOpacity: theme.glow ? 0.9 : 0,
            shadowRadius: theme.glow ? 6 : 0,
          }}
        />
        <Text style={{ fontFamily: FONTS.sansSemi, fontSize: 14, color: theme.print }}>
          Hold me — watch the fade
        </Text>
      </PressFade>
      <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: theme.aluDk }}>
        reduced-motion: {reduce ? "ON · snaps instantly" : "off · eases 120ms"}
      </Text>
    </View>
  );
}

const MOTION_FEATURES: MotionFeature[] = [
  {
    v: 0,
    name: "Static baseline",
    primitive: "StyleSheet only",
    description:
      "No animation yet — on purpose. v0 establishes the resting feel of the instrument so every later motion has a clear before/after. Channels, LEDs and switches are pure StyleSheet.",
    snippet: `const s = StyleSheet.create({
  channel: { backgroundColor: theme.panel,
    borderColor: theme.hairline, borderRadius: 12 },
});`,
    instruction:
      "Build the resting state first. Get the layout and tokens right with zero motion, then layer animation on a surface you already trust.",
  },
  {
    v: 1,
    name: "Touch feedback",
    primitive: "Pressable + useSharedValue opacity",
    description:
      "The baseline interactive feel: a tab or channel row dims as your finger lands, driven by a shared value rather than a state re-render. It's live now on every tab-bar button and channel row. The useReducedMotion() gate is wired in from this first beat — formally a v2 primitive, but every Pulse animation gets it — so reduced-motion users get an instant change, never a slower one.",
    snippet: `const o = useSharedValue(1);
const reduce = useReducedMotion();
const style = useAnimatedStyle(() => ({ opacity: o.value }));
const to = (v) => (o.value = withTiming(v, { duration: reduce ? 0 : 120 }));
<Pressable onPressIn={() => to(0.55)} onPressOut={() => to(1)} />`,
    instruction:
      "Wrap any Pressable's pressed feedback in a useSharedValue + useAnimatedStyle pair — it stays on the UI thread, so it never stutters under load. Branch the timing on useReducedMotion() so the reduced path is instant.",
    Demo: PressFadeDemo,
  },
  {
    v: 2,
    name: "Spring + a11y gate",
    primitive: "withSpring + useReducedMotion()",
    description:
      "Native spring easing on list inserts — and the accessibility gate, built in from the second motion beat. If the user prefers reduced motion, snap instead of spring.",
    snippet: `const reduce = useReducedMotion();
y.value = reduce ? 0 : withSpring(0, { damping: 14 });`,
    instruction:
      "Every animation gets a useReducedMotion() branch. Make the reduced path an instant state change, never a slower animation.",
  },
  {
    v: 3,
    name: "The Throw (hero)",
    primitive: "Gesture.Pan() → withSpring + Haptics",
    description:
      "The signature moment. Swiping a channel drags the toggle knob across its track; on release it springs home with an overshoot, the LED color-snaps amber→green, and a heavy haptic fires.",
    snippet: `const pan = Gesture.Pan()
  .onChange(e => { x.value = e.translationX; })
  .onEnd(() => {
    x.value = withSpring(0, { damping: 12, stiffness: 220 });
    runOnJS(Haptics.impactAsync)(Heavy);
  });`,
    instruction:
      "Feed a Gesture.Pan() into a shared value, release it into withSpring({ damping: 12, stiffness: 220 }), and fire Haptics on the threshold crossing for a mechanical snap.",
  },
  {
    v: 4,
    name: "Layout / shared element",
    primitive: "LayoutAnimation / sharedTransitionTag",
    description:
      "When persisted state restores on launch, the streak grid animates in; tapping a channel morphs the row into the detail screen via a shared element.",
    snippet: `<Animated.View sharedTransitionTag={\`ch-\${id}\`} />`,
    instruction:
      "Give the source and destination views the same sharedTransitionTag and Reanimated tweens between them across the navigation.",
  },
  {
    v: 5,
    name: "Entrance choreography",
    primitive: "withSequence",
    description:
      "The reminder-confirmed and daily streak-reveal arrivals: a multi-step entrance that overshoots, settles, then pulses once.",
    snippet: `scale.value = withSequence(
  withTiming(1.06, { duration: 160 }),
  withSpring(1, { damping: 10 }),
);`,
    instruction:
      "Compose multi-step arrivals with withSequence — chain a quick overshoot into a settling spring for content that feels alive on entry.",
  },
];

function Chip({ live }: { live: boolean }) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 5,
        backgroundColor: live ? "rgba(61,220,132,0.16)" : "transparent",
        borderWidth: live ? 0 : 1,
        borderColor: theme.hairline,
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 9,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: live ? theme.done : theme.aluDk,
        }}
      >
        {live ? "live" : "upcoming"}
      </Text>
    </View>
  );
}

export function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: "#0A0B0C",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#23262B",
        padding: 12,
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 11.5,
          lineHeight: 18,
          color: "#9BDCFF",
        }}
      >
        {children}
      </Text>
    </View>
  );
}

export default function MotionFeatureBento({ current }: { current: number }) {
  const { theme } = useTheme();
  return (
    <ExpandableBento>
      {MOTION_FEATURES.map((f) => {
        const live = f.v === current;
        return (
          <ExpandableTile
            key={f.v}
            summary={
              <View style={{ gap: 6 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.monoBold,
                      fontSize: 12,
                      color: live ? theme.today : theme.aluDk,
                    }}
                  >
                    v{f.v}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.sansSemi,
                      fontSize: 15,
                      color: theme.print,
                    }}
                  >
                    {f.name}
                  </Text>
                  <Chip live={live} />
                </View>
                <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: theme.streak }}>
                  {f.primitive}
                </Text>
              </View>
            }
          >
            <Body>{f.description}</Body>
            {live && f.Demo ? (
              <View
                style={{
                  backgroundColor: theme.lcd,
                  borderWidth: 1,
                  borderColor: theme.hairline,
                  borderRadius: 8,
                  padding: 14,
                }}
              >
                <f.Demo />
              </View>
            ) : null}
            <CodeBlock>{f.snippet}</CodeBlock>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                paddingTop: 4,
              }}
            >
              <Text style={{ color: theme.done, fontFamily: FONTS.sansBold, fontSize: 13 }}>
                ⌁
              </Text>
              <Body style={{ flex: 1, color: theme.textMuted, fontSize: 13 }}>
                {f.instruction}
              </Body>
            </View>
          </ExpandableTile>
        );
      })}
    </ExpandableBento>
  );
}
