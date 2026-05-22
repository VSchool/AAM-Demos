import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { THEMES, type Theme, type ThemeName } from "./tokens";

interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeName;
  /** flip dark ⇄ light — the in-app "day mode" switch (PaletteToggle analog). */
  toggleTheme: () => void;
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Pulse ships dark by default — the hero machined-instrument look.
 * Light is the same instrument re-skinned for daytime.
 * Selection is session-only on purpose (persistence is the v4 lesson).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>("dark");

  const toggleTheme = useCallback(
    () => setThemeName((n) => (n === "dark" ? "light" : "dark")),
    [],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: THEMES[themeName],
      themeName,
      toggleTheme,
      setTheme: setThemeName,
    }),
    [themeName, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}
