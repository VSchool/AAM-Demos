import Link from "next/link";
import type { Task } from "@/lib/tasks";
import { STATUS_LABEL } from "@/lib/tasks";

const FLAG_CLASS: Record<Task["status"], string> = {
  backlog: "cn-flag cn-flag-open",
  todo: "cn-flag cn-flag-open",
  in_progress: "cn-flag cn-flag-doing",
  blocked: "cn-flag cn-flag-blocked",
  done: "cn-flag cn-flag-done",
  canceled: "cn-flag cn-flag-canceled",
};

const PRIO_COLOR: Record<Task["priority"], string> = {
  P0: "#FF7BF5",
  P1: "#FFE066",
  P2: "#7DD3FC",
  P3: "rgba(10,10,10,0.30)",
};

export default function TaskCard({ task }: { task: Task }) {
  return (
    <Link href={`/tasks/${task.id}`} className="cn-task-link">
      <article className="cn-task">
        <header className="cn-task-head">
          <span className="cn-task-id">{task.id}</span>
          <span className={FLAG_CLASS[task.status]}>{STATUS_LABEL[task.status]}</span>
        </header>
        <h3 className="cn-task-title">{task.title}</h3>
        <p className="cn-task-desc">{task.description}</p>
        <footer className="cn-task-foot">
          <div className="cn-task-foot-left">
            <span className="cn-prio">
              <span
                className="cn-prio-dot"
                style={{ background: PRIO_COLOR[task.priority] }}
                aria-hidden="true"
              />
              {task.priority}
            </span>
            <span className="cn-task-due">{task.due}</span>
            {task.labels.map((l) => (
              <span key={l} className="cn-task-label">
                {l}
              </span>
            ))}
          </div>
          <div className="cn-task-foot-right">
            <span className="cn-avatar" aria-label={task.assignee}>
              {task.assignee}
            </span>
          </div>
        </footer>
      </article>
    </Link>
  );
}
