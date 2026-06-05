"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth-store";

// Client-side route guard. Wrap protected page content in <AuthGate>. While
// the session check is resolving it shows a quiet placeholder; if there's no
// user it redirects to /login. (The API routes enforce auth on the server too
// — this is just so the UI never renders a protected screen to a logged-out
// visitor.)
export default function AuthGate({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready) {
    return (
      <main className="cn-page">
        <div className="cn-eyebrow">Loading…</div>
        <div className="cn-skel" style={{ width: 220, height: 28, marginBottom: 16 }} />
        <div className="cn-skel" style={{ width: "60%", height: 16 }} />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="cn-page">
        <div className="cn-eyebrow">Redirecting to login…</div>
      </main>
    );
  }

  return <>{children}</>;
}
