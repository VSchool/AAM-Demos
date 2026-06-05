"use client";

import type { ReactNode } from "react";
import { useTaskStore } from "@/lib/task-store";
import TaskFilter from "./TaskFilter";
import NewTaskForm from "./NewTaskForm";

interface Props {
  note?: ReactNode;
}

export default function TaskBoard({ note }: Props) {
  const { tasks, activeBoardId } = useTaskStore();

  // The store holds every task the user owns (so deep-linked detail pages work);
  // the board view shows only the board currently being viewed.
  const boardTasks = activeBoardId
    ? tasks.filter((t) => t.boardId === activeBoardId)
    : tasks;

  return (
    <>
      <div className="cn-board-actions">
        {note ? <div className="cn-board-note-slot">{note}</div> : null}
        <NewTaskForm />
      </div>
      <TaskFilter tasks={boardTasks} />
    </>
  );
}
