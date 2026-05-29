/* ============================================================
   session — the mock auth gate.

   A real mobile app opens to a login. We teach that pattern with a
   MOCK: any input signs you in (no validation, no server, no token).
   It deliberately does NOT persist — every fresh load replays the real
   first-run experience (login → welcome → app → what's-new tour), which
   is what we want students to see. "Turn it real" (Firebase/Supabase/
   your backend) is an optional next step they own, never required.

   `welcomed` gates the one-time Welcome screen; it lives in session
   memory so it shows once per sign-in, not on every tab change.
   ============================================================ */

import { createContext, useContext, useState, type ReactNode } from "react";

type Session = {
  authed: boolean;
  welcomed: boolean;
  /** whether the what's-new tour has auto-run for this sign-in (so it
      fires once per login, not on every app remount / breakpoint cross). */
  toured: boolean;
  email: string | null;
  signIn: (email?: string) => void;
  signOut: () => void;
  finishWelcome: () => void;
  markToured: () => void;
};

const SessionCtx = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [welcomed, setWelcomed] = useState(false);
  const [toured, setToured] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const value: Session = {
    authed,
    welcomed,
    toured,
    email,
    signIn: (e) => {
      setEmail(e ?? null);
      setAuthed(true);
    },
    signOut: () => {
      setAuthed(false);
      setWelcomed(false);
      setToured(false);
      setEmail(null);
    },
    finishWelcome: () => setWelcomed(true),
    markToured: () => setToured(true),
  };

  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
}

export function useSession(): Session {
  const ctx = useContext(SessionCtx);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
}
