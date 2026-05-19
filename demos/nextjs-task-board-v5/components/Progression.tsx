type Step = {
  v: number;
  label: string;
};

const STEPS: Step[] = [
  { v: 0, label: "scaffold" },
  { v: 1, label: "client list" },
  { v: 2, label: "server list" },
  { v: 3, label: "client filter" },
  { v: 4, label: "detail route" },
  { v: 5, label: "crud ui" },
  { v: 6, label: "layout + states" },
];

const BASE = "https://vschool.github.io/AAM-Demos/nextjs-task-board-";

export default function Progression({ current }: { current: number }) {
  return (
    <div className="cn-prog" aria-label="progressive state">
      {STEPS.map((s) => {
        if (s.v === current) {
          return (
            <span
              key={s.v}
              className="cn-prog-step cn-prog-step-current"
              aria-current="step"
            >
              v{s.v} · {s.label}
            </span>
          );
        }
        if (s.v < current) {
          // past version — link to its deployed page so students can
          // step back through the progression
          return (
            <a
              key={s.v}
              href={`${BASE}v${s.v}/`}
              className="cn-prog-step cn-prog-step-past"
              title={`Open v${s.v} (${s.label})`}
            >
              v{s.v} · {s.label}
            </a>
          );
        }
        // future version — not yet available from this state, stays locked
        return (
          <span
            key={s.v}
            className="cn-prog-step cn-prog-step-future"
            aria-disabled="true"
            title="Not yet built in this version"
          >
            v{s.v} · {s.label}
          </span>
        );
      })}
    </div>
  );
}
