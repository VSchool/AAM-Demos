/* ============================================================
   HabitDetail — what the v6 dynamic route renders inside.

   This screen is the "vessel" for v6's teaching beat (dynamic
   routes + push). The features on it are real but secondary:
   they're data the model already carries (history, why,
   bestStreak) that was previously invisible in the app.

   Section map, top → bottom:
     ◂ CH 0N · {name}            (custom header — own back arrow)
     [ amber LCD: big streak ]   (k-lcd)
     [ last-30 LED dot-matrix ]  (k-matrix, 10×3 grid)
     CADENCE  · …                (k-meta)
     WINDOW   · …                (k-meta)
     "the why."                  (k-why, streak-orange rule)
     ┌ Edit │ Log │ Delete ┐     (k-tabs action bar)

   Both themes re-skin via theme tokens. Source of truth for the
   visual treatment: _proposals/expo-habit-tracker-ui-kit-v2.html
   lines 400–422 (dark) + 600–622 (light).
   ============================================================ */

import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { router } from "expo-router";

import { useHabitStore } from "@/lib/habit-store";
import { channelCode, type Cadence, type Habit, type Window } from "@/lib/habits";
import { useTheme } from "@/theme/ThemeProvider";
import { FONTS } from "@/theme/tokens";

const CADENCE_LABEL: Record<Cadence, string> = {
  daily: "Daily",
  weekdays: "Weekdays",
  custom: "Custom",
};
const WINDOW_LABEL: Record<Window, string> = {
  morning: "Morning",
  anytime: "Anytime",
  evening: "Evening",
  nightly: "Nightly",
};

const MATRIX_LEN = 30;

export default function HabitDetail({ habit }: { habit: Habit }) {
  const { theme } = useTheme();
  const { toggleDone, removeHabit } = useHabitStore();

  // Edit is intentionally a stub (out-of-scope per the v6 plan); tapping it
  // surfaces a small inline pill instead of routing anywhere.
  const [editHint, setEditHint] = useState(false);

  // The last 30 cells of history, newest last, padded with empty cells if the
  // channel hasn't been around for 30 days yet.
  const matrix = useMemo<("done" | "rest" | "miss" | "empty")[]>(() => {
    const tail = habit.history.slice(-MATRIX_LEN);
    const padding = Math.max(0, MATRIX_LEN - tail.length);
    return [...Array.from({ length: padding }, () => "empty" as const), ...tail];
  }, [habit.history]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas }}>
      <DetailHeader habit={habit} />
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 28 }}
        style={{ flex: 1 }}
      >
        {/* big streak LCD — the hero. Streak number is in the streak-orange
            role, so the same component re-skins (glow in dark, positive
            readout on pale LCD in light). */}
        <LcdHero streak={habit.streak} bestStreak={habit.bestStreak} />

        {/* 30-cell LED dot-matrix — the visible history. */}
        <View>
          <Text
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              letterSpacing: 1.8,
              textTransform: "uppercase",
              color: theme.aluDk,
              marginBottom: 8,
            }}
            accessibilityRole="text"
          >
            Last 30 · ▮ done   ▮ rest
          </Text>
          <DotMatrix cells={matrix} />
        </View>

        {/* meta rows, mono key + value, hairline rule above each */}
        <MetaRow label="CADENCE" value={CADENCE_LABEL[habit.cadence]} />
        <MetaRow label="WINDOW" value={WINDOW_LABEL[habit.window]} />

        {/* the "why" — surfaced for the first time in v6. Streak-orange
            left rule, italic so it reads as a quote rather than UI. */}
        {habit.why ? <WhyQuote text={habit.why} /> : null}

        {editHint ? (
          <Text
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              color: theme.aluDk,
              textAlign: "center",
              marginTop: 6,
            }}
          >
            Edit · deferred to a v7 stretch
          </Text>
        ) : null}
      </ScrollView>

      {/* bottom action bar — dressed like the k-tabs strip from the kit */}
      <ActionBar
        onEdit={() => setEditHint(true)}
        onLog={() => toggleDone(habit.id)}
        onDelete={() => {
          removeHabit(habit.id);
          router.back();
        }}
      />
    </View>
  );
}

/* ---- header bar (replaces the Stack header) ---------------- */
function DetailHeader({ habit }: { habit: Habit }) {
  const { theme } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Back to Today · ${channelCode(habit.channel)} · ${habit.name}`}
      onPress={() => router.back()}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: theme.appbarTo,
        borderBottomWidth: 1,
        borderBottomColor: theme.name === "dark" ? "#000" : theme.hairlineStrong,
        paddingHorizontal: 18,
        paddingTop: 10,
        paddingBottom: 12,
        opacity: pressed ? 0.7 : 1,
      })}
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
        ◂ {channelCode(habit.channel)} · {habit.name}
      </Text>
    </Pressable>
  );
}

/* ---- amber LCD streak hero -------------------------------- */
function LcdHero({ streak, bestStreak }: { streak: number; bestStreak: number }) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.lcd,
        borderWidth: 1,
        borderColor: theme.hairlineStrong,
        borderRadius: 10,
        paddingVertical: 18,
        paddingHorizontal: 16,
        alignItems: "center",
        // inset shadow on web only (matches the .k-lcd box-shadow inset spec)
        ...(Platform.OS === "web" && theme.name === "dark"
          ? ({ boxShadow: "0 2px 14px rgba(0,0,0,0.5) inset" } as unknown as ViewStyle)
          : Platform.OS === "web"
          ? ({ boxShadow: "inset 0 1px 4px rgba(0,0,0,0.13)" } as unknown as ViewStyle)
          : {}),
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.monoBold,
          fontSize: 52,
          lineHeight: 56,
          letterSpacing: 2,
          color: theme.streak,
          textShadowColor: theme.glow ? theme.streakGlow : "transparent",
          textShadowRadius: theme.glow ? 14 : 0,
          textShadowOffset: { width: 0, height: 0 },
        }}
      >
        {streak}
      </Text>
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 10,
          letterSpacing: 2.4,
          textTransform: "uppercase",
          color: theme.aluDk,
          marginTop: 8,
        }}
      >
        day streak · best {bestStreak}
      </Text>
    </View>
  );
}

/* ---- 30-cell LED dot-matrix ------------------------------- */
function DotMatrix({ cells }: { cells: ("done" | "rest" | "miss" | "empty")[] }) {
  const { theme } = useTheme();
  // 10 cells per row, 3 rows total. Each cell is a small square LED.
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
      {cells.map((cell, i) => {
        const tone =
          cell === "done"
            ? theme.done
            : cell === "rest"
            ? theme.rest
            : cell === "miss"
            ? theme.name === "dark"
              ? "#7E2B1A"
              : "#C4543A"
            : theme.name === "dark"
            ? "#1A1D21"
            : "#D3D4CE";
        const glow = cell === "done" && theme.glow;
        return (
          <View
            key={i}
            // Compute width from the 10-col grid: (100% - 9 * 4px gap) / 10.
            // Using calc() is web-only; on native we get a fixed-ish size that
            // wraps the same way. RN doesn't support calc()-style width, so
            // we approximate with flexBasis.
            style={{
              flexBasis: `${(100 - 9 * 1.4) / 10}%`,
              aspectRatio: 1,
              borderRadius: 2,
              backgroundColor: tone,
              opacity: cell === "empty" ? 0.85 : 1,
              shadowColor: glow ? theme.done : "transparent",
              shadowOpacity: glow ? 0.9 : 0,
              shadowRadius: glow ? 5 : 0,
              shadowOffset: { width: 0, height: 0 },
            }}
          />
        );
      })}
    </View>
  );
}

/* ---- meta row (CADENCE · Daily, etc) ---------------------- */
function MetaRow({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        borderTopWidth: 1,
        borderTopColor: theme.hairline,
        paddingTop: 9,
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 11,
          letterSpacing: 1.6,
          color: theme.aluDk,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 11,
          letterSpacing: 0.6,
          color: theme.alu,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

/* ---- the "why" quote -------------------------------------- */
function WhyQuote({ text }: { text: string }) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        borderLeftWidth: 2,
        borderLeftColor: theme.streak,
        paddingLeft: 10,
        paddingVertical: 2,
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.sans,
          fontStyle: "italic",
          fontSize: 13,
          lineHeight: 20,
          color: theme.aluDk,
        }}
      >
        “{text}”
      </Text>
    </View>
  );
}

/* ---- action bar (Edit · Log · Delete) --------------------- */
function ActionBar({
  onEdit,
  onLog,
  onDelete,
}: {
  onEdit: () => void;
  onLog: () => void;
  onDelete: () => void;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: theme.name === "dark" ? "#0A0B0C" : "#EBECE6",
        borderTopWidth: 1,
        borderTopColor: theme.hairline,
        paddingHorizontal: 10,
        paddingTop: 8,
        paddingBottom: 14,
      }}
    >
      <ActionButton label="Edit" onPress={onEdit} />
      <ActionButton label="Log" onPress={onLog} active />
      <ActionButton label="Delete" onPress={onDelete} />
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  active = false,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        alignItems: "center",
        paddingVertical: 9,
        marginHorizontal: 3,
        borderRadius: 7,
        borderWidth: active ? 1 : 0,
        borderColor: active ? theme.hairlineStrong : "transparent",
        backgroundColor: active ? (theme.name === "dark" ? "#1C1F23" : "#FFFFFF") : "transparent",
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 10,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          color: active ? theme.streak : theme.aluDk,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
