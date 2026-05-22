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
import { TabRouteMap, NewFilesV1 } from "@/components/V1Demos";
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
      <Eyebrow>State v1 · tabs</Eyebrow>
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
            This is <Text style={{ color: theme.print }}>state v1 of 6</Text>. The instrument now
            has three real tabs, wired by Expo Router:{" "}
            <Text style={{ color: theme.print }}>Today</Text>, the new{" "}
            <Text style={{ color: theme.print }}>Streaks</Text> meter-bridge, and{" "}
            <Text style={{ color: theme.print }}>Settings</Text> with the Coach-tone dial. Every tab
            and channel row carries the first Reanimated beat — a touch-feedback fade. The list +
            add-form, the swipe-to-complete “Throw”, storage and reminders still land in v2–v5.
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
                Today — one of three live tabs. Open the app to switch tabs; hit ☀ / ☾ (bottom-right)
                to re-skin it.
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
            Persistence is session-only, on purpose. Refresh resets everything — there's no store,
            no AsyncStorage, no account or cloud sync. The tabs are real navigation, but every screen
            still reads static sample channels from <Code>lib/habits.ts</Code>: the Coach-tone dial
            and theme switch flip in-session only, and nothing you tap is saved. Adding and persisting
            real habits are the v2 and v4 beats. That's the honest state of v1.
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
        <Progression current={1} />
      </Section>

      {/* ---- 04 · INSIDE v1 ---- */}
      <Section>
        <SectionTag>04 · Inside v1</SectionTag>
        <H2>The files this version introduces.</H2>
        <ExpandableBento>
          <ExpandableTile
            summary={<TileSummary tag="navigation" title="Three tabs, zero router config" />}
          >
            <Body>
              The v1 lesson. A <Code>_layout.tsx</Code> that exports <Code>{"<Tabs>"}</Code> inside a{" "}
              <Code>(tabs)</Code> group turns three sibling files into real tabs — and the
              parentheses keep the group out of the URL, so Today still lives at <Code>/today</Code>.
            </Body>
            <TabRouteMap />
            <DemoNote title="Where the tab layout lives" meta="app/(tabs)/_layout.tsx">
              <NoteText>
                <NoteCode>app/(tabs)/_layout.tsx</NoteCode> exports the <NoteCode>{"<Tabs>"}</NoteCode>{" "}
                navigator and registers today / streaks / settings. <NoteCode>/</NoteCode> (home) and{" "}
                <NoteCode>/about</NoteCode> stay outside the group — they're the teaching landing, not
                the app surface. The bottom bar is the real navigator, styled as the instrument's
                hardware tab strip in <NoteCode>InstrumentTabBar.tsx</NoteCode>.
              </NoteText>
            </DemoNote>
          </ExpandableTile>

          <ExpandableTile
            summary={<TileSummary tag="screens" title="Streaks & Settings, as instruments" />}
          >
            <Body>
              Two new screens fill out the tab group. <Code>Streaks</Code> is a meter-bridge — a
              total-uptime gauge over a rack of channel meters, each with a 7-day LED bar (rest days
              stay calm-grey, never a break). <Code>Settings</Code> carries the Coach-tone dial, the
              reminder clock, the day-mode switch, and the honest fine print as an etched label.
            </Body>
            <NewFilesV1 />
            <DemoNote
              title="Where the new screens live"
              meta="components/StreaksInstrument · SettingsInstrument · lib/habits.ts"
            >
              <NoteText>
                Both screens are pure reads off <NoteCode>lib/habits.ts</NoteCode> — the bars come
                from each channel's history via <NoteCode>lastDays()</NoteCode>, and the gauge from{" "}
                <NoteCode>uptimePct()</NoteCode>. The Coach dial is a tappable preview; it drives real
                notification copy at v5.
              </NoteText>
            </DemoNote>
          </ExpandableTile>

          <ExpandableTile
            summary={<TileSummary tag="motion" title="The first Reanimated beat" />}
          >
            <Body>
              Touch feedback: tabs and channel rows dim under your finger via a{" "}
              <Code>useSharedValue</Code> opacity, eased with <Code>withTiming</Code> on the UI
              thread. The <Code>useReducedMotion()</Code> gate is wired in from this first beat, so
              reduced-motion users get an instant change.
            </Body>
            <DemoNote title="Where the motion lives" meta="components/motion.tsx · InstrumentTabBar.tsx">
              <NoteText>
                <NoteCode>PressFade</NoteCode> in <NoteCode>components/motion.tsx</NoteCode> wraps a{" "}
                <NoteCode>Pressable</NoteCode> with a shared-value opacity and the a11y gate. It's
                reused by the tab bar, the channel rows, and the meter rows. Try it live in the Motion
                tour below.
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
          Alongside each version's Expo concept, Pulse introduces exactly one motion primitive. v1's
          is touch feedback — the live tile below has a pill you can hold down to feel the fade. The
          hero moment, “The Throw”, lands at v3.
        </Body>
        <MotionFeatureBento current={1} />
      </Section>
    </Screen>
  );
}
