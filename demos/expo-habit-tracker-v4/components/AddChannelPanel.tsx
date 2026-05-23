/* AddChannelPanel — the v2 add-a-habit form, rendered as an inline
   expanding panel pinned at the top of the Today FlatList (its
   ListHeaderComponent). Collapsed it's a single "Patch in a channel"
   affordance; tapping expands it — reusing the DemoNote/ExpandableTile
   LayoutAnimation feel — into the form from the locked UI kit: an
   auto-assigned channel number, a label TextField, hardware toggles for
   cadence + window, an optional "why", and the streak-orange submit.

   It's a panel, not a modal or a pushed route — the three tabs stay
   locked. On submit it patches the channel into the store (which springs
   the new row in via the v2 withSpring primitive), then resets + collapses. */

import { useState } from "react";
import { Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import type { Cadence, Window } from "@/lib/habits";
import type { NewHabit } from "@/lib/habit-store";
import { Field, SegmentedControl, TextField } from "./instrument";
import { PressFade, layoutReflow } from "./motion";

const CADENCES: { label: string; value: Cadence }[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekdays", value: "weekdays" },
  { label: "Custom", value: "custom" },
];

const WINDOWS: { label: string; value: Window }[] = [
  { label: "Morning", value: "morning" },
  { label: "Anytime", value: "anytime" },
  { label: "Evening", value: "evening" },
];

export default function AddChannelPanel({
  nextChannel,
  onAdd,
}: {
  nextChannel: number;
  onAdd: (input: NewHabit) => void;
}) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [why, setWhy] = useState("");
  const [cadenceIdx, setCadenceIdx] = useState(0); // Daily
  const [windowIdx, setWindowIdx] = useState(1); // Anytime

  const channelLabel = `CH ${String(nextChannel).padStart(2, "0")}`;
  const canSubmit = name.trim().length > 0;

  const toggle = () => {
    layoutReflow(); // gated by reduced-motion
    setOpen((v) => !v);
  };

  const reset = () => {
    setName("");
    setWhy("");
    setCadenceIdx(0);
    setWindowIdx(1);
  };

  const submit = () => {
    if (!canSubmit) return;
    onAdd({
      name,
      cadence: CADENCES[cadenceIdx].value,
      window: WINDOWS[windowIdx].value,
      why: why.trim() || undefined,
    });
    layoutReflow(); // gated by reduced-motion
    reset();
    setOpen(false);
  };

  /* ---- collapsed affordance ---- */
  if (!open) {
    return (
      <PressFade
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel="Patch in a channel"
        accessibilityState={{ expanded: false }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: theme.hairlineStrong,
          borderStyle: "dashed",
          borderRadius: 12,
          paddingVertical: 13,
          paddingHorizontal: 13,
        }}
      >
        <Text style={{ color: theme.streak, fontFamily: FONTS.sansBold, fontSize: 16 }}>＋</Text>
        <Text style={{ flex: 1, fontFamily: FONTS.sansSemi, fontSize: 14, color: theme.aluDk }}>
          Patch in a channel…
        </Text>
        <Text style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1, color: theme.aluDk }}>
          {channelLabel}
        </Text>
      </PressFade>
    );
  }

  /* ---- expanded form ---- */
  return (
    <View
      style={{
        backgroundColor: theme.panel,
        borderWidth: 1,
        borderColor: theme.hairlineStrong,
        borderRadius: 12,
        padding: 13,
        gap: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text
          style={{
            fontFamily: FONTS.mono,
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: theme.alu,
          }}
        >
          Patch in a channel
        </Text>
        <PressFade onPress={toggle} accessibilityRole="button" accessibilityLabel="Cancel">
          <Text style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 1, color: theme.aluDk }}>
            CANCEL ✕
          </Text>
        </PressFade>
      </View>

      <Field label="Channel" hint="auto">
        <Text style={{ fontFamily: FONTS.sansSemi, fontSize: 15, color: theme.print }}>
          {channelLabel}
        </Text>
      </Field>

      <Field label="Label">
        <TextField
          value={name}
          onChangeText={setName}
          placeholder="e.g. Stretch"
          returnKeyType="done"
          onSubmitEditing={submit}
        />
      </Field>

      <View style={{ gap: 7 }}>
        <Text
          style={{
            fontFamily: FONTS.mono,
            fontSize: 9,
            letterSpacing: 1.8,
            textTransform: "uppercase",
            color: theme.aluDk,
          }}
        >
          Cadence
        </Text>
        <SegmentedControl
          options={CADENCES.map((c) => c.label)}
          active={cadenceIdx}
          onChange={setCadenceIdx}
        />
      </View>

      <View style={{ gap: 7 }}>
        <Text
          style={{
            fontFamily: FONTS.mono,
            fontSize: 9,
            letterSpacing: 1.8,
            textTransform: "uppercase",
            color: theme.aluDk,
          }}
        >
          Window
        </Text>
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
          onSubmitEditing={submit}
        />
      </Field>

      <PressFade
        onPress={submit}
        disabled={!canSubmit}
        accessibilityRole="button"
        accessibilityLabel="Patch in channel"
        accessibilityState={{ disabled: !canSubmit }}
        style={{
          alignItems: "center",
          backgroundColor: theme.streak,
          borderRadius: 9,
          paddingVertical: 13,
          opacity: canSubmit ? 1 : 0.45,
          ...(theme.glow
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
              }),
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
          PATCH IN ▸
        </Text>
      </PressFade>
    </View>
  );
}
