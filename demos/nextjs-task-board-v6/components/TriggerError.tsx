"use client";

import { useState } from "react";

function Bomb(): React.ReactNode {
  // Render-time throw — caught by the nearest error boundary, which for
  // pages under /tasks/[id] is app/tasks/[id]/error.tsx.
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
    <section className="cn-detail-actions" style={{ borderColor: "rgba(255,123,245,0.30)" }}>
      <div className="cn-detail-live-state">
        <span className="cn-detail-live-tag" style={{ color: "#FF7BF5" }}>
          v6 demo
        </span>
        <span className="cn-flag cn-flag-blocked">error.tsx</span>
      </div>
      <h2 className="cn-detail-h2">Trigger the error boundary</h2>
      <p className="cn-aside" style={{ fontSize: 13, marginBottom: 6 }}>
        Click the button below to throw inside this segment. React unwinds the segment
        tree and renders <code>app/tasks/[id]/error.tsx</code> instead of this page.
        The nav, footer, and root layout stay mounted — only the segment is replaced.
      </p>
      <div className="cn-detail-action-buttons">
        <button
          type="button"
          className="cn-newtask-danger"
          onClick={() => setArmed(true)}
        >
          💥 Throw and let error.tsx catch it
        </button>
      </div>
    </section>
  );
}
