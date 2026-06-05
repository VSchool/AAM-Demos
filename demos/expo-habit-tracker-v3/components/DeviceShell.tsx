/* ============================================================
   DeviceShell — the persistent phone framing + presentation gate.

   The app (login → welcome → tabs/detail, all identical on web and
   device) renders inside this shell. The shell adapts to context:

   • Wide desktop browser → the app runs in a phone BEZEL, with a device
     selector above it and exactly THREE external annotation modals beside
     it (QR + "this is the app" disclaimer + the 7 states). This is the
     "mobile app in the browser" teaching surface.
   • Real phone / narrow viewport / native → the app is FULL SCREEN with
     no bezel and no external modals (you're already on a phone). Build
     info lives in-app (the About screen, reachable from Today + Settings).

   So the actual app screens are identical everywhere; only the framing
   around them changes. The shell also owns: measuring the phone-screen
   rect for the tour's spotlight, auto-opening the what's-new tour on entry
   to the app, and the mock-auth gate.
   ============================================================ */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { DeviceFrame } from "./instrument";
import { FONTS } from "@/theme/tokens";
import { useTheme } from "@/theme/ThemeProvider";
import { useSession } from "@/lib/session";
import { useTour } from "@/lib/tour";
import CalloutRail from "./CalloutRail";
import Tour, { WhatsNewPill } from "./Tour";
import LoginScreen from "./LoginScreen";
import WelcomeScreen from "./WelcomeScreen";

/* Popular phone models for the browser device selector. `w` is an on-screen
   display width (scaled from logical points to fit the page); `aspect` is the
   real screen h:w so proportions read true (SE is notably shorter/wider). */
type Device = { id: string; label: string; w: number; aspect: number };
const DEVICES: Device[] = [
  { id: "fit", label: "Fit", w: 360, aspect: 2.1 },
  { id: "ip15pro", label: "iPhone 15 Pro", w: 360, aspect: 2.168 },
  { id: "ip15max", label: "15 Pro Max", w: 388, aspect: 2.167 },
  { id: "ipse", label: "iPhone SE", w: 340, aspect: 1.779 },
  { id: "px8", label: "Pixel 8", w: 366, aspect: 2.221 },
  { id: "px8pro", label: "Pixel 8 Pro", w: 392, aspect: 2.228 },
  { id: "s24", label: "Galaxy S24", w: 334, aspect: 2.167 },
];

/* The running app: live screens + the what's-new tour + its trigger.
   Measures its own window rect so the tour can place spotlight rings
   relative to the phone screen. Auto-opens the tour once on entry. */
function AppRunning({ children }: { children: ReactNode }) {
  const ref = useRef<View>(null);
  const { openTour, setScreenRect, open, measureTick } = useTour();
  const { toured, markToured } = useSession();

  // First entry to the app after sign-in → auto-run the what's-new tour.
  // Gated on session `toured` so it fires once per login, not on every
  // remount (e.g. crossing the wide/narrow layout breakpoint).
  useEffect(() => {
    if (!toured) {
      openTour();
      markToured();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const measure = () => {
    ref.current?.measureInWindow((x, y, w, h) => {
      if (w && h) setScreenRect({ x, y, w, h });
    });
  };
  useEffect(() => {
    measure();
    const t = setTimeout(measure, 70);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, measureTick]);

  return (
    <View ref={ref} collapsable={false} style={{ flex: 1 }} onLayout={measure}>
      {children}
      <WhatsNewPill />
      <Tour />
    </View>
  );
}

/* The mock-auth gate: login → welcome → app. All three are in-app screens
   so they're identical in the browser bezel and on a device. */
function AppArea({ children }: { children: ReactNode }) {
  const session = useSession();
  if (!session.authed) return <LoginScreen onSignIn={session.signIn} />;
  if (!session.welcomed) return <WelcomeScreen onStart={session.finishWelcome} />;
  return <AppRunning>{children}</AppRunning>;
}

/* The browser device-model selector (wide desktop only). */
function DeviceSelector({ value, onChange }: { value: Device; onChange: (d: Device) => void }) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, alignItems: "center", marginBottom: 12 }}>
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 9.5,
          letterSpacing: 1.6,
          textTransform: "uppercase",
          color: theme.aluDk,
          marginRight: 4,
        }}
      >
        View as
      </Text>
      {DEVICES.map((d) => {
        const active = d.id === value.id;
        return (
          <Pressable
            key={d.id}
            onPress={() => onChange(d)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 11,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: active ? theme.today : theme.hairlineStrong,
              backgroundColor: active ? theme.lcd : "transparent",
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.mono,
                fontSize: 10,
                letterSpacing: 0.6,
                color: active ? theme.today : theme.aluDk,
              }}
            >
              {d.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function DeviceShell({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const [device, setDevice] = useState<Device>(DEVICES[0]);

  const app = <AppArea>{children}</AppArea>;

  // NATIVE or NARROW web (a real phone): full-screen app, no bezel, no rail.
  // A real phone (<~430) fills the screen. In the in-between range (a tablet
  // or a resized desktop, ~430–980) we cap the column to a phone-ish width and
  // centre it, so the app never stretches edge-to-edge. The cap is wider than
  // any phone, so portrait phones are unaffected; native is always a real
  // phone, so it's inert there too.
  const wide = width >= 980;
  if (Platform.OS !== "web" || !wide) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.canvas, alignItems: "center" }}>
        <View style={{ flex: 1, width: "100%", maxWidth: 600 }}>{app}</View>
      </View>
    );
  }

  // WIDE WEB: phone bezel + device selector + the 3 external annotation modals.
  const frameWidth = device.w;
  // Explicit row width so the rail's flex:1 distributes correctly (RN-web
  // won't stretch a width:"100%" child inside an alignItems:center parent).
  const rowWidth = Math.min(960, width - 80);
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.canvas }}
      contentContainerStyle={{ flexGrow: 1, paddingVertical: 36, paddingHorizontal: 32, alignItems: "center" }}
    >
      <View style={{ flexDirection: "row", gap: 36, alignItems: "flex-start", width: rowWidth }}>
        {/* the phone + its device selector (column fixed to the phone width so
            the selector wraps under the phone instead of pushing the rail) */}
        <View style={{ width: frameWidth }}>
          <DeviceSelector value={device} onChange={setDevice} />
          <DeviceFrame width={frameWidth} aspect={device.aspect}>
            {app}
          </DeviceFrame>
        </View>

        {/* the 3 notes about the phone */}
        <View style={{ flex: 1, maxWidth: 440 }}>
          <CalloutRail />
        </View>
      </View>
    </ScrollView>
  );
}
