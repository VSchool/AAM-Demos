"use client";

// Slim client wrapper for v3: bridges the in-memory store to TaskFilter.
// Lets the kanban view re-render after reorderTask mutates the store.
// v5 will extend this wrapper with NewTaskForm + edit/delete actions.

import { useTaskStore } from "@/lib/task-store";
import TaskFilter from "./TaskFilter";

export default function TaskBoard() {
  const { tasks } = useTaskStore();
  return <TaskFilter tasks={tasks} />;
}
