import { Text, useWindowDimensions, View } from "react-native";
import Screen from "@/components/Screen";
import {
  Body,
  Code,
  Eyebrow,
  GhostButton,
  H1,
  H2,
  Lede,
  Panel,
  PrimaryButton,
  Section,
  SectionTag,
} from "@/components/ui";
import { DeviceFrame } from "@/components/instrument";
import TodayInstrument from "@/components/TodayInstrument";
import FeaturesStrip from "@/components/FeaturesStrip";
import Progression from "@/components/Progression";
import ExpandableBento from "@/components/ExpandableBento";
import ExpandableTile from "@/components/ExpandableTile";
import MotionFeatureBento from "@/components/MotionFeatureBento";
import ExpoGoQR from "@/components/ExpoGoQR";
import DemoNote, { NoteCode, NoteText } from "@/components/DemoNote";
import FeatureCallout from "@/components/FeatureCallout";
import { ThrowAnatomy, NewFilesV3 } from "@/components/V3Demos";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";

function TileSummary({ tag, title }: { tag: string; title: string }) {
  const { theme } = useTheme();
  return (
    <View style={{ gap: 4 }}>
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 10,
          letterSpacing: 1.6,
          textTransform: "uppercase",
          color: theme.streak,
        }}
      >
        {tag}
      </Text>
      <Text style={{ fontFamily: FONTS.sansSemi, fontSize: 16, color: theme.print }}>
        {title}
      </Text>
    </View>
  );
}

export default function Home() {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const wide = width >= 900;

  return (
    <Screen>
      {/* ---- HERO ---- */}
      <Eyebrow>State v3 · the throw</Eyebrow>
      <View
        style={{
          flexDirection: wide ? "row" : "column",
          gap: wide ? 40 : 28,
          alignItems: wide ? "center" : "stretch",
        }}
      >
        <View style={{ flex: 1 }}>
          <H1>Pulse — a habit tracker built like a pocket instrument.</H1>
          <Lede>
            This is <Text style={{ color: theme.print }}>state v3 of 6</Text> — the hero moment.
            Completing a habit isn't a checkbox going grey: you{" "}
            <Text style={{ color: theme.print }}>throw the switch</Text>. A{" "}
            <Text style={{ color: theme.print }}>swipe gesture</Text> drives the knob across its
            track; on release it springs home with an overshoot, the LED color-snaps amber→green, and
            a heavy haptic fires. Storage and reminders still land in v4–v5.
          </Lede>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <PrimaryButton label="Open the app →" href="/today" tone="streak" />
            <GhostButton label="About this demo →" href="/about" />
          </View>
        </View>

        <View style={{ alignItems: "center" }}>
          <DeviceFrame
            caption={
              <Text
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  lineHeight: 16,
                  color: theme.aluDk,
                  textAlign: "center",
                  maxWidth: 286,
                }}
              >
                A static preview of the seed state. Open the app to throw a switch — swipe or tap a
                channel to complete it; hit ☀ / ☾ (bottom-right) to re-skin it.
              </Text>
            }
          >
            <TodayInstrument />
          </DeviceFrame>
        </View>
      </View>

      {/* ---- TRY ON A PHONE ---- */}
      <Section>
        <SectionTag>00 · Try it on a phone</SectionTag>
        <ExpoGoQR />
      </Section>

      {/* ---- 01 · WHAT YOU CAN DO HERE ---- */}
      <Section>
        <SectionTag>01 · What you can do here</SectionTag>
        <H2>The shape of the final app, at a glance.</H2>
        <FeaturesStrip />
      </Section>

      {/* ---- 02 · HONEST FINE PRINT ---- */}
      <Section>
        <SectionTag>02 · Honest fine print</SectionTag>
        <H2>What's deliberately not here yet.</H2>
        <Panel style={{ borderLeftWidth: 3, borderLeftColor: theme.streak }}>
          <Body style={{ fontSize: 15, lineHeight: 23, color: theme.textMuted }}>
            You can add channels and throw them complete now — but it all lives in an in-memory{" "}
            <Code>Context</Code> store. Refresh and everything resets to the seed roster in{" "}
            <Code>lib/habits.ts</Code>: there's no AsyncStorage, no account, no cloud sync. The
            haptic only fires on a real device (the web build runs the spring + LED snap silently).
            Making your throws survive a restart — plus kind rest-day logic — is the v4 beat. That's
            the honest state of v3.
          </Body>
        </Panel>
      </Section>

      {/* ---- 03 · BEHIND THE SCENES ---- */}
      <Section>
        <SectionTag>03 · Behind the scenes</SectionTag>
        <H2>Six versions, one concept each.</H2>
        <Body style={{ marginBottom: 16 }}>
          Each version is its own deployable app teaching exactly one Expo/RN concept. Past versions
          stay live so you can step back through the arc; the full story is on the About page.
        </Body>
        <Progression current={3} />
      </Section>

      {/* ---- 04 · INSIDE v3 ---- */}
      <Section>
        <SectionTag>04 · Inside v3</SectionTag>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <H2>The files this version introduces.</H2>
          <FeatureCallout
            title="Swipe to complete — gesture + spring + haptic"
            description="v3's new concept. Each habit row is swipeable: drag it and a knob slides across its track; release and it springs home while the LED snaps amber→green and a heavy haptic thunks. A tap is the accessible quick-complete path. Feel it on the Today screen or the live tile below."
            prompt={`In a React Native app built with Expo, using react-native-gesture-handler and react-native-reanimated, make each list row swipeable to mark it complete:

1. Wrap the row in a GestureDetector with a horizontal Gesture.Pan(). Set .activeOffsetX([-14, 14]) and .failOffsetY([-12, 12]) so a vertical scroll still passes through to the FlatList.
2. In .onChange, drive a useSharedValue from event.translationX and use it to slide a "knob" across a track (useAnimatedStyle).
3. In .onEnd, animate the knob home with withSpring({ damping: 12, stiffness: 220 }) for a mechanical overshoot. If the swipe crossed a threshold, commit "complete" via runOnJS.
4. On commit, snap the status color from amber (due) to green (done) and fire Haptics.impactAsync(Heavy) from expo-haptics — guard it with Platform.OS !== "web" so the web build no-ops instead of throwing.
5. Compose a Gesture.Tap() with the pan via Gesture.Exclusive(pan, tap) as an accessible quick-complete path.
6. Gate every animation behind useReducedMotion() so reduced-motion users get an instant state change, never a slower one.
7. Wrap your app root in <GestureHandlerRootView style={{ flex: 1 }}>.`}
          />
        </View>
        <ExpandableBento>
          <ExpandableTile
            summary={<TileSummary tag="gesture" title="Swipe to throw the switch" />}
          >
            <Body>
              The v3 lesson. A <Code>Gesture.Pan()</Code> on each row drives the toggle knob across
              its track as you drag — vertical scrolls still fall through to the FlatList. A{" "}
              <Code>Gesture.Tap()</Code> rides alongside it as the accessible path. The whole app is
              wrapped in a <Code>GestureHandlerRootView</Code> so touches reach the gesture.
            </Body>
            <ThrowAnatomy />
            <DemoNote
              title="Where the gesture lives"
              meta="components/ThrowRow.tsx · app/_layout.tsx"
            >
              <NoteText>
                <NoteCode>ThrowRow.tsx</NoteCode> wraps a channel in a{" "}
                <NoteCode>GestureDetector</NoteCode> and feeds the pan's translationX into a shared
                value. <NoteCode>activeOffsetX</NoteCode> + <NoteCode>failOffsetY</NoteCode> keep the
                vertical list scroll intact. The root wrapper is in{" "}
                <NoteCode>app/_layout.tsx</NoteCode>.
              </NoteText>
            </DemoNote>
          </ExpandableTile>

          <ExpandableTile
            summary={<TileSummary tag="motion" title="Spring · snap · thunk" />}
          >
            <Body>
              The hero motion beat. On release the knob springs home with{" "}
              <Code>withSpring</Code> (damping 12, stiffness 220) for a mechanical overshoot, the LED
              color-snaps amber→green, and <Code>Haptics.impactAsync(Heavy)</Code> fires. The{" "}
              <Code>useReducedMotion()</Code> gate turns the throw into an instant placement.
            </Body>
            <DemoNote title="Where the motion lives" meta="components/ThrowRow.tsx · lib/haptics.ts">
              <NoteText>
                The spring + <NoteCode>interpolateColor</NoteCode> track live in{" "}
                <NoteCode>ThrowRow.tsx</NoteCode>; the LED snaps via the committed status. The Heavy
                impact is in <NoteCode>lib/haptics.ts</NoteCode>, fired through{" "}
                <NoteCode>runOnJS</NoteCode> (no-op on web). Try it live in the Motion tour below.
              </NoteText>
            </DemoNote>
          </ExpandableTile>

          <ExpandableTile
            summary={<TileSummary tag="store" title="Committing the throw" />}
          >
            <Body>
              The throw commits to the store. <Code>toggleDone()</Code> flips the channel to done and
              ticks the streak up — or un-throws it and walks the streak back. A rest channel you
              throw counts as done; Pulse never punishes. Refresh still resets to the seed.
            </Body>
            <NewFilesV3 />
            <DemoNote title="Where the commit lives" meta="lib/habit-store.tsx › toggleDone">
              <NoteText>
                <NoteCode>toggleDone(id)</NoteCode> in <NoteCode>lib/habit-store.tsx</NoteCode> is
                the only mutation the throw makes — status + streak (+ best streak on a new high).
                Session-only; <NoteCode>AsyncStorage</NoteCode> is the v4 beat.
              </NoteText>
            </DemoNote>
          </ExpandableTile>
        </ExpandableBento>
      </Section>

      {/* ---- 05 · MOTION TOUR ---- */}
      <Section>
        <SectionTag>05 · Motion tour · parallel curriculum</SectionTag>
        <H2>One Reanimated primitive per version.</H2>
        <Body style={{ marginBottom: 16 }}>
          Alongside each version's Expo concept, Pulse introduces exactly one motion primitive. v3's
          is the hero — “The Throw”: the live tile below has a switch you can swipe or tap to feel
          the spring, the LED snap, and (on a phone) the haptic.
        </Body>
        <MotionFeatureBento current={3} />
      </Section>
    </Screen>
  );
}
