"use client";

import { useTaskStore } from "@/lib/task-store";
import TaskFilter from "./TaskFilter";
import NewTaskForm from "./NewTaskForm";

export default function TaskBoard() {
  const { tasks } = useTaskStore();

  return (
    <>
      <div className="cn-board-actions">
        <NewTaskForm />
      </div>
      <TaskFilter tasks={tasks} />
    </>
  );
}
