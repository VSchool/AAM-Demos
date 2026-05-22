/* MotionFeatureBento — the parallel curriculum (guideline §3.6, §4).
   The Expo analog of Cadence's CssFeatureBento: one Reanimated v3
   primitive per version, shown as expandable tiles. The current
   version's tile is `live`; future ones read `ships in vN`. Each tile
   reveals a description, a copy-pasteable snippet, and an instruction
   string so students get the prompt to apply it in their own project. */

import { type ReactNode } from "react";
import { Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import ExpandableBento from "./ExpandableBento";
import ExpandableTile from "./ExpandableTile";
import { Body } from "./ui";

interface MotionFeature {
  v: number;
  name: string;
  primitive: string;
  description: string;
  snippet: string;
  instruction: string;
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
      "The baseline interactive feel: a tab or row dims as your finger lands, driven by a shared value rather than a state re-render.",
    snippet: `const o = useSharedValue(1);
const style = useAnimatedStyle(() => ({ opacity: o.value }));
<Pressable onPressIn={() => (o.value = withTiming(0.6))}
           onPressOut={() => (o.value = withTiming(1))} />`,
    instruction:
      "Wrap any Pressable's pressed feedback in a useSharedValue + useAnimatedStyle pair — it stays on the UI thread, so it never stutters under load.",
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
