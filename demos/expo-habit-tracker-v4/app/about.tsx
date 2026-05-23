import { Text, View } from "react-native";
import Screen from "@/components/Screen";
import { Body, Code, Eyebrow, H1, H2, Lede, Section, SectionTag } from "@/components/ui";
import ExpandableBento from "@/components/ExpandableBento";
import ExpandableTile from "@/components/ExpandableTile";
import Progression from "@/components/Progression";
import { VERSIONS } from "@/components/VersionDemos";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";

function VersionSummary({
  v,
  title,
  concept,
  current,
}: {
  v: number;
  title: string;
  concept: string;
  current: boolean;
}) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <Text
        style={{
          fontFamily: FONTS.monoBold,
          fontSize: 13,
          color: current ? theme.today : theme.aluDk,
          minWidth: 26,
        }}
      >
        v{v}
      </Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: FONTS.sansSemi, fontSize: 16, color: theme.print }}>
          {title}
          {current ? "  ·  you are here" : ""}
        </Text>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: theme.streak }}>
          {concept}
        </Text>
      </View>
    </View>
  );
}

export default function About() {
  const { theme } = useTheme();
  return (
    <Screen>
      <Eyebrow>About · the whole arc</Eyebrow>
      <H1>Pulse, version by version.</H1>
      <Lede>
        Pulse is a habit tracker built as a six-state teaching arc for Week 5 Day 4 (Expo /
        React Native). Each version is its own deployable app and teaches exactly one concept.
        Open any tile to preview that version's idea.
      </Lede>

      <Section>
        <Progression current={4} />
      </Section>

      <Section>
        <SectionTag>The six versions</SectionTag>
        <H2>One concept each.</H2>
        <ExpandableBento>
          {VERSIONS.map((ver) => {
            const Demo = ver.Demo;
            return (
              <ExpandableTile
                key={ver.v}
                summary={
                  <VersionSummary
                    v={ver.v}
                    title={ver.title}
                    concept={ver.concept}
                    current={ver.v === 4}
                  />
                }
              >
                <Body>{ver.blurb}</Body>
                <Demo />
              </ExpandableTile>
            );
          })}
        </ExpandableBento>
      </Section>

      <Section>
        <SectionTag>Why no backend</SectionTag>
        <H2>On-device, on purpose.</H2>
        <View
          style={{
            backgroundColor: theme.panel,
            borderWidth: 1,
            borderColor: theme.hairline,
            borderLeftWidth: 3,
            borderLeftColor: theme.done,
            borderRadius: 14,
            padding: 18,
          }}
        >
          <Body style={{ fontSize: 15, lineHeight: 23, color: theme.textMuted }}>
            As of <Code>v4</Code>, Pulse persists — your roster is saved with{" "}
            <Code>AsyncStorage</Code> (localStorage on web), so a refresh keeps it. But it's still
            on-device only: there's no account, no cloud sync, and no database. The point of this
            demo is the mobile UI, motion, and storage patterns, not a backend — that's a later
            week. Reset to seed from Settings whenever you want a clean slate.
          </Body>
        </View>
      </Section>
    </Screen>
  );
}
