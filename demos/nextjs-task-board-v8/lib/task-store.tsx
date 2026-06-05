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
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-store";

// ============================================================
// V8 task store. The headline V7→V8 change: in V7 this read/wrote
// localStorage; in V8 every operation is a real API call to /api/tasks,
// backed by MongoDB and scoped to the logged-in user. Open DevTools → Network
// and you'll watch the list arrive as GET /api/tasks, and every create / edit /
// delete hit the server.
// ============================================================

type NewTaskInput = Omit<Task, "updated" | "id" | "boardId"> & {
  boardId?: string | null;
};

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  hydrated: boolean;
  // The board the UI is currently viewing. createTask defaults new tasks to it.
  activeBoardId: string | null;
  setActiveBoard: (id: string | null) => void;
  createTask: (t: NewTaskInput) => Promise<Task | null>;
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reorderTask: (
    id: string,
    targetStatus: Task["status"],
    beforeId: string | null,
  ) => void;
  getTask: (id: string) => Task | undefined;
  refresh: () => Promise<void>;
}

const Ctx = createContext<TaskStore | null>(null);

export function TaskStoreProvider({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeBoardId, setActiveBoard] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ tasks: Task[] }>("/api/tasks");
      setTasks(data.tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load tasks.");
      setTasks([]);
    } finally {
      setLoading(false);
      setHydrated(true);
    }
  }, []);

  // Load the user's tasks once auth is resolved. Clear them on logout.
  useEffect(() => {
    if (!ready) return;
    if (user) {
      refresh();
    } else {
      setTasks([]);
      setHydrated(true);
      setLoading(false);
    }
  }, [ready, user, refresh]);

  const createTask = useCallback(
    async (input: NewTaskInput): Promise<Task | null> => {
      try {
        // Default the task onto the board the UI is currently viewing.
        const boardId = input.boardId ?? activeBoardId;
        const data = await apiFetch<{ task: Task }>("/api/tasks", {
          method: "POST",
          body: JSON.stringify({ ...input, boardId }),
        });
        setTasks((prev) => [data.task, ...prev]);
        return data.task;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not create the task.");
        return null;
      }
    },
    [activeBoardId],
  );

  const updateTask = useCallback(async (id: string, patch: Partial<Task>) => {
    try {
      const data = await apiFetch<{ task: Task }>(`/api/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(patch),
      });
      setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the task.");
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the task.");
    }
  }, []);

  // Drag-to-reorder. Ordering within a column is local UX (not persisted),
  // but a column change IS a real status change — so we persist that via PUT.
  const reorderTask = useCallback(
    (id: string, targetStatus: Task["status"], beforeId: string | null) => {
      let statusChanged = false;
      setTasks((prev) => {
        const movingIdx = prev.findIndex((t) => t.id === id);
        if (movingIdx === -1) return prev;
        const moving = prev[movingIdx];
        statusChanged = moving.status !== targetStatus;
        const movingUpdated: Task = statusChanged
          ? { ...moving, status: targetStatus, updated: "just now" }
          : moving;
        const withoutMoving = prev.filter((_, i) => i !== movingIdx);
        if (beforeId === null) {
          let lastIdx = -1;
          withoutMoving.forEach((t, idx) => {
            if (t.status === targetStatus) lastIdx = idx;
          });
          const result = [...withoutMoving];
          result.splice(lastIdx + 1, 0, movingUpdated);
          return result;
        }
        const beforeIdx = withoutMoving.findIndex((t) => t.id === beforeId);
        if (beforeIdx === -1) return prev;
        const result = [...withoutMoving];
        result.splice(beforeIdx, 0, movingUpdated);
        return result;
      });
      if (statusChanged) {
        // Persist the status change to the database (fire-and-forget; local
        // state already reflects it).
        void apiFetch(`/api/tasks/${id}`, {
          method: "PUT",
          body: JSON.stringify({ status: targetStatus }),
        }).catch(() => setError("Could not save the status change."));
      }
    },
    [],
  );

  const getTask = useCallback(
    (id: string) => tasks.find((t) => t.id === id),
    [tasks],
  );

  const value = useMemo(
    () => ({
      tasks,
      loading,
      error,
      hydrated,
      activeBoardId,
      setActiveBoard,
      createTask,
      updateTask,
      deleteTask,
      reorderTask,
      getTask,
      refresh,
    }),
    [
      tasks,
      loading,
      error,
      hydrated,
      activeBoardId,
      createTask,
      updateTask,
      deleteTask,
      reorderTask,
      getTask,
      refresh,
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
