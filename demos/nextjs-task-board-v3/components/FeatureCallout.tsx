"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  title: string;
  description: ReactNode;
  snippet?: string;
  /** Label rendered inside the trigger button. Defaults to ⓘ. */
  triggerLabel?: ReactNode;
  /** Which side of the trigger the popover should open toward. */
  side?: "top" | "right" | "bottom" | "left";
  /** Extra className for the outer wrapper (e.g. positioning). */
  className?: string;
}

export default function FeatureCallout({
  title,
  description,
  snippet,
  triggerLabel,
  side = "bottom",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleCopy = async () => {
    if (!snippet) return;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable; silently no-op
    }
  };

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (popoverRef.current?.contains(e.target as Node)) return;
      if (triggerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span className={`fc-root ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        className={`fc-trigger ${open ? "is-open" : ""}`}
        aria-expanded={open}
        aria-label={`Explain: ${title}`}
        onClick={() => setOpen((v) => !v)}
      >
        {triggerLabel ?? (
          <svg
            viewBox="0 0 16 16"
            width="12"
            height="12"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M8 5.2 V5.2 M7.2 7 h0.8 v3.6 h0.8"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {open && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label={title}
          className={`fc-popover fc-popover-${side}`}
        >
          <div className="fc-popover-head">
            <span className="fc-popover-eyebrow">how it works</span>
            <button
              type="button"
              className="fc-close"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="fc-title">{title}</div>
          <div className="fc-description">{description}</div>
          {snippet && (
            <>
              <div className="fc-label-row">
                <span className="fc-label">recreate it in your own app</span>
                <button
                  type="button"
                  className="fc-copy"
                  onClick={handleCopy}
                  aria-label="Copy to clipboard"
                >
                  {copied ? (
                    "Copied"
                  ) : (
                    <>
                      <svg
                        viewBox="0 0 16 16"
                        width="11"
                        height="11"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <rect
                          x="4.5"
                          y="4.5"
                          width="8"
                          height="9"
                          rx="1.2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.3"
                        />
                        <path
                          d="M3.5 11.5 V3.2 a0.8 0.8 0 0 1 0.8 -0.8 H10.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="fc-snippet">{snippet}</pre>
            </>
          )}
        </div>
      )}

      <FeatureCalloutStyles />
    </span>
  );
}

function FeatureCalloutStyles() {
  return (
    <style>{`
.fc-root {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  z-index: 1;
}

.fc-trigger {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.18);
  background: rgba(255, 253, 245, 0.92);
  color: #0F0D14;
  cursor: pointer;
  line-height: 1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
  transition: transform 160ms ease, background 160ms ease, box-shadow 160ms ease;
}
.fc-trigger:hover {
  background: #00FFB2;
  color: #002418;
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.18);
}
.fc-trigger:focus-visible {
  outline: 2px solid #00FFB2;
  outline-offset: 2px;
}
.fc-trigger.is-open {
  background: #00FFB2;
  color: #002418;
  border-color: #00FFB2;
}

.fc-popover {
  position: absolute;
  width: min(320px, calc(100vw - 32px));
  padding: 14px 16px 16px;
  background: #FFFDF5;
  color: #0F0D14;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
  font-family: var(--font-sans, system-ui, sans-serif);
  font-size: 13.5px;
  line-height: 1.5;
  z-index: 1000;
  animation: fc-pop 140ms ease-out;
  transform-origin: top left;
}
.fc-popover-bottom { top: calc(100% + 8px); left: 0; transform-origin: top left; }
.fc-popover-top    { bottom: calc(100% + 8px); left: 0; transform-origin: bottom left; }
.fc-popover-right  { left: calc(100% + 8px); top: 0; transform-origin: top left; }
.fc-popover-left   { right: calc(100% + 8px); top: 0; transform-origin: top right; }

@keyframes fc-pop {
  from { opacity: 0; transform: translateY(-4px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .fc-popover { animation: none; }
  .fc-trigger { transition: none; }
}

.fc-popover-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}
.fc-popover-eyebrow {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 9.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.55);
}
.fc-close {
  appearance: none;
  background: transparent;
  border: 0;
  font-size: 18px;
  line-height: 1;
  padding: 0 4px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.55);
}
.fc-close:hover { color: #0F0D14; }

.fc-title {
  font-weight: 700;
  font-size: 15px;
  line-height: 1.3;
  margin-bottom: 6px;
}
.fc-description {
  font-size: 13px;
  line-height: 1.55;
  color: rgba(0, 0, 0, 0.78);
}
.fc-description code {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 12px;
  background: rgba(0, 0, 0, 0.06);
  padding: 1px 5px;
  border-radius: 3px;
}

.fc-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
  margin-bottom: 6px;
}
.fc-label {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 9.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.55);
}
.fc-copy {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.72);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  padding: 3px 8px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}
.fc-copy:hover {
  background: #00FFB2;
  color: #002418;
  border-color: #00FFB2;
}
.fc-copy:focus-visible {
  outline: 2px solid #00FFB2;
  outline-offset: 2px;
}
.fc-snippet {
  margin: 0;
  padding: 10px 12px;
  background: #0F0D14;
  color: #FFFDF5;
  border-radius: 6px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11.5px;
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  max-height: 240px;
  overflow-y: auto;
}

@media (max-width: 600px) {
  .fc-popover-right { left: 0; top: calc(100% + 8px); }
  .fc-popover-left  { right: 0; top: calc(100% + 8px); }
}
    `}</style>
  );
}
