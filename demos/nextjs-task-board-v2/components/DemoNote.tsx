"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function DemoNote({
  title = "Demo note",
  size = "default",
  children,
}: {
  title?: string;
  size?: "default" | "small";
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [closedWidth, setClosedWidth] = useState<number | undefined>();

  useIsoLayoutEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const measure = () => {
      const prev = el.style.width;
      el.style.width = "max-content";
      // sub-pixel ceil + small buffer absorbs font hinting / late font swaps
      const w = Math.ceil(el.getBoundingClientRect().width) + 4;
      el.style.width = prev;
      setClosedWidth(w);
    };

    measure();

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(measure).catch(() => {});
      const onDone = () => measure();
      document.fonts.addEventListener?.("loadingdone", onDone);
      window.addEventListener("resize", measure);
      return () => {
        document.fonts.removeEventListener?.("loadingdone", onDone);
        window.removeEventListener("resize", measure);
      };
    }

    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const style: CSSProperties = {
    width: open ? "100%" : closedWidth ? `${closedWidth}px` : "fit-content",
  };

  return (
    <div
      className={`cn-demo-note${size === "small" ? " cn-demo-note-sm" : ""}`}
      data-open={open}
      style={style}
    >
      <button
        ref={triggerRef}
        type="button"
        className="cn-demo-note-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="cn-demo-note-body"
      >
        <span className="cn-demo-note-glyph" aria-hidden="true">
          <span className="cn-demo-note-glyph-bar cn-demo-note-glyph-bar-h" />
          <span className="cn-demo-note-glyph-bar cn-demo-note-glyph-bar-v" />
        </span>
        <span className="cn-demo-note-title">{title}</span>
      </button>

      <div
        id="cn-demo-note-body"
        className="cn-demo-note-body-wrap"
        aria-hidden={!open}
      >
        <div className="cn-demo-note-body">
          <div className="cn-demo-note-body-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}
