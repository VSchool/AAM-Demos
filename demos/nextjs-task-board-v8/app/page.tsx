import Link from "next/link";
import FeaturesStrip from "@/components/FeaturesStrip";

export default function Home() {
  return (
    <main className="cn-page">
      <div className="cn-eyebrow">Cadence · task board</div>
      <h1 className="cn-h1">Plan, sort, and ship the work.</h1>
      <p className="cn-lede">
        Cadence is a lightweight task board for engineering teams — board and
        list views, drag-to-reorder, fast filters, and a detail page for every
        ticket. Sign in, drop a task on the board, drag it across columns, click
        in to edit. Your board is saved to your account and follows you to any
        device.
      </p>

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "44px",
        }}
      >
        <Link
          href="/tasks"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "var(--neon)",
            color: "var(--ink)",
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "15px",
            letterSpacing: "0.01em",
            padding: "12px 22px 12px 18px",
            clipPath:
              "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)",
          }}
        >
          Open the board →
        </Link>
        <Link
          href="/compare"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--on-canvas-muted)",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            padding: "12px 16px",
            border: "1px solid var(--hairline)",
          }}
        >
          What changed: V7 → V8 →
        </Link>
      </div>

      <section className="cn-section cn-features-section">
        <div className="cn-section-tag">01 · what you can do here</div>
        <h2 className="cn-section-h">Real board. No screenshots.</h2>
        <FeaturesStrip />
      </section>

      <section className="cn-section">
        <div className="cn-section-tag">02 · good to know</div>
        <h2 className="cn-section-h">Your board follows you everywhere.</h2>
        <div className="cn-bento">
          <div className="cn-tile span-12">
            <div className="cn-tile-meta">heads up</div>
            <div>
              <h3 className="cn-tile-title" style={{ fontSize: "18px" }}>
                Create an account and your tasks are saved to the cloud — log in
                on another browser or device and the same board is waiting for
                you.
              </h3>
              <p
                className="cn-tile-sub"
                style={{ marginTop: "8px", fontSize: "14px" }}
              >
                Cadence stores your tasks in a database behind a real login, not
                in this browser. That&apos;s the difference a backend makes — and
                you can see it side by side on the{" "}
                <Link
                  href="/compare"
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  V7 → V8 walkthrough
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
