"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";

export default function SignupPage() {
  const router = useRouter();
  const { user, ready, signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace("/tasks");
  }, [ready, user, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signup(name, email, password);
      router.push("/tasks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the account.");
      setBusy(false);
    }
  }

  return (
    <main className="cn-page cn-auth-page">
      <div className="cn-eyebrow">Get started</div>
      <h1 className="cn-h1">Create your account.</h1>
      <p className="cn-lede">
        One account, every device. Your tasks save to the cloud the moment you
        sign up.
      </p>

      <form className="cn-auth-card" onSubmit={submit}>
        {error ? (
          <div className="cn-auth-error" role="alert">
            {error}
          </div>
        ) : null}

        <label className="cn-newtask-field">
          <span className="cn-newtask-label">Name</span>
          <input
            className="cn-newtask-input"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
            required
            autoFocus
          />
        </label>
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
          />
        </label>
        <label className="cn-newtask-field">
          <span className="cn-newtask-label">Password</span>
          <input
            className="cn-newtask-input"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
          <span className="cn-auth-hint">
            Stored as a bcrypt hash — never in plaintext.
          </span>
        </label>

        <button type="submit" className="cn-auth-submit" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </button>

        <p className="cn-auth-switch">
          Already have an account? <Link href="/login">Log in →</Link>
        </p>
      </form>
    </main>
  );
}
