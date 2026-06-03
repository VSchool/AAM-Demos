import Link from "next/link";
import type { DragEvent } from "react";
import type { Task } from "@/lib/tasks";
import { STATUS_LABEL, labelClass, avatarClass } from "@/lib/tasks";

const FLAG_CLASS: Record<Task["status"], string> = {
  backlog: "cn-flag cn-flag-backlog",
  todo: "cn-flag cn-flag-todo",
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

interface TaskCardProps {
  task: Task;
  draggable?: boolean;
  isDragging?: boolean;
  onDragStart?: (e: DragEvent<HTMLAnchorElement>) => void;
  onDragEnd?: (e: DragEvent<HTMLAnchorElement>) => void;
}

export default function TaskCard({
  task,
  draggable,
  isDragging,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  return (
    <Link
      href={`/tasks/${task.id}`}
      className={`cn-task-link${isDragging ? " cn-task-link-dragging" : ""}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <article className={`cn-task${task.status === "canceled" ? " cn-task-canceled" : ""}`}>
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
              <span key={l} className={labelClass(l)}>
                {l}
              </span>
            ))}
          </div>
          <div className="cn-task-foot-right">
            <span className={avatarClass(task.assignee)} aria-label={task.assignee}>
              {task.assignee}
            </span>
          </div>
        </footer>
      </article>
    </Link>
  );
}
