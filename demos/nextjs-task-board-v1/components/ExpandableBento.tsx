"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

interface Props {
  className?: string;
  children: ReactNode;
}

export default function ExpandableBento({ className = "", children }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const tiles = Children.toArray(children);

  const setOpen = (next: number | null) => {
    if (typeof document !== "undefined" && document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => setOpenIdx(next));
      });
    } else {
      setOpenIdx(next);
    }
  };

  return (
    <div
      className={`cn-bento cn-bento-expandable ${className}${openIdx !== null ? " has-open" : ""}`}
    >
      {tiles.map((tile, i) => {
        if (!isValidElement(tile)) return tile;
        const isOpen = openIdx === i;
        const isCompact = openIdx !== null && openIdx !== i;
        return cloneElement(tile as React.ReactElement<Record<string, unknown>>, {
          isOpen,
          isCompact,
          onToggle: () => setOpen(isOpen ? null : i),
          viewTransitionName: `bento-tile-${i}`,
        });
      })}
    </div>
  );
}
