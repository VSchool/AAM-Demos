export default function TaskListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="cn-task-list">
      {Array.from({ length: count }).map((_, i) => (
        <article key={i} className="cn-task cn-task-skel" aria-hidden="true">
          <header className="cn-task-head">
            <span className="cn-skel" style={{ width: 64, height: 11 }} />
            <span className="cn-skel" style={{ width: 90, height: 22 }} />
          </header>
          <div className="cn-skel" style={{ width: "85%", height: 18, marginTop: 8 }} />
          <div className="cn-skel" style={{ width: "70%", height: 14, marginTop: 10 }} />
          <div className="cn-skel" style={{ width: "55%", height: 14, marginTop: 6 }} />
          <footer className="cn-task-foot" style={{ marginTop: 14 }}>
            <div className="cn-task-foot-left">
              <span className="cn-skel" style={{ width: 40, height: 12 }} />
              <span className="cn-skel" style={{ width: 60, height: 12 }} />
            </div>
            <span className="cn-skel" style={{ width: 22, height: 22, borderRadius: "50%" }} />
          </footer>
        </article>
      ))}
    </div>
  );
}
