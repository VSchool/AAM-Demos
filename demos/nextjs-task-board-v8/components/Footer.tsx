import Link from "next/link";

export default function Footer() {
  return (
    <footer className="cn-foot">
      <div className="cn-foot-inner">
        <span>Cadence · a task board for engineering teams</span>
        <span style={{ display: "inline-flex", gap: 18, flexWrap: "wrap" }}>
          <Link className="cn-foot-link" href="/compare">
            V7 → V8
          </Link>
          <a
            className="cn-foot-link"
            href="https://github.com/VSchool/AAM-Demos/tree/main/demos/nextjs-task-board-v8"
            target="_blank"
            rel="noopener"
          >
            Source ↗
          </a>
        </span>
      </div>
    </footer>
  );
}
