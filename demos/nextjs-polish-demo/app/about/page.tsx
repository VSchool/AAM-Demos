export default function AboutPage() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">About This Demo</h1>
        <p className="page-subtitle">
          What makes a Next.js app feel polished
        </p>
      </div>

      <div className="about-content">
        <p>
          This demo showcases the <strong>four-prompt polish sequence</strong>{" "}
          applied to a Next.js App Router application. Each feature below was
          added incrementally to transform a bare-bones prototype into a
          production-quality experience.
        </p>

        <h2 className="detail-section-title" style={{ marginTop: "1.5rem" }}>
          Polish Features
        </h2>
        <ul className="feature-list">
          <li className="feature-item">
            <span className="feature-icon">1</span>
            <span className="feature-text">
              <strong>Persistent layout</strong> &mdash; Sticky nav with active
              page indicator, shared footer, and consistent spacing across all
              routes.
            </span>
          </li>
          <li className="feature-item">
            <span className="feature-icon">2</span>
            <span className="feature-text">
              <strong>Loading skeletons</strong> &mdash; Animated pulse
              placeholders that match the exact shape of the content they
              replace, preventing layout shift.
            </span>
          </li>
          <li className="feature-item">
            <span className="feature-icon">3</span>
            <span className="feature-text">
              <strong>Error boundaries</strong> &mdash; Graceful error state
              with a retry button. Try it:{" "}
              <code style={{ color: "var(--accent)" }}>
                /items?simulate=error
              </code>
            </span>
          </li>
          <li className="feature-item">
            <span className="feature-icon">4</span>
            <span className="feature-text">
              <strong>404 handling</strong> &mdash; Clean not-found page for
              invalid item IDs with a clear path back to valid content.
            </span>
          </li>
          <li className="feature-item">
            <span className="feature-icon">5</span>
            <span className="feature-text">
              <strong>Visual polish</strong> &mdash; Hover effects, focus rings
              for keyboard navigation, stock badges, smooth transitions, and
              responsive grid layout.
            </span>
          </li>
          <li className="feature-item">
            <span className="feature-icon">6</span>
            <span className="feature-text">
              <strong>Static export</strong> &mdash; The entire app exports as
              static HTML via{" "}
              <code style={{ color: "var(--accent)" }}>output: &apos;export&apos;</code>,
              ready for GitHub Pages deployment.
            </span>
          </li>
        </ul>

        <p style={{ marginTop: "1.5rem" }}>
          Built with <strong>Next.js App Router</strong>,{" "}
          <strong>TypeScript</strong>, and plain CSS custom properties. No
          external dependencies beyond Next.js and React.
        </p>
      </div>
    </>
  );
}
