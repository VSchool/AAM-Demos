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

export default function Progression({ current }: { current: number }) {
  return (
    <div className="cn-prog" aria-label="progressive state">
      {STEPS.map((s) => {
        const cls =
          s.v === current
            ? "cn-prog-step cn-prog-step-current"
            : s.v > current
              ? "cn-prog-step cn-prog-step-future"
              : "cn-prog-step";
        return (
          <span key={s.v} className={cls}>
            v{s.v} · {s.label}
          </span>
        );
      })}
    </div>
  );
}
