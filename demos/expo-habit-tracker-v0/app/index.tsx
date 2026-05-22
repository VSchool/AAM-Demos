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
import { RouteMap, NewFilesList, ThemeTokensPreview } from "@/components/V0Demos";
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
      <Eyebrow>State v0 · scaffold</Eyebrow>
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
            This is <Text style={{ color: theme.print }}>state v0 of 6</Text>. The shell is up:
            an Expo + Expo Router project, the Pulse theme system with a dark default and a
            light “day mode”, the shared teaching chrome, and a static channel list. No real
            feature beyond routing yet — swipe-to-complete, storage and reminders land in v1
            through v5.
          </Lede>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <PrimaryButton label="Open the instrument →" href="/today" tone="streak" />
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
                Today — the instrument. Hit the ☀ / ☾ switch (bottom-right) to re-skin it.
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
            Persistence is session-only, on purpose. Refresh resets everything — there's no
            store, no AsyncStorage, no account or cloud sync. The UI patterns are the lesson;
            persistence is its own beat at <Code>v4</Code>. The channel list you see reads from{" "}
            <Code>lib/habits.ts</Code> and never changes. That's the honest state of v0.
          </Body>
        </Panel>
      </Section>

      {/* ---- 03 · BEHIND THE SCENES ---- */}
      <Section>
        <SectionTag>03 · Behind the scenes</SectionTag>
        <H2>Six versions, one concept each.</H2>
        <Body style={{ marginBottom: 16 }}>
          Each version is its own deployable app teaching exactly one Expo/RN concept. Past
          versions stay live so you can step back through the arc; the full story is on the{" "}
          About page.
        </Body>
        <Progression current={0} />
      </Section>

      {/* ---- 04 · INSIDE v0 ---- */}
      <Section>
        <SectionTag>04 · Inside v0</SectionTag>
        <H2>The files this version introduces.</H2>
        <ExpandableBento>
          <ExpandableTile
            summary={<TileSummary tag="routing" title="File structure = URL structure" />}
          >
            <Body>
              Drop a file into <Code>app/</Code> and it becomes a route — no router config,
              no path strings to keep in sync. v0 wires three.
            </Body>
            <RouteMap />
            <DemoNote title="Where the routes live" meta="app/index.tsx · today.tsx · about.tsx">
              <NoteText>
                Expo Router maps each file in <NoteCode>app/</NoteCode> to a URL. Tabs aren't
                here yet — they're the v1 lesson; v0 keeps plain stacked routes so the routing
                concept stands alone.
              </NoteText>
            </DemoNote>
          </ExpandableTile>

          <ExpandableTile
            summary={<TileSummary tag="theming" title="Two themes, one instrument" />}
          >
            <Body>
              The same four reserved roles in both faces — only the hex changes. Dark glows on
              black; light reads as a positive LCD on silver.
            </Body>
            <ThemeTokensPreview />
            <DemoNote title="Where the theme lives" meta="theme/tokens.ts · ThemeProvider.tsx">
              <NoteText>
                Both palettes live in <NoteCode>theme/tokens.ts</NoteCode> with the four reserved
                roles mapped per theme. The floating switch flips a Context value; every
                component reads tokens from <NoteCode>useTheme()</NoteCode>, so nothing hardcodes
                a color.
              </NoteText>
            </DemoNote>
          </ExpandableTile>

          <ExpandableTile
            summary={<TileSummary tag="chrome" title="The shared chrome suite" />}
          >
            <Body>
              Built once and shipped in every version: Nav, Footer, FeaturesStrip, Progression,
              the theme/palette toggle, the motion bento, expandable tiles, demo notes and the
              version mini-demos. They're curriculum tools, not a UI library.
            </Body>
            <NewFilesList />
            <DemoNote title="Where the chrome lives" meta="components/">
              Each chrome component is a teaching artifact that does double duty — it's part of
              the page and it explains the lesson. They carry forward unchanged across v0→v5.
            </DemoNote>
          </ExpandableTile>
        </ExpandableBento>
      </Section>

      {/* ---- 05 · MOTION TOUR ---- */}
      <Section>
        <SectionTag>05 · Motion tour · parallel curriculum</SectionTag>
        <H2>One Reanimated primitive per version.</H2>
        <Body style={{ marginBottom: 16 }}>
          Alongside each version's Expo concept, Pulse introduces exactly one motion primitive.
          v0's is the static baseline — get the resting feel right, then layer motion on top.
          The hero moment, “The Throw”, lands at v3.
        </Body>
        <MotionFeatureBento current={0} />
      </Section>
    </Screen>
  );
}
