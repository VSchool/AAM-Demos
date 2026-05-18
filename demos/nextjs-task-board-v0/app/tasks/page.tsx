import Link from "next/link";
import Progression from "@/components/Progression";

export const metadata = {
  title: "Tasks · Cadence v0",
  description: "Empty state — the task list has no data layer yet. v1 adds it.",
};

export default function TasksPage() {
  return (
    <main className="cn-page">
      <div className="cn-eyebrow">/tasks · empty state</div>
      <h1 className="cn-h1">No tasks yet.</h1>
      <p className="cn-lede">
        This route renders, the navigation works, the page is part of the static export.
        What's missing is a <strong>data layer</strong> — there's nothing to map over.
        That's intentional in v0: the scaffold is the lesson.
      </p>

      <Progression current={0} />

      <section className="cn-section">
        <div className="cn-empty">
          <div className="cn-empty-glyph" aria-hidden="true">
            ∅
          </div>
          <h3>This list is waiting on v1.</h3>
          <p>
            v1 imports a typed task array from <code className="cn-mono">lib/tasks.ts</code>
            {" "}and renders it here using <code className="cn-mono">useState</code> +{" "}
            <code className="cn-mono">useEffect</code> — the same client-side pattern you
            wrote on Day 1 of this week. v2 then rewrites the same page as a server
            component so the difference is impossible to miss.
          </p>
          <div className="cn-empty-note">scaffold complete · awaiting data</div>
        </div>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">file-based routing recap</div>
        <h2 className="cn-section-h">How this URL was wired</h2>
        <div className="cn-bento">
          <div className="cn-tile span-6 row-2">
            <div className="cn-tile-meta">app/tasks/page.tsx</div>
            <div>
              <h3 className="cn-tile-title" style={{ fontSize: "20px" }}>
                One file, one route.
              </h3>
              <p className="cn-tile-sub" style={{ marginTop: "10px", fontSize: "13.5px" }}>
                The folder name <code>tasks</code> becomes the URL segment.{" "}
                <code>page.tsx</code> is the convention that says "this folder is a
                navigable page." No imports, no registration, no router config.
              </p>
              <p className="cn-tile-sub" style={{ marginTop: "8px", fontSize: "13.5px" }}>
                v4 will add <code>app/tasks/[id]/page.tsx</code> — same pattern, with a
                bracketed segment for the dynamic detail route.
              </p>
            </div>
          </div>
          <div className="cn-tile span-6 cn-tile-violet">
            <div className="cn-tile-meta">From the curriculum</div>
            <div>
              <h3 className="cn-tile-title" style={{ fontSize: "18px" }}>
                Direct AI to scaffold a Next.js app with TypeScript, then walk the file
                structure compared to a plain React app.
              </h3>
              <p className="cn-tile-sub" style={{ marginTop: "8px", fontSize: "13px" }}>
                — W5D3S1 · Block 6 (scaffold code-along)
              </p>
            </div>
          </div>
          <div className="cn-tile span-6 cn-tile-green">
            <div className="cn-tile-meta">Try this</div>
            <div>
              <h3 className="cn-tile-title">Visit the other routes</h3>
              <p className="cn-tile-sub" style={{ marginTop: "6px" }}>
                <Link href="/" style={{ textDecoration: "underline" }}>Home</Link> ·{" "}
                <Link href="/about" style={{ textDecoration: "underline" }}>About</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
