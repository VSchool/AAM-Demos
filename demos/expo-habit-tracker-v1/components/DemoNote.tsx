/* DemoNote (guideline §3.8) — the animated "where the edits live"
   affordance. Collapsed it's a compact pill showing just the title;
   tap to expand and reveal the explanation. Runs on the HELPER
   palette so teaching annotations never compete with the instrument.
   Dropped inline next to each new file/concept a version introduces. */

import { useState, type ReactNode } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  Text,
  UIManager,
  View,
} from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { FONTS, HELPER } from "@/theme/tokens";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function DemoNote({
  title = "Where the edits live",
  meta,
  children,
}: {
  title?: string;
  meta?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  const toggle = () => {
    // Guideline §0 non-negotiable: skip the layout tween when the user
    // prefers reduced motion. State still flips; the change is instant.
    if (!reduce) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  };

  return (
    <View
      style={{
        alignSelf: "flex-start",
        maxWidth: "100%",
        marginVertical: 12,
        backgroundColor: HELPER.bg,
        borderRadius: open ? 8 : 999,
        borderLeftWidth: open ? 4 : 0,
        borderLeftColor: HELPER.accentStrong,
        overflow: "hidden",
      }}
    >
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ color: HELPER.accent, fontFamily: FONTS.sansBold, fontSize: 15 }}>
          {open ? "–" : "+"}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.sansSemi,
            fontSize: 14.5,
            color: HELPER.text,
          }}
        >
          {title}
        </Text>
      </Pressable>

      {open ? (
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            paddingTop: 2,
            borderTopWidth: 1,
            borderTopColor: "rgba(11,111,176,0.18)",
            gap: 8,
          }}
        >
          {meta ? (
            <Text
              style={{
                fontFamily: FONTS.mono,
                fontSize: 10.5,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                color: HELPER.accentStrong,
                marginTop: 10,
              }}
            >
              {meta}
            </Text>
          ) : null}
          {typeof children === "string" ? (
            <Text
              style={{
                fontFamily: FONTS.sans,
                fontSize: 13.5,
                lineHeight: 21,
                color: HELPER.textMuted,
              }}
            >
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      ) : null}
    </View>
  );
}

/* Body text styled for the helper palette — wrap any rich (mixed
   string + NoteCode) DemoNote body in this so raw strings stay inside
   a <Text> and the ink reads on the pale-blue panel in both themes. */
export function NoteText({ children }: { children: ReactNode }) {
  return (
    <Text
      style={{
        fontFamily: FONTS.sans,
        fontSize: 13.5,
        lineHeight: 21,
        color: HELPER.textMuted,
      }}
    >
      {children}
    </Text>
  );
}

/* Mono code line styled for the helper palette, for use inside DemoNote. */
export function NoteCode({ children }: { children: ReactNode }) {
  return (
    <Text
      style={{
        fontFamily: FONTS.mono,
        fontSize: 12.5,
        color: HELPER.accentStrong,
        backgroundColor: "rgba(11,111,176,0.10)",
      }}
    >
      {" "}
      {children}{" "}
    </Text>
  );
}
