"use client";

import { useState } from "react";

function Bomb(): React.ReactNode {
  throw new Error(
    "Intentional throw from <TriggerError /> · this is the v6 demo for error.tsx · click 'Try again' on the fallback to reset.",
  );
}

export default function TriggerError() {
  const [armed, setArmed] = useState(false);

  if (armed) {
    return <Bomb />;
  }

  return (
    <aside className="cn-v6-callout" aria-label="What v6 adds to this route">
      <div className="cn-v6-callout-head">
        <span className="cn-v6-callout-badge">New in v6</span>
        <span className="cn-v6-callout-file">app/tasks/[id]/error.tsx</span>
      </div>
      <h2 className="cn-v6-callout-title">Route-segment error boundary</h2>
      <p className="cn-v6-callout-body">
        Throw inside this segment and React unwinds it, rendering{" "}
        <code>error.tsx</code> instead of this page. The nav, footer, and root
        layout stay mounted — only the segment is replaced. Click the{" "}
        <em>Try again</em> button on the fallback to reset.
      </p>
      <div className="cn-v6-callout-actions">
        <button
          type="button"
          className="cn-v6-callout-trigger"
          onClick={() => setArmed(true)}
        >
          Throw error → trigger error.tsx
        </button>
      </div>
    </aside>
  );
}
