/* V0Demos (guideline §3.10) — the current-version deep-dive.
   Small illustrations specific to the files v0 introduces: the route
   map (file structure → URLs), the new-files list, and the two-face
   theme-token preview (same reserved roles, hex changes per theme).
   Co-located with the home-page section that introduces them. */

import { Text, View } from "react-native";
import { FONTS, THEMES, RESERVED_ROLES } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";

/* file structure = URL structure */
const ROUTES = [
  { path: "/", file: "app/index.tsx", desc: "The landing you're on now." },
  { path: "/today", file: "app/today.tsx", desc: "The instrument — a static channel list." },
  { path: "/about", file: "app/about.tsx", desc: "The whole v0→v5 arc on one page." },
];

export function RouteMap() {
  const { theme } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      {ROUTES.map((r) => (
        <View
          key={r.path}
          style={{
            backgroundColor: theme.canvas,
            borderWidth: 1,
            borderColor: theme.hairline,
            borderRadius: 9,
            padding: 12,
            gap: 3,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontFamily: FONTS.monoBold, fontSize: 13, color: theme.today }}>
              {r.path}
            </Text>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 11, color: theme.aluDk }}>
              {r.file}
            </Text>
          </View>
          <Text style={{ fontFamily: FONTS.sans, fontSize: 12.5, color: theme.textMuted }}>
            {r.desc}
          </Text>
        </View>
      ))}
    </View>
  );
}

const NEW_DIRS = [
  { name: "app/", note: "index · today · about — file-based routes" },
  { name: "theme/", note: "tokens.ts (dark + light) + ThemeProvider" },
  { name: "components/", note: "the shared chrome suite (built once)" },
  { name: "lib/habits.ts", note: "typed sample channels + getAll/getById" },
];

export function NewFilesList() {
  const { theme } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      {NEW_DIRS.map((d) => (
        <View key={d.name} style={{ flexDirection: "row", alignItems: "baseline", gap: 10 }}>
          <Text
            style={{
              fontFamily: FONTS.monoBold,
              fontSize: 13,
              color: theme.done,
              minWidth: 118,
            }}
          >
            {d.name}
          </Text>
          <Text style={{ flex: 1, fontFamily: FONTS.sans, fontSize: 12.5, color: theme.textMuted }}>
            {d.note}
          </Text>
        </View>
      ))}
    </View>
  );
}

/* Same four reserved roles, both faces, side by side — the toggle's lesson. */
export function ThemeTokensPreview() {
  const { theme } = useTheme();
  const faces: ("dark" | "light")[] = ["dark", "light"];
  return (
    <View style={{ gap: 12 }}>
      {faces.map((face) => {
        const t = THEMES[face];
        return (
          <View key={face} style={{ gap: 6 }}>
            <Text
              style={{
                fontFamily: FONTS.mono,
                fontSize: 10,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                color: theme.aluDk,
              }}
            >
              {face === "dark" ? "Dark · default" : "Light · day mode"}
            </Text>
            <View style={{ flexDirection: "row", gap: 6 }}>
              {RESERVED_ROLES.map((r) => (
                <View
                  key={r.role}
                  style={{
                    flex: 1,
                    backgroundColor: t.canvas,
                    borderWidth: 1,
                    borderColor: theme.hairline,
                    borderRadius: 8,
                    padding: 8,
                    gap: 6,
                  }}
                >
                  <View
                    style={{
                      height: 22,
                      borderRadius: 5,
                      backgroundColor: t[r.role],
                    }}
                  />
                  <Text style={{ fontFamily: FONTS.mono, fontSize: 8.5, color: t.print }}>
                    {r.role}
                  </Text>
                  <Text style={{ fontFamily: FONTS.mono, fontSize: 8, color: face === "dark" ? "#9AA0A8" : "#767B82" }}>
                    {t[r.role]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}
