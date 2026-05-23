/* ExpandableBento (guideline §3.7) — a container that enforces
   single-open-at-a-time across its ExpandableTile children. It injects
   isOpen / onToggle / isCompact into each tile via cloneElement, the
   way the reference Cadence bento does. The chassis the version
   deep-dives live inside. */

import {
  Children,
  cloneElement,
  isValidElement,
  useState,
  type ReactNode,
} from "react";
import { View } from "react-native";

export default function ExpandableBento({ children }: { children: ReactNode }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const tiles = Children.toArray(children);

  return (
    <View style={{ gap: 10 }}>
      {tiles.map((tile, i) => {
        if (!isValidElement(tile)) return tile;
        const isOpen = openIdx === i;
        const isCompact = openIdx !== null && openIdx !== i;
        return cloneElement(tile as React.ReactElement<Record<string, unknown>>, {
          key: i,
          isOpen,
          isCompact,
          onToggle: () => setOpenIdx(isOpen ? null : i),
        });
      })}
    </View>
  );
}
