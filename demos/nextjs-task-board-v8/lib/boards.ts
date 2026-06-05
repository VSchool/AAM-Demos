// ============================================================
// Board types + display helpers, shared client/server. A board is a named
// collection of tasks owned by a user — the "different boards" you switch
// between on the home page. Tasks reference their board via boardId.
// (No mongoose here so this stays safe to import from client components.)
// ============================================================

export type BoardColor = "neon" | "pink" | "yellow" | "violet" | "sky";

export interface Board {
  id: string; // serialized Mongo _id
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
