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
import { PushFlow, CoachVoices, NewFilesV5 } from "@/components/V5Demos";
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
      <Eyebrow>State v5 · push</Eyebrow>
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
            This is <Text style={{ color: theme.print }}>state v5 of 6</Text> — the final beat. Pulse
            can now <Text style={{ color: theme.print }}>reach out</Text>: a daily{" "}
            <Text style={{ color: theme.print }}>reminder notification</Text> you grant permission for
            and schedule, spoken in your{" "}
            <Text style={{ color: theme.print }}>Coach tone</Text> — Chill, Firm, or Elite. Real OS
            push fires on a phone; this web build lands the same nudge as an in-app preview.
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
                A static preview of the seed state. Open the app, then visit Settings to dial your
                Coach tone and preview the daily reminder. ☀ / ☾ (bottom-right) re-skins it.
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
            Your channels and Coach tone <Code>persist</Code> on this device (v4), with no account or
            cloud sync. v5's daily reminder is a <Code>real local notification</Code> via{" "}
            <Code>expo-notifications</Code> — but it can only fire on a phone (Expo Go or a native /
            EAS build), since the OS is what posts it. This deployed <Code>web</Code> build has no
            notification scheduler, so Enable just shows the in-app preview banner (same Coach-tone
            copy, landing with the v5 motion). That's the honest state of the finished arc.
          </Body>
        </Panel>
      </Section>

      {/* ---- 03 · BEHIND THE SCENES ---- */}
      <Section>
        <SectionTag>03 · Behind the scenes</SectionTag>
        <H2>Six versions, one concept each.</H2>
        <Body style={{ marginBottom: 16 }}>
          Each version is its own deployable app teaching exactly one Expo/RN concept. Past versions
          stay live so you can step back through the whole arc; the full story is on the About page.
        </Body>
        <Progression current={5} />
      </Section>

      {/* ---- 04 · INSIDE v5 ---- */}
      <Section>
        <SectionTag>04 · Inside v5</SectionTag>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <H2>The files this version introduces.</H2>
          <FeatureCallout
            title="Daily local notifications — permission + schedule"
            description="v5's new concept. Pulse schedules a daily reminder at the time you pick, with Coach-tone-driven copy (Chill / Firm / Elite). Real push fires only on a phone (Expo Go or a dev build); the deployed web build no-ops and shows an in-app preview banner instead. Permission, scheduling, and cancelling all live in lib/notifications."
            prompt={`In a React Native (Expo) app, schedule a daily local notification with expo-notifications:

1. Install: npx expo install expo-notifications. Native (Expo Go / dev build) supports scheduling; web is a no-op — guard every call with Platform.OS !== "web".
2. At module load, call Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }) }) so foreground notifications render a banner.
3. Implement requestPermission(): const { status } = await Notifications.getPermissionsAsync(); if not granted, request it via Notifications.requestPermissionsAsync(). Return the final status.
4. Implement scheduleDailyReminder(hour, minute, copy): first cancelAllScheduledNotificationsAsync(), then schedule a DAILY trigger:
   await Notifications.scheduleNotificationAsync({
     content: { title: copy.title, body: copy.body, sound: true },
     trigger: { type: SchedulableTriggerInputTypes.DAILY, hour, minute },
   })
5. Implement cancelReminder() that calls cancelAllScheduledNotificationsAsync (or removes the specific identifier you stashed).
6. Keep tone (chill | firm | elite) and enabled state in a Context provider; persist them to AsyncStorage so the choice survives a restart. Whenever tone or time changes AND enabled is true, reschedule.
7. On web, render an in-app preview banner with a Reanimated overshoot-then-settle entrance (withSequence) so the Coach tone still feels live for desktop reviewers.`}
          />
        </View>
        <ExpandableBento>
          <ExpandableTile
            summary={<TileSummary tag="push" title="A daily reminder you schedule" />}
          >
            <Body>
              The v5 lesson. <Code>expo-notifications</Code> requests permission, then schedules a{" "}
              <Code>DAILY</Code> trigger at your reminder time. It fires whether or not the app is
              open, and the schedule persists. On web there's no OS scheduler, so the flow no-ops and
              the preview banner stands in.
            </Body>
            <PushFlow />
            <DemoNote
              title="Where push lives"
              meta="lib/notifications.ts · lib/reminder.tsx"
            >
              <NoteText>
                <NoteCode>notifications.ts</NoteCode> wraps{" "}
                <NoteCode>requestPermissionsAsync</NoteCode> +{" "}
                <NoteCode>scheduleNotificationAsync</NoteCode> (all native-guarded);{" "}
                <NoteCode>reminder.tsx</NoteCode> holds the live, persisted reminder state and calls
                them.
              </NoteText>
            </DemoNote>
          </ExpandableTile>

          <ExpandableTile
            summary={<TileSummary tag="coach" title="Coach tone goes live" />}
          >
            <Body>
              The signature feature, finally wired. The dial (a preview since v1) now picks the
              actual copy your reminder is scheduled with — and reschedules on the fly when you
              change it. Three voices, one job: get you back to your channels.
            </Body>
            <CoachVoices />
            <DemoNote title="Where the tone lives" meta="lib/notifications.ts › COACH_COPY">
              <NoteText>
                <NoteCode>COACH_COPY</NoteCode> maps each tone to a title + body;{" "}
                <NoteCode>reminder.setTone()</NoteCode> swaps the voice and reschedules. Try the dial
                live in Settings.
              </NoteText>
            </DemoNote>
          </ExpandableTile>

          <ExpandableTile
            summary={<TileSummary tag="motion" title="The reminder lands" />}
          >
            <Body>
              The v5 motion beat: <Code>withSequence</Code>. The preview banner's scale overshoots
              past 1, then settles with a spring — a multi-step entrance, so the notification feels
              like it lands instead of just appearing. Reduced-motion places it instantly.
            </Body>
            <NewFilesV5 />
            <DemoNote title="Where the motion lives" meta="components/motion.tsx › SequenceIn">
              <NoteText>
                <NoteCode>SequenceIn</NoteCode> chains{" "}
                <NoteCode>withTiming(1.06)</NoteCode> → <NoteCode>withSpring(1)</NoteCode> on scale.{" "}
                <NoteCode>ReminderPreview.tsx</NoteCode> wraps the banner in it. Try it live in the
                Motion tour below.
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
          Alongside each version's Expo concept, Pulse introduces exactly one motion primitive. v5's
          is <Code>withSequence</Code> — the live tile below fires a reminder banner you can watch
          overshoot and settle. That's the full six-beat motion arc.
        </Body>
        <MotionFeatureBento current={5} />
      </Section>
    </Screen>
  );
}
