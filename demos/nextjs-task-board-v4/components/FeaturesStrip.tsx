"use client";

import { useState } from "react";

type Feature = {
  word: string;
  tone: "yellow" | "pink" | "green" | "sky" | "cream" | "orange";
  caption: string;
};

const FEATURES: Feature[] = [
  { word: "Detail",    tone: "yellow", caption: "One URL per task. Shareable, deep-linkable, server-rendered." },
  { word: "Dynamic",   tone: "pink",   caption: "app/tasks/[id]/page.tsx — the bracket is the URL parameter." },
  { word: "Read-only", tone: "green",  caption: "v4 ships the route. v5 makes the card editable." },
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
