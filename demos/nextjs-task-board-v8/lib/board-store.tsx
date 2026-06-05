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
import type { Board, BoardColor } from "@/lib/boards";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-store";

// ============================================================
// Board store. Loads the logged-in user's boards from /api/boards and exposes
// create / rename / delete, mirroring the task store. Boards are real MongoDB
// documents, so they persist across devices just like tasks.
// ============================================================

interface BoardStore {
  boards: Board[];
  loading: boolean;
  error: string | null;
  hydrated: boolean;
  createBoard: (name: string, color?: BoardColor) => Promise<Board | null>;
  renameBoard: (
    id: string,
    patch: { name?: string; color?: BoardColor },
  ) => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
  getBoard: (id: string) => Board | undefined;
  refresh: () => Promise<void>;
}

const Ctx = createContext<BoardStore | null>(null);

export function BoardStoreProvider({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<{ boards: Board[] }>("/api/boards");
      setBoards(data.boards);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load boards.");
      setBoards([]);
    } finally {
      setLoading(false);
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (user) {
      refresh();
    } else {
      setBoards([]);
      setHydrated(true);
      setLoading(false);
    }
  }, [ready, user, refresh]);

  const createBoard = useCallback(
    async (name: string, color?: BoardColor): Promise<Board | null> => {
      try {
        const data = await apiFetch<{ board: Board }>("/api/boards", {
          method: "POST",
          body: JSON.stringify({ name, color }),
        });
        setBoards((prev) => [...prev, data.board]);
        return data.board;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not create the board.");
        return null;
      }
    },
    [],
  );

  const renameBoard = useCallback(
    async (id: string, patch: { name?: string; color?: BoardColor }) => {
      try {
        const data = await apiFetch<{ board: Board }>(`/api/boards/${id}`, {
          method: "PUT",
          body: JSON.stringify(patch),
        });
        setBoards((prev) => prev.map((b) => (b.id === id ? data.board : b)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not update the board.");
      }
    },
    [],
  );

  const deleteBoard = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/boards/${id}`, { method: "DELETE" });
      setBoards((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the board.");
    }
  }, []);

  const getBoard = useCallback(
    (id: string) => boards.find((b) => b.id === id),
    [boards],
  );

  const value = useMemo(
    () => ({
      boards,
      loading,
      error,
      hydrated,
      createBoard,
      renameBoard,
      deleteBoard,
      getBoard,
      refresh,
    }),
    [
      boards,
      loading,
      error,
      hydrated,
      createBoard,
      renameBoard,
      deleteBoard,
      getBoard,
      refresh,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBoards(): BoardStore {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBoards must be used inside <BoardStoreProvider>");
  return v;
}
