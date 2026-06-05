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
import { DEFAULT_BOARD_ID } from "@/lib/boards";

type NewTaskInput = Omit<Task, "updated" | "id" | "boardId"> & {
  id?: string;
  boardId?: string | null;
};

interface TaskStore {
  tasks: Task[];
  // The board the UI is currently viewing. createTask defaults new tasks to it.
  activeBoardId: string | null;
  setActiveBoard: (id: string | null) => void;
  createTask: (t: NewTaskInput) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  deleteTasksForBoard: (boardId: string) => void;
  reorderTask: (
    id: string,
    targetStatus: Task["status"],
    beforeId: string | null,
  ) => void;
  getTask: (id: string) => Task | undefined;
  resetToInitial: () => void;
  hydrated: boolean;
}

const Ctx = createContext<TaskStore | null>(null);

const STORAGE_KEY = "cadence:tasks:v7";

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
    // Migrate any task missing a boardId onto the default board.
    return (parsed as Task[]).map((t) => ({
      ...t,
      boardId: t.boardId ?? DEFAULT_BOARD_ID,
    }));
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
  const [activeBoardId, setActiveBoard] = useState<string | null>(null);

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

  const createTask = useCallback(
    (input: NewTaskInput): Task => {
      const id = input.id ?? genId(tasks);
      const { boardId, ...rest } = input;
      const next: Task = {
        ...rest,
        id,
        boardId: boardId ?? activeBoardId,
        updated: "just now",
      };
      setTasks((prev) => [next, ...prev]);
      return next;
    },
    [tasks, activeBoardId],
  );

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch, updated: "just now" } : t)),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Cascade: when a board is deleted, drop the tasks that lived on it (mirrors
  // V8's server-side delete-board-and-its-tasks).
  const deleteTasksForBoard = useCallback((boardId: string) => {
    setTasks((prev) => prev.filter((t) => t.boardId !== boardId));
  }, []);

  const reorderTask = useCallback(
    (id: string, targetStatus: Task["status"], beforeId: string | null) => {
      setTasks((prev) => {
        const movingIdx = prev.findIndex((t) => t.id === id);
        if (movingIdx === -1) return prev;
        const moving = prev[movingIdx];
        const movingUpdated: Task =
          moving.status !== targetStatus
            ? { ...moving, status: targetStatus, updated: "just now" }
            : moving;
        const withoutMoving = prev.filter((_, i) => i !== movingIdx);
        if (beforeId === null) {
          let lastIdx = -1;
          withoutMoving.forEach((t, idx) => {
            if (t.status === targetStatus) lastIdx = idx;
          });
          const insertAt = lastIdx + 1;
          const result = [...withoutMoving];
          result.splice(insertAt, 0, movingUpdated);
          return result;
        }
        const beforeIdx = withoutMoving.findIndex((t) => t.id === beforeId);
        if (beforeIdx === -1) return prev;
        const result = [...withoutMoving];
        result.splice(beforeIdx, 0, movingUpdated);
        return result;
      });
    },
    [],
  );

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
      activeBoardId,
      setActiveBoard,
      createTask,
      updateTask,
      deleteTask,
      deleteTasksForBoard,
      reorderTask,
      getTask,
      resetToInitial,
      hydrated,
    }),
    [
      tasks,
      activeBoardId,
      createTask,
      updateTask,
      deleteTask,
      deleteTasksForBoard,
      reorderTask,
      getTask,
      resetToInitial,
      hydrated,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTaskStore(): TaskStore {
  const v = useContext(Ctx);
  if (!v)
    throw new Error("useTaskStore must be used inside <TaskStoreProvider>");
  return v;
}
