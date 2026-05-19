"use client";

import { useState } from "react";

type Feature = {
  word: string;
  tone: "yellow" | "pink" | "green" | "sky" | "cream" | "orange";
  caption: string;
};

const FEATURES: Feature[] = [
  { word: "Filter", tone: "yellow", caption: "Tap a status chip — instant filter across the board." },
  { word: "Sort",   tone: "pink",   caption: "Priority, due date, recently updated. Switch live." },
  { word: "View",   tone: "green",  caption: "Toggle between list and board layouts — one click, no reload." },
];

export default function FeaturesStrip() {
  const [active, setActive] = useState(0);

  return (
    <ul className="cn-feature-words" role="tablist" aria-label="Feature list">
      {FEATURES.map((f, i) => {
        const isActive = active === i;
        return (
          <li
            key={f.word}
            className="cn-feature-row"
            data-active={isActive}
            data-tone={f.tone}
          >
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`cn-feature-caption-${i}`}
              data-tone={f.tone}
              data-active={isActive}
              className="cn-feature-word"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <span className="cn-feature-word-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="cn-feature-word-text">{f.word}</span>
            </button>
            <div
              id={`cn-feature-caption-${i}`}
              className="cn-feature-caption-wrap"
              aria-hidden={!isActive}
            >
              <p className="cn-feature-caption">{f.caption}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
