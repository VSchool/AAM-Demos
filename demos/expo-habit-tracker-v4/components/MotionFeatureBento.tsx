/* MotionFeatureBento — the parallel curriculum (guideline §3.6, §4).
   The Expo analog of Cadence's CssFeatureBento: one Reanimated v3
   primitive per version, shown as expandable tiles. The current
   version's tile is `live`; future ones read `ships in vN`. Each tile
   reveals a description, a copy-pasteable snippet, and an instruction
   string so students get the prompt to apply it in their own project. */

import { useState, type ComponentType, type ReactNode } from "react";
import { Text, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { FONTS, type ReservedRole } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import ExpandableBento from "./ExpandableBento";
import ExpandableTile from "./ExpandableTile";
import { ChannelRow } from "./instrument";
import { PressFade, SpringIn, layoutReflow } from "./motion";
import ThrowRow from "./ThrowRow";
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

/* The v2 primitive, live: a button patches a sample channel into a tiny
   list; the new row springs in via withSpring. Each press remounts the
   row (keyed by a counter) so the spring replays. Reduced-motion places
   the row instantly. */
function SpringInDemo() {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  return (
    <View style={{ gap: 10, alignItems: "flex-start" }}>
      <PressFade
        onPress={() => setN((v) => v + 1)}
        accessibilityRole="button"
        accessibilityLabel="Patch in a sample channel"
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
        <Text style={{ color: theme.streak, fontFamily: FONTS.sansBold, fontSize: 15 }}>＋</Text>
        <Text style={{ fontFamily: FONTS.sansSemi, fontSize: 14, color: theme.print }}>
          {n === 0 ? "Patch in a sample channel" : "Patch in another"}
        </Text>
      </PressFade>
      {n > 0 ? (
        <SpringIn key={n} style={{ width: "100%" }}>
          <ChannelRow
            ledRole="today"
            name="Stretch"
            meta="CH 06 · ANYTIME"
            streak="00"
            on={false}
          />
        </SpringIn>
      ) : (
        <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: theme.aluDk }}>
          press to watch a channel spring in
        </Text>
      )}
      <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: theme.aluDk }}>
        reduced-motion: {reduce ? "ON · instant placement" : "off · springs in"}
      </Text>
    </View>
  );
}

/* The v3 primitive, live: a real ThrowRow. v4 makes the swipe bidirectional —
   swipe RIGHT (or tap) completes (LED amber→green, knob springs over, heavy
   haptic on a device); swipe LEFT parks it on a kind rest day (LED → slate,
   streak HELD). The mini state machine here mirrors the store's. */
function ThrowDemo() {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<ReservedRole>("today");
  const [streak, setStreak] = useState(4);

  const complete = () => {
    if (status !== "done") setStreak((s) => s + 1);
    setStatus("done");
  };
  const tap = () => {
    if (status === "done") {
      setStreak((s) => Math.max(0, s - 1));
      setStatus("today");
    } else complete();
  };
  const rest = () => {
    layoutReflow();
    if (status === "done") {
      setStreak((s) => Math.max(0, s - 1));
      setStatus("today");
    } else if (status === "today") {
      setStatus("rest"); // streak holds
    }
  };

  return (
    <View style={{ gap: 10 }}>
      <ThrowRow
        status={status}
        name="Read 10 pages"
        meta="CH 02 · NIGHTLY"
        streak={String(streak).padStart(2, "0")}
        onTap={tap}
        onSwipeRight={complete}
        onSwipeLeft={rest}
      />
      <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: theme.aluDk }}>
        swipe right / tap = done · swipe left = rest · reduced-motion: {reduce ? "ON" : "off"}
      </Text>
    </View>
  );
}

/* The v4 primitive, live: LayoutAnimation. A button parks/un-parks a sample
   channel; layoutReflow() runs right before the state flips, so the row TWEENS
   between its due and resting layouts (LED + readout) instead of snapping.
   Reduced-motion makes layoutReflow a no-op, so it changes instantly. */
function LayoutReflowDemo() {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const [resting, setResting] = useState(false);
  return (
    <View style={{ gap: 10, alignItems: "flex-start" }}>
      <PressFade
        onPress={() => {
          layoutReflow();
          setResting((r) => !r);
        }}
        accessibilityRole="button"
        accessibilityLabel={resting ? "Wake the channel" : "Park the channel on rest"}
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
        <Text style={{ fontFamily: FONTS.sansSemi, fontSize: 14, color: theme.print }}>
          {resting ? "Wake it up" : "Park on rest"}
        </Text>
      </PressFade>
      <View style={{ width: "100%" }}>
        <ChannelRow
          ledRole={resting ? "rest" : "today"}
          name="Long run"
          meta={resting ? "RESTING · STREAK HELD" : "CH 04 · MORNING"}
          streak="08"
          on={false}
          dim={resting}
        />
      </View>
      <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: theme.aluDk }}>
        watch the row reflow · reduced-motion: {reduce ? "ON · instant" : "off · tweens 220ms"}
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
    name: "Spring on insert",
    primitive: "withSpring + useReducedMotion()",
    description:
      "Native spring easing on a list insert — and the accessibility gate. When you patch in a channel the new row springs up + in with a small overshoot (SpringIn). If the user prefers reduced motion, it's placed instantly instead.",
    snippet: `const reduce = useReducedMotion();
const p = useSharedValue(reduce ? 1 : 0);
useEffect(() => {
  p.value = reduce ? 1 : withSpring(1, { damping: 14, stiffness: 180 });
}, []);
// translateY: (1 - p) * 14, opacity: p, scale: 0.97 + p * 0.03`,
    instruction:
      "Drive a 0→1 shared value with withSpring on mount and map it to translateY + opacity. Branch on useReducedMotion() so the reduced path lands at rest immediately, never a slower animation.",
    Demo: SpringInDemo,
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
    Demo: ThrowDemo,
  },
  {
    v: 4,
    name: "Layout reflow",
    primitive: "LayoutAnimation",
    description:
      "One web-safe call that tells RN to TWEEN the next layout change instead of jumping to it. Pulse fires it in two places: when persisted channels restore from AsyncStorage on launch (the list arrives), and the instant a channel is swiped to rest (the row reflows — LED → slate, readout to a calm grey). Gated by reduced-motion, where it becomes a no-op.",
    snippet: `import { LayoutAnimation } from "react-native";

// call right BEFORE the state change that alters layout
LayoutAnimation.configureNext({
  duration: 220,
  update: { type: LayoutAnimation.Types.easeInEaseOut },
  create: { type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity },
});
setStatus("rest"); // RN animates the difference`,
    instruction:
      "Call LayoutAnimation.configureNext() on the JS thread immediately before a setState that changes layout — RN animates from the old layout to the new one. Guard it on reduced-motion so it becomes an instant change.",
    Demo: LayoutReflowDemo,
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
