/* EditHabitForm — the inline "edit this channel" form on the detail screen
   (introduced at v5, inherited by v6). It reuses the v2 add-form PATTERN —
   the same Field / SegmentedControl / TextField instrument primitives — but
   pre-filled with the channel's current name / cadence / window / why.

   Save calls updateHabit(id, patch): a PARTIAL update, so the streak,
   best-streak, 30-day history, today's status, channel number and id are all
   left untouched — editing a channel never resets its progress. It's an
   inline panel toggled from the action bar, NOT a route. */

import { useState } from "react";
import { ScrollView, Text, View, type ViewStyle } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { channelCode, type Cadence, type Habit, type Window } from "@/lib/habits";
import type { NewHabit } from "@/lib/habit-store";
import { Field, SegmentedControl, TextField } from "./instrument";
import { PressFade } from "./motion";

const CADENCES: { label: string; value: Cadence }[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekdays", value: "weekdays" },
  { label: "Custom", value: "custom" },
];

// All four windows. The add form omits "nightly", but seed channels use it,
// so the edit form must offer it to round-trip whatever a channel already has.
const WINDOWS: { label: string; value: Window }[] = [
  { label: "Morning", value: "morning" },
  { label: "Anytime", value: "anytime" },
  { label: "Evening", value: "evening" },
  { label: "Nightly", value: "nightly" },
];

const SECTION_LABEL = {
  fontFamily: FONTS.mono,
  fontSize: 9,
  letterSpacing: 1.8,
  textTransform: "uppercase" as const,
};

export default function EditHabitForm({
  habit,
  onSave,
  onCancel,
}: {
  habit: Habit;
  onSave: (patch: Partial<NewHabit>) => void;
  onCancel: () => void;
}) {
  const { theme } = useTheme();
  const [name, setName] = useState(habit.name);
  const [why, setWhy] = useState(habit.why ?? "");
  const [cadenceIdx, setCadenceIdx] = useState(
    Math.max(0, CADENCES.findIndex((c) => c.value === habit.cadence)),
  );
  const [windowIdx, setWindowIdx] = useState(
    Math.max(0, WINDOWS.findIndex((w) => w.value === habit.window)),
  );

  const canSave = name.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    onSave({
      name,
      cadence: CADENCES[cadenceIdx].value,
      window: WINDOWS[windowIdx].value,
      why: why.trim() || undefined,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas }}>
      {/* header bar — mirrors the detail header, with a Cancel affordance */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: theme.appbarTo,
          borderBottomWidth: 1,
          borderBottomColor: theme.name === "dark" ? "#000" : theme.hairlineStrong,
          paddingHorizontal: 18,
          paddingTop: 10,
          paddingBottom: 12,
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.mono,
            fontSize: 11,
            letterSpacing: 2.2,
            textTransform: "uppercase",
            color: theme.alu,
          }}
        >
          Edit · {channelCode(habit.channel)}
        </Text>
        <PressFade onPress={onCancel} accessibilityRole="button" accessibilityLabel="Cancel edit">
          <Text
            style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 1, color: theme.aluDk }}
          >
            CANCEL ✕
          </Text>
        </PressFade>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 28 }}>
        <Field label="Label">
          <TextField
            value={name}
            onChangeText={setName}
            placeholder="e.g. Stretch"
            returnKeyType="done"
            onSubmitEditing={save}
          />
        </Field>

        <View style={{ gap: 7 }}>
          <Text style={[SECTION_LABEL, { color: theme.aluDk }]}>Cadence</Text>
          <SegmentedControl
            options={CADENCES.map((c) => c.label)}
            active={cadenceIdx}
            onChange={setCadenceIdx}
          />
        </View>

        <View style={{ gap: 7 }}>
          <Text style={[SECTION_LABEL, { color: theme.aluDk }]}>Window</Text>
          <SegmentedControl
            options={WINDOWS.map((w) => w.label)}
            active={windowIdx}
            onChange={setWindowIdx}
          />
        </View>

        <Field label="Why" hint="optional">
          <TextField
            value={why}
            onChangeText={setWhy}
            placeholder="What's this for?"
            returnKeyType="done"
            onSubmitEditing={save}
          />
        </Field>

        <PressFade
          onPress={save}
          disabled={!canSave}
          accessibilityRole="button"
          accessibilityLabel="Save changes"
          accessibilityState={{ disabled: !canSave }}
          style={{
            alignItems: "center",
            backgroundColor: theme.streak,
            borderRadius: 9,
            paddingVertical: 13,
            opacity: canSave ? 1 : 0.45,
            ...((theme.glow
              ? {
                  shadowColor: theme.streak,
                  shadowOpacity: 0.3,
                  shadowRadius: 14,
                  shadowOffset: { width: 0, height: 0 },
                }
              : {
                  shadowColor: "#000",
                  shadowOpacity: 0.18,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                }) as ViewStyle),
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.sansBold,
              fontSize: 14,
              letterSpacing: 0.4,
              color: theme.name === "dark" ? "#1A0A04" : "#160701",
            }}
          >
            SAVE CHANGES ▸
          </Text>
        </PressFade>
      </ScrollView>
    </View>
  );
}
