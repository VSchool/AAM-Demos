"use client";

import type { ReactNode } from "react";
import { useTaskStore } from "@/lib/task-store";
import TaskFilter from "./TaskFilter";
import NewTaskForm from "./NewTaskForm";

interface Props {
  note?: ReactNode;
}

export default function TaskBoard({ note }: Props) {
  const { tasks } = useTaskStore();

  return (
    <>
      <div className="cn-board-actions">
        {note ? <div className="cn-board-note-slot">{note}</div> : null}
        <NewTaskForm />
      </div>
      <TaskFilter tasks={tasks} />
    </>
  );
}
