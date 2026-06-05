// ============================================================
// Board types + display helpers. A board is a named collection of tasks — the
// "different boards" you switch between on the home page. Tasks reference their
// board via boardId.
//
// V7 is the frontend-only "before" demo: boards live in localStorage (see
// lib/board-store.tsx), not a database. The shape mirrors V8 so the UI is
// identical; only the persistence differs.
// ============================================================

export type BoardColor = "neon" | "pink" | "yellow" | "violet" | "sky";

export interface Board {
  id: string;
  name: string;
  color: BoardColor;
  taskCount: number;
  createdAt?: string;
}

export const BOARD_COLOR_LIST: BoardColor[] = [
  "neon",
  "pink",
  "yellow",
  "violet",
  "sky",
];

export const BOARD_COLORS: Record<BoardColor, string> = {
  neon: "#00FFB2",
  pink: "#FF7BF5",
  yellow: "#FFE066",
  violet: "#A78BFA",
  sky: "#7DD3FC",
};

export function isBoardColor(v: unknown): v is BoardColor {
  return typeof v === "string" && (BOARD_COLOR_LIST as string[]).includes(v);
}

// Pick the next accent color for a new board so a fresh set of boards reads as
// a varied palette rather than all one color.
export function nextBoardColor(existingCount: number): BoardColor {
  return BOARD_COLOR_LIST[existingCount % BOARD_COLOR_LIST.length];
}

// The board the seed tasks belong to. Both the task seed (lib/tasks.ts) and the
// board store seed this same id so a fresh visitor sees one populated board.
export const DEFAULT_BOARD_ID = "board-cadence";

export function defaultBoards(): Board[] {
  return [
    {
      id: DEFAULT_BOARD_ID,
      name: "Cadence",
      color: "neon",
      taskCount: 0,
    },
  ];
}
