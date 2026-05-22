/* ExpandableTile (guideline §3.7) — one cell of an ExpandableBento.
   Controlled by the parent (single-open-at-a-time) or self-managed
   when used standalone. Tap the summary to morph open and reveal the
   body. Closed tiles dim slightly when a sibling is open. */

import { useState, type ReactNode } from "react";
import { LayoutAnimation, Pressable, Text, View } from "react-native";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";

export interface ExpandableTileProps {
  summary: ReactNode;
  children: ReactNode;
  /** injected by ExpandableBento */
  isOpen?: boolean;
  onToggle?: () => void;
  isCompact?: boolean;
}

export default function ExpandableTile({
  summary,
  children,
  isOpen,
  onToggle,
  isCompact = false,
}: ExpandableTileProps) {
  const { theme } = useTheme();
  const [localOpen, setLocalOpen] = useState(false);
  const controlled = isOpen !== undefined;
  const open = controlled ? isOpen : localOpen;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (controlled) onToggle?.();
    else setLocalOpen((v) => !v);
  };

  return (
    <View
      style={{
        backgroundColor: theme.panel,
        borderWidth: 1,
        borderColor: open ? theme.hairlineStrong : theme.hairline,
        borderRadius: 12,
        overflow: "hidden",
        opacity: isCompact ? 0.6 : 1,
      }}
    >
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: !!open }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: 16,
        }}
      >
        <View style={{ flex: 1 }}>{summary}</View>
        <Text
          style={{
            fontFamily: FONTS.sansBold,
            fontSize: 16,
            color: theme.aluDk,
            transform: [{ rotate: open ? "90deg" : "0deg" }],
          }}
        >
          ›
        </Text>
      </Pressable>
      {open ? (
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            borderTopWidth: 1,
            borderTopColor: theme.hairline,
            paddingTop: 14,
            gap: 10,
          }}
        >
          {children}
        </View>
      ) : null}
    </View>
  );
}
