"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Task } from "@/lib/tasks";

type NewTaskInput = Omit<Task, "updated" | "id"> & { id?: string };

interface TaskStore {
  tasks: Task[];
  createTask: (t: NewTaskInput) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTask: (id: string) => Task | undefined;
  resetToInitial: () => void;
  hydrated: boolean;
}

const Ctx = createContext<TaskStore | null>(null);

const STORAGE_KEY = "cadence:tasks:v6";

function genId(existing: Task[]): string {
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

function loadFromStorage(): Task[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed as Task[];
  } catch {
    return null;
  }
}

function saveToStorage(tasks: Task[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // localStorage may be unavailable in private mode; silently no-op.
  }
}

export function TaskStoreProvider({
  initial,
  children,
}: {
  initial: Task[];
  children: ReactNode;
}) {
  // Initialize from the server-provided `initial` so SSR / first paint matches.
  // After mount we swap in localStorage data if present.
  const [tasks, setTasks] = useState<Task[]>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored && stored.length > 0) {
      setTasks(stored);
    }
    setHydrated(true);
  }, []);

  // Persist on every mutation, but only after we've hydrated (to avoid
  // overwriting localStorage with the SSR-default `initial` on first mount).
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(tasks);
  }, [tasks, hydrated]);

  const createTask = useCallback((input: NewTaskInput): Task => {
    const id = input.id ?? genId(tasks);
    const next: Task = { ...input, id, updated: "just now" };
    setTasks((prev) => [next, ...prev]);
    return next;
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

  const resetToInitial = useCallback(() => {
    if (typeof window !== "undefined") {
      try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
    }
    setTasks(initial);
  }, [initial]);

  const value = useMemo(
    () => ({
      tasks,
      createTask,
      updateTask,
      deleteTask,
      getTask,
      resetToInitial,
      hydrated,
    }),
    [tasks, createTask, updateTask, deleteTask, getTask, resetToInitial, hydrated],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTaskStore(): TaskStore {
  const v = useContext(Ctx);
  if (!v)
    throw new Error("useTaskStore must be used inside <TaskStoreProvider>");
  return v;
}
