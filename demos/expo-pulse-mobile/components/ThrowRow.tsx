/* ThrowRow — channel row on /today.
     • TAP the row body   → push '/habit/{id}' (open detail)
     • TAP the switch     → toggle done ↔ today/rest
   Previously also supported swipe-to-throw via react-native-gesture-handler
   + Reanimated; that was removed because on RN-web the outer navigation
   Pressable and the inner switch Pressable both fired on a single click,
   so taps on the switch always navigated instead of toggling. The simple
   two-Pressable layout now mirrors the /settings Day-mode toggle, which
   clicks reliably on web. */

import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { FONTS, type ReservedRole } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { Led, Segment } from "./instrument";

function openDetail(id: string) {
  router.push(`/habit/${id}`);
}

const TRACK_W = 46;
const TRACK_H = 26;
const KNOB = TRACK_H - 6;
const KNOB_TRAVEL = TRACK_W - KNOB - 4; // left:2 → right:2

export default function ThrowRow({
  id,
  status,
  name,
  meta,
  streak,
  onSwipeRight,
  onSwipeLeft,
  onTap,
}: {
  /** the habit id — used to build the detail-route URL on tap. */
  id: string;
  status: ReservedRole;
  name: string;
  meta: string;
  streak: string;
  /** complete the habit (today/rest → done). Name is historical (swipe-right). */
  onSwipeRight: () => void;
  /** rest the habit / un-complete (done → today). Name is historical (swipe-left). */
  onSwipeLeft: () => void;
  /** Optional row-tap override. When absent (the production /today case)
      tap pushes the detail route. The motion-tour demo passes its own
      handler so it can run in isolation without navigating. */
  onTap?: () => void;
}) {
  const { theme } = useTheme();
  const done = status === "done";
  const dim = status === "rest";

  const trackOn = theme.name === "dark" ? "#0F2417" : "#D2F0DF";
  const trackOff = theme.name === "dark" ? "#0A0B0C" : "#D9DAD2";
  const knobOff = theme.name === "dark" ? "#C8CDD3" : "#FFFFFF";

  const handleRowPress = () => {
    if (onTap) onTap();
    else openDetail(id);
  };

  const handleToggle = () => {
    if (done) onSwipeLeft();
    else onSwipeRight();
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
        backgroundColor: theme.panel,
        borderWidth: 1,
        borderColor: theme.hairline,
        borderRadius: 12,
        paddingVertical: 11,
        paddingHorizontal: 12,
      }}
    >
      {/* Row body — tap to open detail. Sibling (NOT parent) of the
          switch so clicks on the switch don't reach this handler. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${name} — open detail`}
        accessibilityHint="Opens the channel's detail screen"
        onPress={handleRowPress}
        style={({ pressed }) => ({
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 11,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Led role={dim ? "rest" : status} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              fontFamily: FONTS.sansSemi,
              fontSize: 14,
              letterSpacing: -0.1,
              color: theme.print,
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              letterSpacing: 0.4,
              color: theme.aluDk,
              marginTop: 1,
            }}
          >
            {dim ? "RESTING · STREAK HELD" : meta}
          </Text>
        </View>
        {dim ? (
          <Text style={{ fontFamily: FONTS.monoBold, fontSize: 13, color: theme.rest }}>
            {streak}
          </Text>
        ) : (
          <Segment value={streak} />
        )}
      </Pressable>
      {/* hardware switch — its own Pressable. Mirrors the /settings
          Day-mode SwitchRow pattern: one Pressable, one action. */}
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: done }}
        accessibilityLabel={`${name} — ${done ? "mark not done" : "mark done"}`}
        onPress={handleToggle}
        hitSlop={8}
      >
        <View
          style={{
            width: TRACK_W,
            height: TRACK_H,
            borderRadius: TRACK_H / 2,
            borderWidth: 1,
            justifyContent: "center",
            backgroundColor: done ? trackOn : trackOff,
            borderColor: done ? theme.done : theme.hairlineStrong,
            // @ts-expect-error — RN-web honors `transition`; native ignores it.
            transition: "background-color 150ms, border-color 150ms",
          }}
        >
          <View
            style={{
              position: "absolute",
              left: 2,
              width: KNOB,
              height: KNOB,
              borderRadius: KNOB / 2,
              backgroundColor: done ? theme.done : knobOff,
              transform: [{ translateX: done ? KNOB_TRAVEL : 0 }],
              // @ts-expect-error — RN-web only.
              transition: "transform 180ms cubic-bezier(.5, 1.8, .3, 1), background-color 150ms",
            }}
          />
        </View>
      </Pressable>
    </View>
  );
}
