// loading.tsx — renders during navigation to /tasks/[id] while React
// resolves the server component. Co-located with the route segment;
// no import needed in page.tsx. Next.js wraps the segment in Suspense
// automatically and uses this as the fallback.

export default function Loading() {
  return (
    <main className="cn-page">
      <div className="cn-breadcrumb">
        <span className="cn-breadcrumb-link">← /tasks</span>
        <span className="cn-breadcrumb-sep">·</span>
        <span className="cn-skel" style={{ width: 72, height: 11 }} />
      </div>
      <div className="cn-eyebrow">/tasks/[id] · loading…</div>
      <div className="cn-skel" style={{ width: 110, height: 22, marginBottom: 14 }} />
      <div
        className="cn-skel"
        style={{ width: "70%", height: 38, marginBottom: 28 }}
      />

      <div className="cn-detail-layout">
        <article className="cn-detail-main">
          <section>
            <div
              className="cn-skel"
              style={{ width: 120, height: 13, marginBottom: 12 }}
            />
            <div className="cn-skel" style={{ width: "92%", height: 14, marginBottom: 8 }} />
            <div className="cn-skel" style={{ width: "84%", height: 14, marginBottom: 8 }} />
            <div className="cn-skel" style={{ width: "55%", height: 14 }} />
          </section>
          <section>
            <div
              className="cn-skel"
              style={{ width: 160, height: 13, marginBottom: 12 }}
            />
            <div className="cn-skel" style={{ width: "100%", height: 14, marginBottom: 8 }} />
            <div className="cn-skel" style={{ width: "88%", height: 14, marginBottom: 8 }} />
            <div className="cn-skel" style={{ width: "70%", height: 14 }} />
          </section>
        </article>
        <aside className="cn-detail-side">
          <div
            className="cn-skel"
            style={{
              width: 60,
              height: 10,
              marginBottom: 12,
              background:
                "linear-gradient(90deg, rgba(255,253,245,0.06) 0%, rgba(255,253,245,0.14) 50%, rgba(255,253,245,0.06) 100%)",
            }}
          />
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                gap: 12,
                padding: "8px 0",
                borderBottom: "1px solid rgba(255,253,245,0.06)",
              }}
            >
              <span
                className="cn-skel"
                style={{
                  height: 10,
                  background:
                    "linear-gradient(90deg, rgba(255,253,245,0.06) 0%, rgba(255,253,245,0.14) 50%, rgba(255,253,245,0.06) 100%)",
                }}
              />
              <span
                className="cn-skel"
                style={{
                  height: 12,
                  background:
                    "linear-gradient(90deg, rgba(255,253,245,0.08) 0%, rgba(255,253,245,0.18) 50%, rgba(255,253,245,0.08) 100%)",
                }}
              />
            </div>
          ))}
        </aside>
      </div>
    </main>
  );
}
