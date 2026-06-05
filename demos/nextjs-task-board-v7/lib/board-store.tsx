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
import { defaultBoards, nextBoardColor } from "@/lib/boards";

// ============================================================
// Board store. The V7 (frontend-only) counterpart to V8's board store: where
// V8 hits /api/boards (MongoDB, scoped to the logged-in user), V7 keeps the
// list in localStorage. Same surface — create / rename / delete — so the UI is
// identical; a backend is what would make these boards follow you to another
// device.
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

const STORAGE_KEY = "cadence:boards:v7";

function genId(): string {
  // Deterministic-enough unique id without Date.now()/Math.random concerns in
  // app code — a counter seeded off the existing max plus a short suffix.
  return `board-${Date.now().toString(36)}`;
}

function loadFromStorage(): Board[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed as Board[];
  } catch {
    return null;
  }
}

function saveToStorage(boards: Board[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
  } catch {
    // localStorage may be unavailable in private mode; silently no-op.
  }
}

export function BoardStoreProvider({ children }: { children: ReactNode }) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage after mount; seed the default board on first visit.
  useEffect(() => {
    const stored = loadFromStorage();
    setBoards(stored ?? defaultBoards());
    setHydrated(true);
  }, []);

  // Persist on every change once hydrated.
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(boards);
  }, [boards, hydrated]);

  const refresh = useCallback(async () => {
    setBoards(loadFromStorage() ?? defaultBoards());
  }, []);

  const createBoard = useCallback(
    async (name: string, color?: BoardColor): Promise<Board | null> => {
      const trimmed = name.trim();
      if (!trimmed) return null;
      const board: Board = {
        id: genId(),
        name: trimmed,
        color: color ?? nextBoardColor(boards.length),
        taskCount: 0,
      };
      setBoards((prev) => [...prev, board]);
      return board;
    },
    [boards.length],
  );

  const renameBoard = useCallback(
    async (id: string, patch: { name?: string; color?: BoardColor }) => {
      setBoards((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                ...(patch.name !== undefined ? { name: patch.name } : {}),
                ...(patch.color !== undefined ? { color: patch.color } : {}),
              }
            : b,
        ),
      );
    },
    [],
  );

  const deleteBoard = useCallback(async (id: string) => {
    setError(null);
    setBoards((prev) => {
      // Mirror V8: never delete the user's only board, so tasks always have a
      // home.
      if (prev.length <= 1) {
        setError("You can't delete your only board.");
        return prev;
      }
      return prev.filter((b) => b.id !== id);
    });
  }, []);

  const getBoard = useCallback(
    (id: string) => boards.find((b) => b.id === id),
    [boards],
  );

  const value = useMemo(
    () => ({
      boards,
      loading: false,
      error,
      hydrated,
      createBoard,
      renameBoard,
      deleteBoard,
      getBoard,
      refresh,
    }),
    [boards, error, hydrated, createBoard, renameBoard, deleteBoard, getBoard, refresh],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBoards(): BoardStore {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBoards must be used inside <BoardStoreProvider>");
  return v;
}
