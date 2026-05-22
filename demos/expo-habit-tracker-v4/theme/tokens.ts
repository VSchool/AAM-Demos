/* ============================================================
   Pulse — theme tokens (W5D4 · expo-habit-tracker)
   The machined-hardware "instrument" rendered in two themes:
   Dark (default) = black canvas + glowing LCD/LED readouts.
   Light ("day mode") = brushed-silver face + positive LCD.
   ONE app, two skins. Source of truth: the locked UI kit at
   _proposals/expo-habit-tracker-ui-kit-v2.html.

   RESERVED COLOR DISCIPLINE (guideline §7) — 4 roles, one
   meaning each, never decoration. Only the hex changes per theme:
     done   — completed today              (green LED)
     today  — due now, not yet done         (amber LED, blinks)
     streak — momentum / consecutive count  (orange segment readout)
     rest   — intentional skip, NON-punishing (calm grey-blue LED)
   ============================================================ */

export type ThemeName = "dark" | "light";
export type ReservedRole = "done" | "today" | "streak" | "rest";

export interface Theme {
  name: ThemeName;
  /** whether LCD/LED readouts get a glow (dark only). */
  glow: boolean;

  /* ---- structure ---- */
  canvas: string; // page background — the device body / room
  canvasRaised: string; // sticky nav + footer surface
  panel: string; // a channel card / raised panel
  appbarFrom: string; // appbar gradient top
  appbarTo: string; // appbar gradient bottom
  lcd: string; // sunken LCD / segment readout face
  hairline: string; // standard borders
  hairlineStrong: string; // emphasised borders / screw rings

  /* ---- type ink ---- */
  print: string; // primary screen-print text
  alu: string; // bright machined-aluminum label
  aluDk: string; // etched / dim label
  textMuted: string; // body copy on canvas

  /* ---- reserved roles (the 4) ---- */
  done: string;
  today: string;
  streak: string;
  rest: string;
  /** glow shadow color helpers (rgba) for each readout, dark only. */
  doneGlow: string;
  todayGlow: string;
  streakGlow: string;
}

const dark: Theme = {
  name: "dark",
  glow: true,

  canvas: "#0B0C0E",
  canvasRaised: "#0C0D10",
  panel: "#16181C",
  appbarFrom: "#1C1F23",
  appbarTo: "#131519",
  lcd: "#0A0B0C",
  hairline: "#25282D",
  hairlineStrong: "#2A2D33",

  print: "#E9EBEE",
  alu: "#C7CCD2",
  aluDk: "#9AA0A8",
  textMuted: "rgba(231,232,236,0.66)",

  done: "#3DDC84",
  today: "#FFB200",
  streak: "#FF5A1F",
  rest: "#6B7886",
  doneGlow: "rgba(61,220,132,0.55)",
  todayGlow: "rgba(255,178,0,0.55)",
  streakGlow: "rgba(255,90,31,0.5)",
};

const light: Theme = {
  name: "light",
  glow: false,

  canvas: "#E7E8E2",
  canvasRaised: "#EEEFE9",
  panel: "#FBFBF8",
  appbarFrom: "#F5F5EF",
  appbarTo: "#E4E5DF",
  lcd: "#DEE5DC",
  hairline: "#E3E4DE",
  hairlineStrong: "#C2CABF",

  print: "#1A1C1E",
  alu: "#3F444B",
  aluDk: "#767B82",
  textMuted: "rgba(26,28,30,0.66)",

  done: "#17B56E",
  today: "#E8920A",
  streak: "#EC4D12",
  rest: "#6F7C8C",
  doneGlow: "transparent",
  todayGlow: "transparent",
  streakGlow: "transparent",
};

export const THEMES: Record<ThemeName, Theme> = { dark, light };

/* ============================================================
   Helper palette (guideline §3.11) — teaching-annotation colors,
   DELIBERATELY separate from the brand palette and CONSTANT across
   themes, so DemoNote / VersionDemos / motion captions never compete
   with the product instrument for attention. Pale-sky, Pulse-tuned.
   ============================================================ */
export const HELPER = {
  bg: "#EAF3FB",
  accent: "#0B6FB0",
  accentStrong: "#084E7E",
  text: "#0F2A44",
  textMuted: "rgba(15,42,68,0.7)",
} as const;

/* ============================================================
   Type — Space Grotesk (display/UI) + Space Mono (labels +
   segment readouts). Family names match @expo-google-fonts exports
   loaded in app/_layout.tsx.
   ============================================================ */
export const FONTS = {
  sans: "SpaceGrotesk_400Regular",
  sansMed: "SpaceGrotesk_500Medium",
  sansSemi: "SpaceGrotesk_600SemiBold",
  sansBold: "SpaceGrotesk_700Bold",
  mono: "SpaceMono_400Regular",
  monoBold: "SpaceMono_700Bold",
} as const;

/* Reserved-role lookup used by the instrument + palette panel. */
export const RESERVED_ROLES: {
  role: ReservedRole;
  label: string;
  meaning: string;
}[] = [
  { role: "done", label: "Done", meaning: "Completed today" },
  { role: "today", label: "Today", meaning: "Due now, not yet done" },
  { role: "streak", label: "Streak", meaning: "Consecutive-day momentum" },
  { role: "rest", label: "Skipped / Rest", meaning: "Intentional, non-punishing pause" },
];
