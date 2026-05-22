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
import { AddFlowMap, NewFilesV2 } from "@/components/V2Demos";
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
      <Eyebrow>State v2 · list + form</Eyebrow>
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
            This is <Text style={{ color: theme.print }}>state v2 of 6</Text>. The Today tab is now a{" "}
            <Text style={{ color: theme.print }}>FlatList</Text>, and you can{" "}
            <Text style={{ color: theme.print }}>patch in a channel</Text> — an inline form (a{" "}
            <Text style={{ color: theme.print }}>TextInput</Text> for the label, hardware toggles for
            cadence + window) pinned at the top of the list. New channels read + write an in-memory
            store and spring into place with native easing. The swipe-to-complete “Throw”, storage
            and reminders still land in v3–v5.
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
                A static preview of the seed state. Open the app to patch in a channel and watch it
                spring in; hit ☀ / ☾ (bottom-right) to re-skin it.
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
            You can add channels now — but they live in an in-memory <Code>Context</Code> store, not
            on disk. Refresh and everything resets to the seed roster in <Code>lib/habits.ts</Code>:
            there's no AsyncStorage, no account, no cloud sync. The Coach-tone dial and theme switch
            still flip in-session only, and channels are completed by tapping (the satisfying
            swipe-to-complete “Throw” is v3). Real persistence is the v4 beat. That's the honest
            state of v2.
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
        <Progression current={2} />
      </Section>

      {/* ---- 04 · INSIDE v2 ---- */}
      <Section>
        <SectionTag>04 · Inside v2</SectionTag>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <H2>The files this version introduces.</H2>
          <FeatureCallout
            title="Data-driven Today — FlatList + inline add form"
            description="v2's new concept. The Today screen becomes a real list backed by a Context store, with an add-channel form pinned at the top. FlatList virtualises rows; a TextInput captures the new habit name; KeyboardAvoidingView lifts the form above the on-screen keyboard. Refresh still resets — persistence lands in v4."
            prompt={`In a React Native (Expo) app, build a data-driven list screen with an inline add form:

1. Lift state into a Context store: createContext + a Provider that holds an array of items and exposes addItem / toggleItem. Wrap your app root in the Provider.
2. Render a FlatList:
   - data={items}, keyExtractor={(it) => it.id}
   - renderItem returns a styled row (FlatList virtualises — don't ScrollView a list of rows)
   - keyboardShouldPersistTaps="handled" so taps on rows still register while the keyboard is open
   - ListHeaderComponent={<AddForm />} pins the form ABOVE the list (the FlatList scrolls; the form sits at the top of the scroll content)
3. In AddForm, use a controlled TextInput (value + onChangeText) plus any select-like fields (cadence, window) as segmented controls. On submit, call addItem() from context and reset the local form state.
4. Wrap the screen in <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}> so the form lifts above the keyboard on iOS.
5. Animate newly-added rows with a Reanimated useSharedValue → withSpring (translateY + opacity 0→1 on mount), gated by useReducedMotion(). Identify "new" rows by capturing the initial id set in a ref; rows already present mount at rest.`}
          />
        </View>
        <ExpandableBento>
          <ExpandableTile
            summary={<TileSummary tag="list" title="Today is a FlatList now" />}
          >
            <Body>
              The v2 lesson, part one. The Today tab swaps its static column for a{" "}
              <Code>FlatList</Code> over the live store — the AppBar stays pinned, the list is
              flex:1 below it and scrolls itself. Each row is a channel; a freshly added one springs
              in. The home preview above stays static on purpose.
            </Body>
            <NewFilesV2 />
            <DemoNote title="Where the list lives" meta="components/TodayList.tsx">
              <NoteText>
                <NoteCode>TodayList.tsx</NoteCode> renders a <NoteCode>FlatList</NoteCode> whose data
                is the store's habits and whose <NoteCode>ListHeaderComponent</NoteCode> is the
                add-form. It is NOT wrapped in a ScrollView — the list owns the scroll, bounded by
                the tab screen's flex.
              </NoteText>
            </DemoNote>
          </ExpandableTile>

          <ExpandableTile
            summary={<TileSummary tag="form + store" title="Patch in a channel" />}
          >
            <Body>
              The v2 lesson, part two. An inline expanding panel — a <Code>TextInput</Code> for the
              label, hardware toggles for cadence + window, an optional why — calls{" "}
              <Code>addHabit()</Code> on the in-memory store. The new channel takes the next CH
              number and lands in the “today” state. Refresh resets to the seed.
            </Body>
            <AddFlowMap />
            <DemoNote
              title="Where the store + form live"
              meta="lib/habit-store.tsx · components/AddChannelPanel.tsx"
            >
              <NoteText>
                <NoteCode>lib/habit-store.tsx</NoteCode> is a Context store seeded from{" "}
                <NoteCode>lib/habits.ts</NoteCode>; <NoteCode>AddChannelPanel.tsx</NoteCode> is the
                pinned form. Session-only, on purpose — <NoteCode>AsyncStorage</NoteCode> is the v4
                beat. The themed <NoteCode>TextField</NoteCode> sets explicit text + placeholder
                colors so it reads on the silver and black faces.
              </NoteText>
            </DemoNote>
          </ExpandableTile>

          <ExpandableTile
            summary={<TileSummary tag="motion" title="The spring on insert" />}
          >
            <Body>
              The second Reanimated beat. A newly patched-in row settles into the list with{" "}
              <Code>withSpring</Code> — a small overshoot, the mechanical feel of a channel dropping
              into the rack. The <Code>useReducedMotion()</Code> gate makes that an instant placement
              for anyone who prefers reduced motion.
            </Body>
            <DemoNote title="Where the motion lives" meta="components/motion.tsx › SpringIn">
              <NoteText>
                <NoteCode>SpringIn</NoteCode> in <NoteCode>components/motion.tsx</NoteCode> springs a
                row up + in on mount via <NoteCode>withSpring</NoteCode>. Seed rows mount at rest;
                only added rows animate. Try it live in the Motion tour below.
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
          Alongside each version's Expo concept, Pulse introduces exactly one motion primitive. v2's
          is the spring on insert — the live tile below has a button that patches a sample row in so
          you can watch it settle. The hero moment, “The Throw”, lands at v3.
        </Body>
        <MotionFeatureBento current={2} />
      </Section>
    </Screen>
  );
}
