/* ============================================================
   Tour — the "what's new" overlay (auto-runs on entry to the app).

   Renders inside the phone screen area. A dimmed backdrop + a coachmark
   card that steps through the version's new things, AND a bold
   theme-coloured SPOTLIGHT RING that moves to the element each step
   points at (via TourTarget rects from the tour context). When a step has
   no on-screen target, the ring is hidden and the card just explains the
   change. The card sits opposite the ring (ring up → card down) so it
   never covers what it's pointing at. Reduced-motion safe (SequenceIn).

   WhatsNewPill is the collapsed trigger it leaves behind — re-opens the
   tour any time.
   ============================================================ */

import { Pressable, Text, View, type ViewStyle } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { useTour, type Rect } from "@/lib/tour";
import { SequenceIn } from "./motion";

const fill: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 };
const RING_PAD = 7;

/* target window-rect → coords relative to the phone screen container. */
function relativeRect(target: Rect | undefined, screen: Rect | null): Rect | null {
  if (!target || !screen) return null;
  return { x: target.x - screen.x, y: target.y - screen.y, w: target.w, h: target.h };
}

export default function Tour() {
  const { theme } = useTheme();
  const { open, step, steps, close, next, back, targets, screenRect } = useTour();

  if (!open) return null;

  const s = steps[step];
  const last = step === steps.length - 1;
  const rel = relativeRect(s.target ? targets[s.target] : undefined, screenRect);

  // Card goes OPPOSITE the ring so it never covers the highlighted element:
  // ring in the top half → card at the bottom, and vice-versa. No target →
  // card at the bottom (default).
  const screenH = screenRect?.h ?? 700;
  const ringInTopHalf = rel ? rel.y + rel.h / 2 < screenH / 2 : false;
  const cardAtTop = rel ? !ringInTopHalf : false;

  const cardWrap: ViewStyle = cardAtTop
    ? { position: "absolute", top: 12, left: 12, right: 12 }
    : { position: "absolute", bottom: 12, left: 12, right: 12 };

  return (
    <View style={[fill, { zIndex: 60 }]}>
      {/* dimmed backdrop — tap to dismiss. Kept light enough that the
          ringed element stays readable underneath. */}
      <Pressable onPress={close} accessibilityLabel="Close tour" style={[fill, { backgroundColor: "rgba(0,0,0,0.45)" }]} />

      {/* the spotlight ring (only when this step points at something visible) */}
      {rel ? (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: rel.x - RING_PAD,
            top: rel.y - RING_PAD,
            width: rel.w + RING_PAD * 2,
            height: rel.h + RING_PAD * 2,
            borderRadius: 16,
            borderWidth: 3,
            borderColor: theme.today,
            shadowColor: theme.today,
            shadowOpacity: 0.9,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 0 },
          }}
        />
      ) : null}

      {/* coachmark card */}
      <SequenceIn key={step} style={cardWrap}>
        <View
          style={{
            backgroundColor: theme.panel,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.hairlineStrong,
            padding: 18,
            gap: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
              <Text style={{ color: theme.streak, fontSize: 14, fontFamily: FONTS.sansBold }}>▸</Text>
              <Text
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 10,
                  letterSpacing: 1.6,
                  textTransform: "uppercase",
                  color: theme.streak,
                }}
              >
                {s.tag}
              </Text>
            </View>
            <Pressable onPress={close} accessibilityLabel="Skip tour" hitSlop={8}>
              <Text
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 10,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  color: theme.aluDk,
                }}
              >
                Skip
              </Text>
            </Pressable>
          </View>

          <Text style={{ fontFamily: FONTS.sansBold, fontSize: 19, lineHeight: 24, color: theme.print }}>
            {s.title}
          </Text>
          <Text style={{ fontFamily: FONTS.sans, fontSize: 13.5, lineHeight: 20, color: theme.textMuted }}>
            {s.body}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
            <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
              {steps.map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: i === step ? 18 : 7,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: i === step ? theme.today : theme.hairlineStrong,
                  }}
                />
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              {step > 0 ? (
                <Pressable
                  onPress={back}
                  style={{
                    paddingVertical: 9,
                    paddingHorizontal: 14,
                    borderRadius: 9,
                    borderWidth: 1,
                    borderColor: theme.hairlineStrong,
                    backgroundColor: theme.canvas,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 11,
                      letterSpacing: 1.2,
                      textTransform: "uppercase",
                      color: theme.aluDk,
                    }}
                  >
                    Back
                  </Text>
                </Pressable>
              ) : null}
              <Pressable
                onPress={() => (last ? close() : next())}
                style={{ paddingVertical: 9, paddingHorizontal: 16, borderRadius: 9, backgroundColor: theme.streak }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.monoBold,
                    fontSize: 11,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    color: "#0B0C0E",
                  }}
                >
                  {last ? "Got it" : "Next"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SequenceIn>
    </View>
  );
}

/* The collapsed trigger left behind after the tour closes — re-opens it. */
export function WhatsNewPill() {
  const { theme } = useTheme();
  const { open, openTour } = useTour();
  if (open) return null;
  return (
    <Pressable
      onPress={openTour}
      accessibilityLabel="What's new in this version"
      style={{
        position: "absolute",
        left: 12,
        bottom: 76,
        zIndex: 40,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: theme.panel,
        borderWidth: 1,
        borderColor: theme.hairlineStrong,
      }}
    >
      <Text style={{ color: theme.streak, fontSize: 12, fontFamily: FONTS.sansBold }}>✦</Text>
      <Text
        style={{
          fontFamily: FONTS.monoBold,
          fontSize: 10,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          color: theme.aluDk,
        }}
      >
        What's new
      </Text>
    </Pressable>
  );
}
