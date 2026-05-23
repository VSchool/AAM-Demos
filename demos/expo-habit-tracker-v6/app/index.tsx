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
import { RouteAnatomy, DetailScreenMap, NewFilesV6 } from "@/components/V6Demos";
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
      <Eyebrow>State v6 · detail</Eyebrow>
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
            This is <Text style={{ color: theme.print }}>state v6 of 6</Text> — the final beat.
            Pulse can now <Text style={{ color: theme.print }}>drill in</Text>: tap any channel
            on Today to push a per-habit{" "}
            <Text style={{ color: theme.print }}>detail screen</Text> (an amber-LCD streak hero,
            a 30-day LED dot-matrix, the channel's "why," and an action bar). The route is{" "}
            <Code>app/habit/[id].tsx</Code> — a{" "}
            <Text style={{ color: theme.print }}>dynamic Expo Router</Text> file that matches any
            id. <Text style={{ color: theme.print }}>Tap UX shifts</Text> in v6: tap = open
            detail; swipes still complete / rest.
          </Lede>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, alignItems: "center" }}
          >
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
                A static preview of the seed Today screen. Open the app, then tap any channel to
                push its detail screen. ☀ / ☾ (bottom-right) re-skins it.
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
        <H2>What's real, and what needs a phone.</H2>
        <Panel style={{ borderLeftWidth: 3, borderLeftColor: theme.done }}>
          <Body style={{ fontSize: 15, lineHeight: 23, color: theme.textMuted }}>
            Your channels and Coach tone <Code>persist</Code> on this device (v4), with no
            account or cloud sync. v5's daily reminder is a{" "}
            <Code>real local notification</Code> — but it can only fire on a phone (Expo Go or a
            native / EAS build), since the OS is what posts it; on this deployed{" "}
            <Code>web</Code> build Enable shows the in-app preview banner instead. v6 adds the
            detail screen and a real per-habit URL: tap a channel and the browser address bar
            shows <Code>/habit/&lt;id&gt;</Code>. The back button (Stack header arrow + browser
            back) pops back to Today. That's the honest state of the finished arc.
          </Body>
        </Panel>
      </Section>

      {/* ---- 03 · BEHIND THE SCENES ---- */}
      <Section>
        <SectionTag>03 · Behind the scenes</SectionTag>
        <H2>Seven states, one concept each.</H2>
        <Body style={{ marginBottom: 16 }}>
          Each version is its own deployable app teaching exactly one Expo/RN concept. Past
          versions stay live so you can step back through the whole arc; the full story is on
          the About page.
        </Body>
        <Progression current={6} />
      </Section>

      {/* ---- 04 · INSIDE v6 ---- */}
      <Section>
        <SectionTag>04 · Inside v6</SectionTag>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <H2>The files this version introduces.</H2>
          <FeatureCallout
            title="Dynamic routes + push navigation"
            description="v6's new concept. Expo Router treats any file in app/ with a [bracketed] segment as a dynamic route — app/habit/[id].tsx matches /habit/morning-walk, /habit/read-10, anything. The screen reads the matched value via useLocalSearchParams() and renders the right habit. Tapping a channel on Today calls router.push('/habit/' + id); the Stack pushes a new screen and slides it in from the right."
            prompt={`In a React Native (Expo) app with Expo Router, add a dynamic per-item detail route and push to it on tap:

1. Create the file app/<resource>/[id].tsx. The bracketed [id] in the filename makes it a dynamic route — Expo Router will match URLs like /<resource>/anything and pass the matched value as the id param. No router config needed; file presence registers it.
2. Inside the screen, read the matched value:
   import { useLocalSearchParams, Stack, router } from "expo-router";
   const { id } = useLocalSearchParams<{ id: string }>();
   const item = items.find(i => i.id === id);
   if (!item) return <Fallback />;  // handle deleted / never-existed ids
3. Customize the per-route transition with <Stack.Screen options={{ animation: "slide_from_right" }} /> — the iOS-native push feel that reads unambiguously as "new screen on top of the previous one." Branch the animation prop on useReducedMotion() to "none" so reduced-motion users get an instant cut.
4. From the list, push the route on a tap (NOT a swipe — keep gestures for commits):
   import { router } from "expo-router";
   <Pressable onPress={() => router.push(\`/<resource>/\${item.id}\`)}>…</Pressable>
5. Render the detail body as its own component that takes the resolved item as a prop. Keep the custom header (back arrow + title) inside that component if you want to skin it; otherwise set headerShown: true in the per-route options and let Stack render the default back button.
6. Implement Back via router.back() on the custom header — Expo Router will also wire the browser back button and the swipe-from-left gesture for you.`}
          />
        </View>
        <ExpandableBento>
          <ExpandableTile
            summary={<TileSummary tag="routes" title="A file becomes a URL" />}
          >
            <Body>
              The v6 lesson. <Code>app/habit/[id].tsx</Code> is a dynamic route: the bracketed
              segment turns it into a wildcard that matches any habit id. Tap a channel,{" "}
              <Code>router.push</Code> the URL, the screen reads the id back via{" "}
              <Code>useLocalSearchParams</Code>, looks the habit up in the store, and renders
              the detail body. No router config; the file IS the route.
            </Body>
            <RouteAnatomy />
            <DemoNote
              title="Where routing lives"
              meta="app/habit/[id].tsx · components/ThrowRow.tsx"
            >
              <NoteText>
                <NoteCode>[id].tsx</NoteCode> is the dynamic route;{" "}
                <NoteCode>ThrowRow</NoteCode> now calls{" "}
                <NoteCode>router.push('/habit/' + id)</NoteCode> on tap (swipes still
                complete/rest). The browser URL updates so deep-links + back-forward Just Work.
              </NoteText>
            </DemoNote>
          </ExpandableTile>

          <ExpandableTile
            summary={<TileSummary tag="detail" title="What the screen shows" />}
          >
            <Body>
              The detail screen renders data the model already carries but the app couldn't
              show before: an amber-LCD streak hero with{" "}
              <Code>best</Code>, a 30-cell LED dot-matrix of the last 30 days, the channel's
              meta (cadence / window), the "why" you typed when patching it in, and an action
              bar — <Code>Edit</Code> (stub), <Code>Log</Code> (toggle done), and{" "}
              <Code>Delete</Code> (remove + pop back).
            </Body>
            <DetailScreenMap />
            <DemoNote title="Where detail lives" meta="components/HabitDetail.tsx">
              <NoteText>
                <NoteCode>HabitDetail</NoteCode> is the screen body — all theme-token driven
                so both faces re-skin (glow in dark, positive LCD in light). Delete calls a
                new <NoteCode>removeHabit(id)</NoteCode> store action then{" "}
                <NoteCode>router.back()</NoteCode>.
              </NoteText>
            </DemoNote>
          </ExpandableTile>

          <ExpandableTile
            summary={<TileSummary tag="motion" title="Slide it in from the right" />}
          >
            <Body>
              The v6 motion beat IS the routing transition. Set the per-route option{" "}
              <Code>animation: "slide_from_right"</Code> on the Stack screen — the canonical
              iOS-native push feel that visually kills any ambiguity that the detail screen is
              something other than a real pushed route. Reduced-motion lands instantly via{" "}
              <Code>animation: "none"</Code>.
            </Body>
            <NewFilesV6 />
            <DemoNote
              title="Where the motion lives"
              meta="app/habit/[id].tsx · MotionFeatureBento › StackPushDemo"
            >
              <NoteText>
                <NoteCode>&lt;Stack.Screen options={"{ animation: 'slide_from_right' }"} /&gt;</NoteCode>{" "}
                on the dynamic route. The motion tour below has a live{" "}
                <NoteCode>StackPushDemo</NoteCode> tile that re-creates the slide in a
                contained Reanimated translateX (a real Stack push would unmount the page).
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
          Alongside each version's Expo concept, Pulse introduces exactly one motion primitive.
          v6's is the <Code>Stack.Screen</Code> transition itself — set{" "}
          <Code>animation: "slide_from_right"</Code> and the new route reads as a real push. The
          live tile below re-creates the slide inside a bounded overlay so you can replay it.
        </Body>
        <MotionFeatureBento current={6} />
      </Section>
    </Screen>
  );
}
