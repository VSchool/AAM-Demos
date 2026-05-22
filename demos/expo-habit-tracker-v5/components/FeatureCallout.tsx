/* FeatureCallout — Pulse's inline "how it works + recreate it" teaching
   popover (the W5D4 native analog of Cadence's web FeatureCallout). A
   small ⓘ trigger opens a popover that explains a feature in plain
   language and hands the student a copy-paste PROMPT to recreate that
   functionality in their OWN app, with a one-tap Copy button.

   Why it looks the way it does:
   • Rides the HELPER palette (guideline §3.11) so it reads as teaching
     chrome and never borrows a reserved status color (§7). Constant
     across dark/light, like DemoNote.
   • The popover is a transparent <Modal> anchored near the trigger via
     measureInWindow — robust on web AND in Expo Go, with no parent
     overflow-clipping or z-index fights. (Cadence's CSS side-anchored
     popover is a web-only luxury; a measured Modal is the RN-correct
     equivalent.)
   • The entrance is a Reanimated scale/opacity pop, GATED by
     useReducedMotion() like every Pulse animation — instant when on.
   • Copy uses lib/clipboard.ts (expo-clipboard), so the prompt copies on
     web and on a phone. */

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { FONTS, HELPER } from "@/theme/tokens";
import { copyText } from "@/lib/clipboard";

type Anchor = { x: number; y: number; w: number; h: number };

const CARD_W = 300;
const EDGE = 16; // min gap from screen edges

export default function FeatureCallout({
  title,
  description,
  prompt,
  promptLabel = "recreate it in your own app",
  triggerLabel,
}: {
  title: string;
  description: ReactNode;
  prompt?: string;
  promptLabel?: string;
  triggerLabel?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const triggerRef = useRef<View>(null);

  const onOpen = () => {
    const node = triggerRef.current;
    // Measure the trigger in window coords so the Modal can anchor the card
    // beside it. If measure isn't available, fall back to a centred card.
    if (node?.measureInWindow) {
      node.measureInWindow((x, y, w, h) => {
        setAnchor({ x, y, w, h });
        setOpen(true);
      });
    } else {
      setAnchor(null);
      setOpen(true);
    }
  };

  return (
    <View ref={triggerRef} collapsable={false} style={{ alignSelf: "flex-start" }}>
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={`Explain: ${title}`}
        accessibilityState={{ expanded: open }}
        hitSlop={8}
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: open ? HELPER.accent : "rgba(11,111,176,0.5)",
          backgroundColor: open ? HELPER.accent : HELPER.bg,
        }}
      >
        {triggerLabel ?? (
          <Text
            style={{
              fontFamily: FONTS.sansBold,
              fontSize: 12,
              lineHeight: 14,
              color: open ? "#FFFFFF" : HELPER.accentStrong,
            }}
          >
            i
          </Text>
        )}
      </Pressable>

      {open ? (
        <Modal transparent visible animationType="none" onRequestClose={() => setOpen(false)}>
          <CalloutPopover
            anchor={anchor}
            title={title}
            description={description}
            prompt={prompt}
            promptLabel={promptLabel}
            onClose={() => setOpen(false)}
          />
        </Modal>
      ) : null}
    </View>
  );
}

function CalloutPopover({
  anchor,
  title,
  description,
  prompt,
  promptLabel,
  onClose,
}: {
  anchor: Anchor | null;
  title: string;
  description: ReactNode;
  prompt?: string;
  promptLabel: string;
  onClose: () => void;
}) {
  const { width: winW, height: winH } = useWindowDimensions();
  const reduce = useReducedMotion();
  const p = useSharedValue(reduce ? 1 : 0);
  const [copied, setCopied] = useState(false);

  // Entrance: pop in (gated). Mounts fresh on each open, so it replays.
  useEffect(() => {
    p.value = reduce ? 1 : withTiming(1, { duration: 150 });
  }, [p, reduce]);

  // Escape closes on web (mirrors Cadence's keydown handler).
  useEffect(() => {
    if (typeof document === "undefined") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const cardW = Math.min(CARD_W, winW - EDGE * 2);
  // Open below the trigger by default; flip above if it sits low on screen.
  const placeAbove = anchor ? anchor.y + anchor.h + 8 > winH * 0.62 : false;
  const left = anchor
    ? Math.max(EDGE, Math.min(anchor.x, winW - cardW - EDGE))
    : (winW - cardW) / 2;
  const cardPos = anchor
    ? placeAbove
      ? { bottom: winH - anchor.y + 8, left }
      : { top: anchor.y + anchor.h + 8, left }
    : { top: winH / 2 - 130, left };

  const aStyle = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [
      { translateY: (1 - p.value) * (placeAbove ? 4 : -4) },
      { scale: 0.97 + p.value * 0.03 },
    ],
  }));

  const onCopy = async () => {
    if (!prompt) return;
    if (await copyText(prompt)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    // Transparent backdrop — tap anywhere outside the card to close.
    <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Close">
      <Animated.View
        style={[
          {
            position: "absolute",
            width: cardW,
            maxHeight: winH * 0.72,
            backgroundColor: HELPER.bg,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(8,78,126,0.18)",
            shadowColor: "#000",
            shadowOpacity: 0.22,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 12 },
            elevation: 12,
          },
          cardPos,
          aStyle,
        ]}
      >
        {/* Inner Pressable swallows taps so they don't reach the backdrop. */}
        <Pressable onPress={() => {}} style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.mono,
                fontSize: 9.5,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                color: HELPER.accent,
              }}
            >
              how it works
            </Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" hitSlop={8}>
              <Text style={{ fontSize: 18, lineHeight: 18, color: HELPER.accentStrong }}>×</Text>
            </Pressable>
          </View>

          <Text
            style={{
              fontFamily: FONTS.sansBold,
              fontSize: 15.5,
              lineHeight: 21,
              color: HELPER.text,
              marginBottom: 6,
            }}
          >
            {title}
          </Text>

          {typeof description === "string" ? (
            <Text style={{ fontFamily: FONTS.sans, fontSize: 13, lineHeight: 20, color: HELPER.textMuted }}>
              {description}
            </Text>
          ) : (
            description
          )}

          {prompt ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  marginTop: 14,
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 9.5,
                    letterSpacing: 1.4,
                    textTransform: "uppercase",
                    color: HELPER.accent,
                    flexShrink: 1,
                  }}
                >
                  {promptLabel}
                </Text>
                <Pressable
                  onPress={onCopy}
                  accessibilityRole="button"
                  accessibilityLabel="Copy prompt to clipboard"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    backgroundColor: copied ? HELPER.accent : "rgba(11,111,176,0.12)",
                    borderWidth: 1,
                    borderColor: "rgba(11,111,176,0.3)",
                    borderRadius: 5,
                    paddingVertical: 3,
                    paddingHorizontal: 9,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 10,
                      letterSpacing: 0.6,
                      textTransform: "uppercase",
                      color: copied ? "#FFFFFF" : HELPER.accentStrong,
                    }}
                  >
                    {copied ? "Copied ✓" : "⧉ Copy"}
                  </Text>
                </Pressable>
              </View>

              <View
                style={{
                  backgroundColor: "#0E1014",
                  borderRadius: 7,
                  borderWidth: 1,
                  borderColor: "#23262B",
                  overflow: "hidden",
                }}
              >
                <ScrollView style={{ maxHeight: 220 }} contentContainerStyle={{ padding: 12 }}>
                  <Text
                    selectable
                    style={{ fontFamily: FONTS.mono, fontSize: 11.5, lineHeight: 18, color: "#CFE6F5" }}
                  >
                    {prompt}
                  </Text>
                </ScrollView>
              </View>
            </>
          ) : null}
        </Pressable>
      </Animated.View>
    </Pressable>
  );
}
