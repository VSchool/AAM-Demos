"use client";

// error.tsx — must be a client component. Catches errors thrown during render
// inside this segment (or any nested segment without its own error.tsx).
// Receives the Error + a reset() function that re-attempts the render.

import Link from "next/link";
import { useEffect } from "react";

export default function DetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a real app you'd log this to your observability stack.
    // For the demo we just dump to console so you can see what landed here.
    console.error("[/tasks/[id]/error.tsx] caught:", error);
  }, [error]);

  return (
    <main className="cn-page">
      <div className="cn-breadcrumb">
        <Link href="/tasks" className="cn-breadcrumb-link">
          ← /tasks
        </Link>
        <span className="cn-breadcrumb-sep">·</span>
        <span className="cn-breadcrumb-id">error</span>
      </div>

      <div className="cn-eyebrow" style={{ color: "#FF7BF5" }}>
        /tasks/[id] · error.tsx caught a throw
      </div>
      <h1 className="cn-h1">Something broke on this task.</h1>

      <section
        className="cn-banner cn-banner-pink"
        style={{ marginTop: 24, marginBottom: 28 }}
      >
        <div className="cn-banner-meta">caught by app/tasks/[id]/error.tsx</div>
        <p>
          <strong>Message:</strong>{" "}
          <code>{error.message || "(no message)"}</code>
          {error.digest ? (
            <>
              {" "}
              · <strong>digest:</strong> <code>{error.digest}</code>
            </>
          ) : null}
        </p>
      </section>

      <section className="cn-section">
        <h2 className="cn-section-h">What just happened</h2>
        <p className="cn-aside" style={{ marginBottom: 14 }}>
          A render in the <code>/tasks/[id]</code> segment threw. React unwound that
          tree and rendered this fallback instead, because <code>error.tsx</code> sits
          at the same segment. The rest of the app (nav, footer, layout) stays mounted
          — only the segment that threw is replaced.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
          <button type="button" className="cn-newtask-submit" onClick={reset}>
            ↻ Try again
          </button>
          <Link href="/tasks" className="cn-newtask-cancel">
            Back to /tasks
          </Link>
        </div>
      </section>

      <section className="cn-section">
        <h2 className="cn-section-h">How <code>error.tsx</code> is wired</h2>
        <pre className="cn-code">
          <code>{`// app/tasks/[id]/error.tsx — must be "use client"
"use client";
export default function DetailError({ error, reset }) {
  useEffect(() => log(error), [error]);
  return <Fallback error={error} onRetry={reset} />;
}`}</code>
        </pre>
        <p className="cn-aside">
          Next.js wraps every segment in an error boundary scoped to its{" "}
          <code>error.tsx</code>. <code>reset()</code> re-attempts the render — useful
          when the error came from a transient cause and a retry might succeed.
        </p>
      </section>
    </main>
  );
}
