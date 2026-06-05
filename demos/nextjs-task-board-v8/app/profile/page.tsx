"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGate from "@/components/AuthGate";
import { useAuth } from "@/lib/auth-store";
import { useTaskStore } from "@/lib/task-store";
import { apiFetch } from "@/lib/api-client";

function ProfileBody() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { tasks } = useTaskStore();
  const [joined, setJoined] = useState<string | null>(null);

  // Pull the full profile (incl. join date) from the protected endpoint.
  useEffect(() => {
    let cancelled = false;
    apiFetch<{ user: { createdAt?: string } }>("/api/auth/me")
      .then((data) => {
        if (cancelled || !data.user.createdAt) return;
        setJoined(
          new Date(data.user.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const initials =
    (user?.name || "")
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const openCount = tasks.filter((t) => t.status !== "done" && t.status !== "canceled").length;

  return (
    <main className="cn-page">
      <div className="cn-eyebrow">Your account</div>
      <h1 className="cn-h1">Profile.</h1>
      <p className="cn-lede">
        You&apos;re signed in. This page is served only to an authenticated
        request — the server checks your token before it answers.
      </p>

      <section className="cn-section">
        <div className="cn-profile-card">
          <div className="cn-profile-avatar" aria-hidden="true">
            {initials}
          </div>
          <div className="cn-profile-meta">
            <dl className="cn-profile-list">
              <div className="cn-profile-row">
                <dt>Name</dt>
                <dd>{user?.name}</dd>
              </div>
              <div className="cn-profile-row">
                <dt>Email</dt>
                <dd>{user?.email}</dd>
              </div>
              <div className="cn-profile-row">
                <dt>Member since</dt>
                <dd>{joined ?? "—"}</dd>
              </div>
              <div className="cn-profile-row">
                <dt>Open tasks</dt>
                <dd>{openCount}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
          <button
            type="button"
            className="cn-newtask-cancel"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            Log out
          </button>
        </div>
      </section>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <AuthGate>
      <ProfileBody />
    </AuthGate>
  );
}
