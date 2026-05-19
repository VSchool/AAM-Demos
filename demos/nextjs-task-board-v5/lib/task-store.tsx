"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Task } from "@/lib/tasks";

type NewTaskInput = Omit<Task, "updated" | "id"> & { id?: string };

interface TaskStore {
  tasks: Task[];
  createTask: (t: NewTaskInput) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTask: (id: string) => Task | undefined;
}

const Ctx = createContext<TaskStore | null>(null);

function genId(existing: Task[]): string {
  // CDN-### — pick the next number above the current max
  let max = 0;
  for (const t of existing) {
    const m = /^CDN-(\d+)$/.exec(t.id);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > max) max = n;
    }
  }
  return `CDN-${String(max + 1).padStart(3, "0")}`;
}

export function TaskStoreProvider({
  initial,
  children,
}: {
  initial: Task[];
  children: ReactNode;
}) {
  const [tasks, setTasks] = useState<Task[]>(initial);

  const createTask = useCallback((input: NewTaskInput): Task => {
    let created: Task | null = null;
    setTasks((prev) => {
      const id = input.id ?? genId(prev);
      const next: Task = { ...input, id, updated: "just now" };
      created = next;
      return [next, ...prev];
    });
    // Return the created task synchronously by reading state via closure.
    // Safer: assemble outside the setter.
    if (created) return created;
    const id = input.id ?? genId(tasks);
    return { ...input, id, updated: "just now" };
  }, [tasks]);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch, updated: "just now" } : t)),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getTask = useCallback(
    (id: string) => tasks.find((t) => t.id === id),
    [tasks],
  );

  const value = useMemo(
    () => ({ tasks, createTask, updateTask, deleteTask, getTask }),
    [tasks, createTask, updateTask, deleteTask, getTask],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTaskStore(): TaskStore {
  const v = useContext(Ctx);
  if (!v)
    throw new Error("useTaskStore must be used inside <TaskStoreProvider>");
  return v;
}
