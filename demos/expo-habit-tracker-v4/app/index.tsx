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
import { PersistFlow, RestStateMachine, NewFilesV4 } from "@/components/V4Demos";
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
      <Eyebrow>State v4 · persist</Eyebrow>
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
            This is <Text style={{ color: theme.print }}>state v4 of 6</Text> — it{" "}
            <Text style={{ color: theme.print }}>remembers</Text>. Your channels now persist with{" "}
            <Text style={{ color: theme.print }}>AsyncStorage</Text>, so a refresh no longer wipes
            them. The throw is bidirectional too: swipe right to complete, swipe left to park a
            channel on a <Text style={{ color: theme.print }}>kind rest day</Text> — a planned pause
            that holds the streak instead of shattering it. Reminders land in v5.
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
                A static preview of the seed state. Open the app to throw a switch — swipe right or
                tap to complete, swipe left to rest — then refresh to watch it persist. ☀ / ☾
                (bottom-right) re-skins it.
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
        <H2>What changed, and what's still not here.</H2>
        <Panel style={{ borderLeftWidth: 3, borderLeftColor: theme.done }}>
          <Body style={{ fontSize: 15, lineHeight: 23, color: theme.textMuted }}>
            As of v4 the honest fine print FLIPS: your channels now <Code>persist</Code>. They live
            in <Code>AsyncStorage</Code> — which is <Code>localStorage</Code> in this web build — so
            refreshing the page keeps your throws, your rest days, and any channels you patched in.
            What's still deliberately absent: there's no account and no cloud sync, so it only lives
            on this one device/browser, and the heavy haptic only fires on a real phone. Need a
            clean slate? <Code>Reset to seed</Code> lives in Settings. Daily reminders are the v5
            beat.
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
        <Progression current={4} />
      </Section>

      {/* ---- 04 · INSIDE v4 ---- */}
      <Section>
        <SectionTag>04 · Inside v4</SectionTag>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <H2>The files this version introduces.</H2>
          <FeatureCallout
            title="Persist across restarts — AsyncStorage with a hydrate gate"
            description="v4's new concept. The Context store now hydrates from AsyncStorage on mount and persists on every mutation, so throws and added channels survive a refresh. A ready flag holds the splash until disk reads back — the empty initial state never overwrites real data. Web maps to localStorage; native uses device storage."
            prompt={`In a React Native (Expo) app, persist your Context store with @react-native-async-storage/async-storage:

1. Install: npx expo install @react-native-async-storage/async-storage
2. In your store, keep useState for items (start empty), a ready flag (default false), and a hydrated ref (default false).
3. On mount, run an effect: AsyncStorage.getItem("yourapp.items.v1") → JSON.parse; if present, setItems(parsed); else fall back to your seed. Then set hydrated.current = true and setReady(true).
4. Add a SECOND effect that runs on every items change: if (!hydrated.current) return; AsyncStorage.setItem("yourapp.items.v1", JSON.stringify(items)). The ready gate prevents the empty initial state from clobbering persisted data.
5. Expose a resetToSeed() action that does setItems(seed) + AsyncStorage.removeItem(...) — wire it to a Settings affordance so the demo stays resettable.
6. Hold your splash screen / show a loading state until ready is true (e.g. extend SplashScreen.hideAsync() to wait for fonts AND store hydration).
7. Bump the storage key when your schema changes (yourapp.items.v2, v3) so old shapes don't deserialise into new ones.`}
          />
        </View>
        <ExpandableBento>
          <ExpandableTile
            summary={<TileSummary tag="storage" title="Habits survive a restart" />}
          >
            <Body>
              The v4 lesson. The store hydrates from <Code>AsyncStorage</Code> on launch and writes
              back on every mutation. The splash holds until that first read resolves, so you never
              see the seed flash before your real data loads. On web it's <Code>localStorage</Code>
              — refresh and it's all still there.
            </Body>
            <PersistFlow />
            <DemoNote
              title="Where persistence lives"
              meta="lib/habit-store.tsx · app/_layout.tsx"
            >
              <NoteText>
                <NoteCode>habit-store.tsx</NoteCode> hydrates in a mount effect and persists in an
                effect keyed on the roster; <NoteCode>resetToSeed()</NoteCode> wipes the key.{" "}
                <NoteCode>app/_layout.tsx</NoteCode> gates the splash on the store's{" "}
                <NoteCode>ready</NoteCode> flag.
              </NoteText>
            </DemoNote>
          </ExpandableTile>

          <ExpandableTile
            summary={<TileSummary tag="rest" title="Kind rest days, by gesture" />}
          >
            <Body>
              The signature feature. The throw is now bidirectional: swipe LEFT parks a channel on a
              rest day. A rest is a first-class, non-punishing state — it <Code>pauses</Code> the
              streak rather than resetting it. Most trackers shatter your run on a miss; Pulse holds
              it.
            </Body>
            <RestStateMachine />
            <DemoNote title="Where rest lives" meta="lib/habit-store.tsx › markRest · ThrowRow.tsx">
              <NoteText>
                <NoteCode>ThrowRow.tsx</NoteCode> reads the pan's direction and calls{" "}
                <NoteCode>markRest(id)</NoteCode> on a left swipe (plus an a11y “Mark rest” action).
                The streak math in <NoteCode>markRest</NoteCode> never touches a rest transition.
              </NoteText>
            </DemoNote>
          </ExpandableTile>

          <ExpandableTile
            summary={<TileSummary tag="motion" title="The row reflows on rest" />}
          >
            <Body>
              The v4 motion beat: <Code>LayoutAnimation</Code>. One call before a state change tells
              RN to tween the next layout instead of jumping. Pulse fires it when restored channels
              arrive on launch, and the instant a row is parked on rest (LED → slate, readout to a
              calm grey). It's web-safe and gated by reduced-motion.
            </Body>
            <NewFilesV4 />
            <DemoNote title="Where the motion lives" meta="components/motion.tsx › layoutReflow">
              <NoteText>
                <NoteCode>layoutReflow()</NoteCode> wraps{" "}
                <NoteCode>LayoutAnimation.configureNext</NoteCode> with a reduced-motion gate, called
                from the store right before each mutation. Try it live in the Motion tour below.
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
          Alongside each version's Expo concept, Pulse introduces exactly one motion primitive. v4's
          is <Code>LayoutAnimation</Code> — the live tile below has a channel you can park on rest to
          watch the row tween between layouts instead of snapping.
        </Body>
        <MotionFeatureBento current={4} />
      </Section>
    </Screen>
  );
}
