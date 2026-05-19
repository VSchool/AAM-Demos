"use client";

import { useEffect, useRef, useState } from "react";

type Swatch = {
  token: string;
  hex: string;
  role: string;
};

type Group = {
  heading: string;
  blurb: string;
  swatches: Swatch[];
};

const GROUPS: Group[] = [
  {
    heading: "Canvas",
    blurb: "Violet IS the surface. The brand sits directly on it.",
    swatches: [
      { token: "--canvas",    hex: "#6B50FF", role: "Page background" },
      { token: "--canvas-2",  hex: "#5A3FE0", role: "Sticky nav, sunken surfaces" },
      { token: "--canvas-3",  hex: "#4A33C8", role: "Violet tiles in the bento" },
    ],
  },
  {
    heading: "Paper",
    blurb: "Cream cards sit on the canvas. Ink reads on cream.",
    swatches: [
      { token: "--cream",   hex: "#FFFDF5", role: "Task cards, detail card" },
      { token: "--cream-2", hex: "#F6F2E6", role: "Cream-on-cream contrast" },
      { token: "--ink",     hex: "#0A0A0A", role: "Code blocks, body type on cream" },
      { token: "--ink-2",   hex: "#2A2A2A", role: "Secondary ink" },
    ],
  },
  {
    heading: "Status accents",
    blurb: "Each accent is reserved for one status. Don't borrow them for UI chrome.",
    swatches: [
      { token: "--neon",   hex: "#00FFB2", role: "Done · editing state" },
      { token: "--pink",   hex: "#FF7BF5", role: "Blocked · deleted-in-session" },
      { token: "--yellow", hex: "#FFE066", role: "In progress / doing" },
      { token: "--sky",    hex: "#7DD3FC", role: "Info — used by helper notes" },
    ],
  },
  {
    heading: "Helper palette",
    blurb: "Every teaching/demo annotation shares these tokens — light pale-sky panel.",
    swatches: [
      { token: "--helper-bg",            hex: "#EAF3FB", role: "Panel background" },
      { token: "--helper-accent",        hex: "#0B6FB0", role: "Left border, badge, chevron" },
      { token: "--helper-accent-strong", hex: "#084E7E", role: "Sub-heading + trigger" },
      { token: "--helper-text",          hex: "#0F2A44", role: "Title + body type" },
    ],
  },
];

export default function PaletteToggle() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (buttonRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied((cur) => (cur === hex ? null : cur)), 1100);
    } catch {
      /* clipboard unavailable; ignore */
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`cn-palette-fab${open ? " cn-palette-fab-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="cn-palette-panel"
        aria-label={open ? "Close palette" : "Open palette"}
        title="UI kit palette"
      >
        <span className="cn-palette-fab-dots" aria-hidden="true">
          <span style={{ background: "#6B50FF" }} />
          <span style={{ background: "#FFFDF5" }} />
          <span style={{ background: "#00FFB2" }} />
          <span style={{ background: "#FF7BF5" }} />
        </span>
        <span className="cn-palette-fab-label">{open ? "Close" : "Palette"}</span>
      </button>

      {open && (
        <div
          id="cn-palette-panel"
          ref={panelRef}
          className="cn-palette-panel"
          role="dialog"
          aria-label="UI kit color palette"
        >
          <header className="cn-palette-panel-head">
            <div>
              <span className="cn-palette-panel-eyebrow">UI kit</span>
              <h2 className="cn-palette-panel-title">Cadence palette</h2>
            </div>
            <button
              type="button"
              className="cn-palette-panel-close"
              onClick={() => setOpen(false)}
              aria-label="Close palette"
            >
              ✕
            </button>
          </header>

          <div className="cn-palette-panel-body">
            {GROUPS.map((g) => (
              <section key={g.heading} className="cn-palette-group">
                <h3 className="cn-palette-group-h">{g.heading}</h3>
                <p className="cn-palette-group-blurb">{g.blurb}</p>
                <ul className="cn-palette-swatches">
                  {g.swatches.map((s) => (
                    <li key={s.token}>
                      <button
                        type="button"
                        className="cn-palette-swatch"
                        onClick={() => copy(s.hex)}
                        title={`Copy ${s.hex}`}
                      >
                        <span
                          className="cn-palette-chip"
                          style={{ background: s.hex }}
                          aria-hidden="true"
                        />
                        <span className="cn-palette-meta">
                          <span className="cn-palette-token">{s.token}</span>
                          <span className="cn-palette-hex">
                            {copied === s.hex ? "copied" : s.hex}
                          </span>
                        </span>
                        <span className="cn-palette-role">{s.role}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <p className="cn-palette-panel-foot">
              Click any swatch to copy its hex. Tokens map 1:1 to CSS custom
              properties in <code>app/globals.css</code>.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
