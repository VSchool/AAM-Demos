import Link from "next/link";

export const metadata = {
  title: "About · Cadence",
  description:
    "Cadence is a lightweight task board for engineering teams — board and list views, fast filters, and a detail page for every ticket.",
};

export default function AboutPage() {
  return (
    <main className="cn-page">
      <div className="cn-eyebrow">/about · Cadence</div>
      <h1 className="cn-h1">A task board that stays out of the way.</h1>
      <p className="cn-lede">
        Cadence is a lightweight task board for engineering teams. Plan work
        across six status columns, filter and sort in a tap, and open any ticket
        to its own shareable detail page. No setup, no clutter — just the board
        and the work.
      </p>

      <section className="cn-section">
        <div className="cn-section-tag">who it&apos;s for</div>
        <h2 className="cn-section-h">Small teams and solo builders.</h2>
        <p
          className="cn-tile-sub"
          style={{ fontSize: "14px", lineHeight: 1.6, maxWidth: "62ch" }}
        >
          Cadence is for people who want to see the state of their work at a
          glance, without the overhead of a heavyweight project tool. Drop a task
          on the board, move it across columns as it progresses, and click in
          when you need the detail.
        </p>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">what&apos;s inside</div>
        <h2 className="cn-section-h">Everything you need to run a board.</h2>
        <div className="cn-bento">
          <div className="cn-tile span-6 cn-tile-yellow">
            <div className="cn-tile-meta">board &amp; list</div>
            <h3 className="cn-tile-title">Six status columns.</h3>
            <p className="cn-tile-sub" style={{ marginTop: "6px" }}>
              See every task by state at a glance, or switch to a list when you
              want the long view.
            </p>
          </div>
          <div className="cn-tile span-6 cn-tile-pink">
            <div className="cn-tile-meta">create · edit · delete</div>
            <h3 className="cn-tile-title">Full control, in place.</h3>
            <p className="cn-tile-sub" style={{ marginTop: "6px" }}>
              Add a task without leaving the board, edit it on its detail page,
              delete it with a confirm.
            </p>
          </div>
          <div className="cn-tile span-6 cn-tile-green">
            <div className="cn-tile-meta">filter &amp; sort</div>
            <h3 className="cn-tile-title">Find it fast.</h3>
            <p className="cn-tile-sub" style={{ marginTop: "6px" }}>
              Tap a status chip to filter; sort by priority, due date, or recent
              activity.
            </p>
          </div>
          <div className="cn-tile span-6">
            <div className="cn-tile-meta">detail pages</div>
            <h3 className="cn-tile-title">One URL per task.</h3>
            <p className="cn-tile-sub" style={{ marginTop: "6px" }}>
              Every ticket has its own shareable, deep-linkable page with inline
              editing.
            </p>
          </div>
        </div>
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">how it works</div>
        <h2 className="cn-section-h">Runs entirely in your browser.</h2>
        <p
          className="cn-tile-sub"
          style={{ fontSize: "14px", lineHeight: 1.6, maxWidth: "62ch" }}
        >
          Your board is saved on this device, so it&apos;s waiting for you when
          you come back. There&apos;s no account to set up to start planning —
          open the board and go.
        </p>
      </section>

      <section className="cn-section">
        <Link href="/tasks" className="cn-back-link">
          Open the board →
        </Link>
      </section>
    </main>
  );
}
