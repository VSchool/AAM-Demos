"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

interface Props {
  className?: string;
  summary: ReactNode;
  children: ReactNode;
  // Optional controlled API — supplied by ExpandableBento when this tile is
  // part of a single-open group. Used standalone, the tile manages its own state.
  isOpen?: boolean;
  onToggle?: () => void;
  isCompact?: boolean;
  viewTransitionName?: string;
}

export default function ExpandableTile({
  className = "",
  summary,
  children,
  isOpen: controlledOpen,
  onToggle,
  isCompact = false,
  viewTransitionName,
}: Props) {
  const [localOpen, setLocalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : localOpen;
  const toggle = isControlled
    ? (onToggle ?? (() => {}))
    : () => setLocalOpen((v) => !v);

  const style: CSSProperties | undefined = viewTransitionName
    ? ({ viewTransitionName } as CSSProperties)
    : undefined;

  const classes = [
    "cn-tile",
    "cn-tile-expandable",
    className,
    open ? "is-open" : "",
    isCompact ? "is-compact" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={style}>
      <button
        type="button"
        className="cn-tile-summary"
        aria-expanded={open}
        onClick={toggle}
      >
        {summary}
        <span className="cn-tile-chevron" aria-hidden="true" />
      </button>
      <div className="cn-tile-body-wrap" aria-hidden={!open} inert={!open}>
        <div className="cn-tile-body">{children}</div>
      </div>
    </div>
  );
}
