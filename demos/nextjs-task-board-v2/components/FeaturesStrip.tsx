"use client";

import { useState } from "react";

type Feature = {
  word: string;
  tone: "yellow" | "pink" | "green" | "sky" | "cream" | "orange";
  caption: string;
};

const FEATURES: Feature[] = [
  { word: "Server",  tone: "yellow", caption: "Tasks fetched and rendered on the server. Zero client-side fetching." },
  { word: "Faster",  tone: "pink",   caption: "HTML arrives with the data baked in. No spinner, no flash." },
  { word: "Same UI", tone: "green",  caption: "Identical shape to v1 — the rewrite is invisible to the eye." },
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
