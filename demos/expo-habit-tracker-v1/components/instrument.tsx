/* ============================================================
   Pulse — the instrument primitives.
   Indicator LEDs, segment LCD readouts, hardware toggle switch,
   channel rows, the app bar, and the phone DeviceFrame. These ARE
   the product look; they re-skin automatically from theme tokens
   (glowing-on-black in dark, positive-LCD-on-silver in light).
   Still static channels in v1 — the hero "Throw" lands at v3 — but
   rows now carry the v1 touch-feedback primitive (PressFade).
   ============================================================ */

import { type ReactNode } from "react";
import { Platform, Text, View, type ViewStyle } from "react-native";
import { FONTS, type ReservedRole } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { PressFade } from "./motion";

/* ---- indicator LED ---------------------------------------- */
export function Led({
  role,
  size = 11,
}: {
  role: ReservedRole | "off";
  size?: number;
}) {
  const { theme } = useTheme();
  if (role === "off") {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.name === "dark" ? "#23262B" : "#D3D4CE",
          borderWidth: 1,
          borderColor: theme.name === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)",
        }}
      />
    );
  }
  const color = theme[role];
  const glow =
    role === "done" ? theme.doneGlow : role === "today" ? theme.todayGlow : theme.streakGlow;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.4)",
        shadowColor: theme.glow ? color : "transparent",
        shadowOpacity: theme.glow ? 0.9 : 0,
        shadowRadius: theme.glow ? size * 0.8 : 0,
        shadowOffset: { width: 0, height: 0 },
      }}
    />
  );
}

/* ---- segment LCD readout (the streak digits) -------------- */
export function Segment({
  value,
  unit,
  role = "streak",
  size = 13,
}: {
  value: string | number;
  unit?: string;
  role?: ReservedRole;
  size?: number;
}) {
  const { theme } = useTheme();
  const color = role === "rest" ? theme.rest : theme[role];
  const glow =
    role === "done" ? theme.doneGlow : role === "today" ? theme.todayGlow : theme.streakGlow;
  return (
    <Text
      style={{
        fontFamily: FONTS.monoBold,
        fontSize: size,
        letterSpacing: 1,
        color,
        textShadowColor: theme.glow && role !== "rest" ? glow : "transparent",
        textShadowRadius: theme.glow && role !== "rest" ? size * 0.55 : 0,
        textShadowOffset: { width: 0, height: 0 },
      }}
    >
      {value}
      {unit ? <Text style={{ fontSize: size * 0.45, letterSpacing: 1 }}>{unit}</Text> : null}
    </Text>
  );
}

/* ---- hardware toggle switch (static in v0) ---------------- */
export function HardwareSwitch({ on, big = false }: { on: boolean; big?: boolean }) {
  const { theme } = useTheme();
  const w = big ? 84 : 46;
  const h = big ? 44 : 26;
  const knob = h - 6;
  const trackOn = theme.name === "dark" ? "#0F2417" : "#D2F0DF";
  const trackOff = theme.name === "dark" ? "#0A0B0C" : "#D9DAD2";
  return (
    <View
      style={{
        width: w,
        height: h,
        borderRadius: h / 2,
        backgroundColor: on ? trackOn : trackOff,
        borderWidth: 1,
        borderColor: on ? theme.done : theme.hairlineStrong,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          left: on ? w - knob - 2 : 2,
          width: knob,
          height: knob,
          borderRadius: knob / 2,
          backgroundColor: on ? theme.done : theme.name === "dark" ? "#C8CDD3" : "#FFFFFF",
        }}
      />
    </View>
  );
}

/* ---- a single channel row (a habit) ----------------------- */
export function ChannelRow({
  ledRole,
  name,
  meta,
  streak,
  on,
  dim = false,
}: {
  ledRole: ReservedRole | "off";
  name: string;
  meta: string;
  streak: string;
  on: boolean;
  dim?: boolean;
}) {
  const { theme } = useTheme();
  return (
    // v1 motion: the whole channel dims under your finger via PressFade
    // (useSharedValue opacity). Throwing the switch for real is the v3 lesson.
    <PressFade
      accessibilityRole="button"
      accessibilityLabel={`${name} — ${on ? "on" : "off"}`}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
        backgroundColor: theme.panel,
        borderWidth: 1,
        borderColor: theme.hairline,
        borderRadius: 12,
        paddingVertical: 11,
        paddingHorizontal: 12,
      }}
    >
      <Led role={ledRole} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            fontFamily: FONTS.sansSemi,
            fontSize: 14,
            letterSpacing: -0.1,
            color: theme.print,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.mono,
            fontSize: 10,
            letterSpacing: 0.4,
            color: theme.aluDk,
            marginTop: 1,
          }}
        >
          {meta}
        </Text>
      </View>
      {dim ? (
        <Text style={{ fontFamily: FONTS.monoBold, fontSize: 13, color: theme.rest }}>
          {streak}
        </Text>
      ) : (
        <Segment value={streak} />
      )}
      <HardwareSwitch on={on} />
    </PressFade>
  );
}

/* ---- app bar (screen header) ------------------------------ */
export function AppBar({
  title,
  subtitle,
  seg,
  segRole = "today",
}: {
  title: string;
  subtitle?: string;
  seg?: string;
  segRole?: ReservedRole;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.appbarTo,
        borderBottomWidth: 1,
        borderBottomColor: theme.name === "dark" ? "#000" : theme.hairlineStrong,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 12,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: FONTS.mono,
            fontSize: 11,
            letterSpacing: 2.2,
            textTransform: "uppercase",
            color: theme.alu,
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              fontFamily: FONTS.sansBold,
              fontSize: 17,
              color: theme.print,
              marginTop: 2,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {seg ? (
        <View
          style={{
            backgroundColor: theme.lcd,
            borderWidth: 1,
            borderColor: theme.hairlineStrong,
            borderRadius: 5,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}
        >
          <Segment value={seg} role={segRole} size={14} />
        </View>
      ) : null}
    </View>
  );
}

/* ---- tab bar (visual only — real tabs land in v1) --------- */
export function TabBar({ active }: { active: "Today" | "Streaks" | "Settings" }) {
  const { theme } = useTheme();
  const tabs: ("Today" | "Streaks" | "Settings")[] = ["Today", "Streaks", "Settings"];
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: theme.name === "dark" ? "#0A0B0C" : "#EBECE6",
        borderTopWidth: 1,
        borderTopColor: theme.hairline,
        paddingHorizontal: 10,
        paddingTop: 8,
        paddingBottom: 14,
      }}
    >
      {tabs.map((t) => {
        const isActive = t === active;
        return (
          <View
            key={t}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 8,
              marginHorizontal: 3,
              borderRadius: 7,
              backgroundColor: isActive
                ? theme.name === "dark"
                  ? "#1C1F23"
                  : "#FFFFFF"
                : "transparent",
              borderWidth: isActive ? 1 : 0,
              borderColor: theme.hairlineStrong,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.mono,
                fontSize: 9,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: isActive ? theme.today : theme.aluDk,
              }}
            >
              {t}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

/* ---- status bar (the 9:41 row) ---------------------------- */
function StatusBar() {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingTop: 15,
        height: 44,
      }}
    >
      <Text style={{ fontFamily: FONTS.monoBold, fontSize: 12, color: theme.print }}>9:41</Text>
      {/* signal · wifi · battery — narrow cluster that clears the centered island */}
      <Text
        style={{
          fontFamily: FONTS.monoBold,
          fontSize: 11,
          letterSpacing: 1.5,
          color: theme.print,
        }}
      >
        ▂▄▆ ▮
      </Text>
    </View>
  );
}

/* ---- the phone DeviceFrame -------------------------------- */
export function DeviceFrame({
  children,
  width = 286,
  caption,
}: {
  children: ReactNode;
  width?: number;
  caption?: ReactNode;
}) {
  const { theme } = useTheme();
  const screenH = Math.round(width * 2.1);
  return (
    <View style={{ width, gap: 12 }}>
      <View
        style={{
          width,
          backgroundColor: "#26282C",
          borderRadius: width * 0.155,
          padding: 10,
          ...(Platform.OS === "web"
            ? ({ boxShadow: "0 26px 50px rgba(0,0,0,0.5)" } as unknown as ViewStyle)
            : {
                shadowColor: "#000",
                shadowOpacity: 0.5,
                shadowRadius: 28,
                shadowOffset: { width: 0, height: 26 },
              }),
        }}
      >
        {/* dynamic island */}
        <View
          style={{
            position: "absolute",
            top: 20,
            alignSelf: "center",
            zIndex: 30,
            width: 86,
            height: 25,
            backgroundColor: "#000",
            borderRadius: 14,
          }}
        />
        <View
          style={{
            height: screenH,
            borderRadius: width * 0.122,
            overflow: "hidden",
            backgroundColor: theme.canvas,
          }}
        >
          <StatusBar />
          {children}
        </View>
      </View>
      {caption ? caption : null}
    </View>
  );
}

/* The "stage" — the scrollable middle of a screen. */
export function Stage({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[{ flex: 1, padding: 14, gap: 10 }, style]}>{children}</View>;
}

/* ============================================================
   Streaks (the meter-bridge) primitives — added in v1.
   ============================================================ */

/* A 7-day LED bar cluster. "done" cells glow green, "rest" cells are a
   calm grey (a rest never reads as a failure), "miss" cells sit short
   and dim. Bar heights follow a fixed organic pattern so the bridge
   reads lively rather than uniform. */
const BAR_H = [9, 12, 8, 14, 11, 16, 13];

export function Bars({ days }: { days: ("done" | "rest" | "miss")[] }) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 2, height: 18 }}>
      {days.map((d, i) => {
        const h = d === "done" ? BAR_H[i % BAR_H.length] : d === "rest" ? 6 : 5;
        const color = d === "rest" ? theme.rest : d === "miss" ? theme.aluDk : theme.done;
        return (
          <View
            key={i}
            style={{
              width: 3,
              height: h,
              borderRadius: 1,
              backgroundColor: color,
              opacity: d === "miss" ? 0.5 : 1,
              shadowColor: theme.glow && d === "done" ? theme.done : "transparent",
              shadowOpacity: theme.glow && d === "done" ? 0.7 : 0,
              shadowRadius: theme.glow && d === "done" ? 4 : 0,
              shadowOffset: { width: 0, height: 0 },
            }}
          />
        );
      })}
    </View>
  );
}

/* The total-uptime gauge that crowns the meter-bridge. */
export function UptimeGauge({ pct, unit }: { pct: number; unit: string }) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.lcd,
        borderWidth: 1,
        borderColor: theme.hairlineStrong,
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.monoBold,
          fontSize: 34,
          lineHeight: 36,
          color: theme.done,
          textShadowColor: theme.glow ? theme.doneGlow : "transparent",
          textShadowRadius: theme.glow ? 12 : 0,
          textShadowOffset: { width: 0, height: 0 },
        }}
      >
        {pct}%
      </Text>
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 9,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: theme.aluDk,
          marginTop: 5,
        }}
      >
        {unit}
      </Text>
    </View>
  );
}

/* One meter-bridge row: LED + name + 7-day bars + streak readout. */
export function MeterRow({
  ledRole,
  name,
  days,
  streak,
}: {
  ledRole: ReservedRole | "off";
  name: string;
  days: ("done" | "rest" | "miss")[];
  streak: string;
}) {
  const { theme } = useTheme();
  const rest = ledRole === "rest";
  return (
    <PressFade
      accessibilityRole="button"
      accessibilityLabel={`${name} — streak ${streak}`}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
        backgroundColor: theme.panel,
        borderWidth: 1,
        borderColor: theme.hairline,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
      }}
    >
      <Led role={ledRole} size={9} />
      <Text style={{ flex: 1, fontFamily: FONTS.sansSemi, fontSize: 13, color: theme.print }}>
        {name}
      </Text>
      <Bars days={days} />
      {rest ? (
        <Text style={{ fontFamily: FONTS.monoBold, fontSize: 13, color: theme.rest }}>{streak}</Text>
      ) : (
        <Segment value={streak} />
      )}
    </PressFade>
  );
}

/* ============================================================
   Settings primitives — added in v1.
   ============================================================ */

/* An etched device field: a mono uppercase label over a value/children. */
export function Field({
  label,
  hint,
  children,
  style,
}: {
  label: string;
  hint?: string;
  children?: ReactNode;
  style?: ViewStyle;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.lcd,
          borderWidth: 1,
          borderColor: theme.hairlineStrong,
          borderRadius: 9,
          paddingVertical: 11,
          paddingHorizontal: 13,
          gap: 6,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 9,
          letterSpacing: 1.8,
          textTransform: "uppercase",
          color: theme.aluDk,
        }}
      >
        {label}
        {hint ? <Text style={{ color: theme.aluDk }}>{`  · ${hint}`}</Text> : null}
      </Text>
      {children}
    </View>
  );
}

/* The Coach-tone dial — a hardware mode selector (Chill / Firm / Elite).
   v1 ships it as a static PREVIEW; it drives reminder copy/cadence for
   real at the v5 push beat. `onChange` is optional so it can be live or
   purely illustrative. */
export function SegmentedControl({
  options,
  active,
  onChange,
}: {
  options: string[];
  active: number;
  onChange?: (i: number) => void;
}) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: "row", gap: 6 }}>
      {options.map((opt, i) => {
        const on = i === active;
        return (
          <PressFade
            key={opt}
            disabled={!onChange}
            onPress={() => onChange?.(i)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 8,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: on ? theme.hairlineStrong : theme.hairline,
              backgroundColor: on
                ? theme.name === "dark"
                  ? "#1C1F23"
                  : "#FFFFFF"
                : "transparent",
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.mono,
                fontSize: 10,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: on ? theme.today : theme.aluDk,
              }}
            >
              {opt}
            </Text>
          </PressFade>
        );
      })}
    </View>
  );
}

/* A large segment-LCD clock readout (the daily-reminder time). */
export function BigClock({ time }: { time: string }) {
  const { theme } = useTheme();
  return (
    <Text
      style={{
        fontFamily: FONTS.monoBold,
        fontSize: 26,
        letterSpacing: 2,
        color: theme.today,
        textShadowColor: theme.glow ? theme.todayGlow : "transparent",
        textShadowRadius: theme.glow ? 8 : 0,
        textShadowOffset: { width: 0, height: 0 },
      }}
    >
      {time}
    </Text>
  );
}
