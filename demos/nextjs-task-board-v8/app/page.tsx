"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";
import BoardsHome from "@/components/BoardsHome";

export default function Home() {
  const { user, ready } = useAuth();

  // Logged in → show your boards. Logged out → the login page below.
  if (ready && user) return <BoardsHome />;
  return <LoginPanel />;
}

function LoginPanel() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign you in.");
      setBusy(false);
    }
  }

  return (
    <main className="cn-page cn-auth-page">
      <div className="cn-eyebrow">task board</div>
      <h1 className="cn-h1">Cadence</h1>
      <p className="cn-subtitle">Plan, sort, and ship the work.</p>
      <p className="cn-lede">
        Cadence is a lightweight task board for engineering teams — board and
        list views, drag-to-reorder, and a detail page for every ticket. Log in
        to pick up your board on any device.
      </p>

      <form className="cn-auth-card" onSubmit={submit}>
        {error ? (
          <div className="cn-auth-error" role="alert">
            {error}
          </div>
        ) : null}

        <label className="cn-newtask-field">
          <span className="cn-newtask-label">Email</span>
          <input
            className="cn-newtask-input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoFocus
          />
        </label>
        <label className="cn-newtask-field">
          <span className="cn-newtask-label">Password</span>
          <input
            className="cn-newtask-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        <button type="submit" className="cn-auth-submit" disabled={busy}>
          {busy ? "Signing in…" : "Log in"}
        </button>

        <p className="cn-auth-switch">
          New here? <Link href="/signup">Create an account →</Link>
        </p>
      </form>
    </main>
  );
}
