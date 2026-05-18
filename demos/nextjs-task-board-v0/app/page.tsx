import Link from "next/link";
import Progression from "@/components/Progression";

export default function Home() {
  return (
    <main className="cn-page">
      <div className="cn-eyebrow">State v0 · scaffold</div>
      <h1 className="cn-h1">Cadence — a team task board, scaffolded in Next.js.</h1>
      <p className="cn-lede">
        This is <strong>state v0 of 7</strong>. The shell is up: a Next.js project with the
        App Router, three pages wired via file-based routing, and the shared Cadence look. No
        data yet, no client/server distinction yet, no dynamic routes yet — those land in v1
        through v6. Use this state to see how file structure becomes URL structure.
      </p>

      <Progression current={0} />

      <section className="cn-section">
        <div className="cn-section-tag">01 · The three routes</div>
        <h2 className="cn-section-h">File structure = URL structure</h2>
        <div className="cn-routes">
          <Link href="/" className="cn-route">
            <div className="cn-route-path">/</div>
            <h3 className="cn-route-title">Home</h3>
            <p className="cn-route-desc">
              You are here. The marketing-ish landing page for the demo, anchoring you in
              where this progressive state sits.
            </p>
            <div className="cn-route-file">app/page.tsx</div>
          </Link>
          <Link href="/tasks" className="cn-route">
            <div className="cn-route-path">/tasks</div>
            <h3 className="cn-route-title">Tasks</h3>
            <p className="cn-route-desc">
              The future home of the task list. In v0 it renders an empty state — there is
              no data layer yet. v1 fills it in with the React patterns from Day 1.
            </p>
            <div className="cn-route-file">app/tasks/page.tsx</div>
          </Link>
          <Link href="/about" className="cn-route">
            <div className="cn-route-path">/about</div>
            <h3 className="cn-route-title">About</h3>
            <p className="cn-route-desc">
              What this demo is, what each progressive state adds, and how it maps to the
              Day 3 curriculum.
            </p>
            <div className="cn-route-file">app/about/page.tsx</div>
          </Link>
        </div>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">02 · What v0 shows</div>
        <h2 className="cn-section-h">The shape of an App Router project</h2>
        <div className="cn-bento">
          <div className="cn-tile span-6 row-2 cn-tile-yellow">
            <div className="cn-tile-meta">No router config needed</div>
            <div>
              <h3 className="cn-tile-title" style={{ fontSize: "26px", lineHeight: 1.1 }}>
                Drop a <code>page.tsx</code> into a folder. That folder becomes the URL.
              </h3>
              <p className="cn-tile-sub" style={{ marginTop: "10px", fontSize: "14px" }}>
                <code>app/tasks/page.tsx</code> renders at <code>/tasks</code>. No router
                array, no path strings to keep in sync, no manual matching.
              </p>
            </div>
          </div>
          <div className="cn-tile span-3 cn-tile-green">
            <div className="cn-tile-meta">3 routes</div>
            <div className="cn-tile-num">3</div>
          </div>
          <div className="cn-tile span-3 cn-tile-pink">
            <div className="cn-tile-meta">States to go</div>
            <div className="cn-tile-num">6</div>
          </div>
          <div className="cn-tile span-3">
            <div className="cn-tile-meta">Framework</div>
            <h3 className="cn-tile-title">Next.js 16 · App Router</h3>
            <p className="cn-tile-sub">TypeScript · React 19</p>
          </div>
          <div className="cn-tile span-3">
            <div className="cn-tile-meta">Build target</div>
            <h3 className="cn-tile-title">Static export</h3>
            <p className="cn-tile-sub">Deployed to GitHub Pages. Backend lives in W6.</p>
          </div>
        </div>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">03 · What lands next</div>
        <h2 className="cn-section-h">v1 — the React pattern you already know</h2>
        <div className="cn-bento">
          <div className="cn-tile span-12 cn-tile-dark">
            <div className="cn-tile-meta" style={{ color: "var(--neon)" }}>
              up next
            </div>
            <div>
              <h3 className="cn-tile-title" style={{ fontSize: "22px" }}>
                v1 brings the data layer — but with <code>useState</code> + <code>useEffect</code>, the way you wrote it on Day 1.
              </h3>
              <p className="cn-tile-sub" style={{ marginTop: "8px", fontSize: "14px" }}>
                v1 imports tasks from <code>lib/tasks.ts</code> on the client and renders
                them. v2 then converts the same page to a server component so you can see
                the contrast directly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
