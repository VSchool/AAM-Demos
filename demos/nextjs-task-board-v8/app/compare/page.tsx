"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-store";
import { getToken } from "@/lib/api-client";

const V7_URL = "https://vschool.github.io/AAM-Demos/nextjs-task-board-v7/";

// A small live "see it" panel: runs a fetch and shows the raw result, so the
// backend difference is demonstrated, not just described.
function LiveFetch({
  label,
  run,
}: {
  label: string;
  run: () => Promise<string>;
}) {
  const [output, setOutput] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    try {
      setOutput(await run());
    } catch (err) {
      setOutput(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="cn-compare-live">
      <button type="button" className="cn-compare-run" onClick={go} disabled={busy}>
        {busy ? "Running…" : label}
      </button>
      {output != null ? (
        <pre className="cn-compare-output">
          <code>{output}</code>
        </pre>
      ) : null}
    </div>
  );
}

export default function ComparePage() {
  const { user, ready } = useAuth();
  const signedIn = ready && !!user;

  async function fetchTaskList(): Promise<string> {
    const token = getToken();
    if (!token) {
      return "You're not logged in. Log in first, then run this — the request needs your token.";
    }
    const res = await fetch("/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const tasks = (data.tasks ?? []) as Array<{ id: string; title: string; status: string }>;
    const preview = tasks.slice(0, 4).map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
    }));
    return [
      `GET /api/tasks  →  ${res.status} ${res.statusText}`,
      `${tasks.length} task(s) returned for your account. First few:`,
      JSON.stringify(preview, null, 2),
      "",
      "↳ Open DevTools → Network and run this again: you'll see this exact",
      "  request and JSON response. In V7 there was no request — the data",
      "  was just sitting in your browser's localStorage.",
    ].join("\n");
  }

  async function fetchWeather(): Promise<string> {
    const res = await fetch("/api/weather?city=Provo");
    const data = await res.json();
    return [
      `GET /api/weather?city=Provo  →  ${res.status} ${res.statusText}`,
      JSON.stringify(data, null, 2),
      "",
      "↳ Notice what's NOT here: the OpenWeatherMap API key. The browser",
      "  called OUR route; OUR server called OpenWeatherMap with the secret",
      "  key. Search the whole Network tab — the key never appears.",
    ].join("\n");
  }

  return (
    <main className="cn-page">
      <div className="cn-eyebrow">V7 → V8 walkthrough</div>
      <h1 className="cn-h1">What a backend actually adds.</h1>
      <p className="cn-lede">
        V7 and V8 are the <strong>same app</strong>. Same board, same UI kit, same
        drag-and-drop. The only difference is that V8 has a backend — and that one
        difference is the whole of what changed below. Open V7 in another tab and
        compare as you go.
      </p>

      <div className="cn-banner cn-banner-info" style={{ marginTop: 8 }}>
        <div className="cn-banner-meta">how to read this page</div>
        <p>
          Each row shows the <strong>V7 “before”</strong> on the left and the{" "}
          <strong>V8 “after”</strong> on the right. Where you see a{" "}
          <strong>Run</strong> button, click it — it makes a real request so you
          can watch the backend work in your browser&apos;s Network tab.
        </p>
      </div>

      <p style={{ margin: "18px 0 0" }}>
        <a
          className="cn-back-link"
          href={V7_URL}
          target="_blank"
          rel="noopener"
        >
          Open V7 (the “before”) in a new tab ↗
        </a>
      </p>

      {/* 1 — Accounts + cross-device persistence */}
      <section className="cn-section">
        <div className="cn-section-tag">difference 01 · persistence</div>
        <h2 className="cn-section-h">Your tasks follow you to another device.</h2>
        <div className="cn-compare-grid">
          <div className="cn-tile cn-compare-before">
            <div className="cn-tile-meta">V7 · before</div>
            <h3 className="cn-tile-title">Saved in this browser only.</h3>
            <p className="cn-tile-sub">
              V7 keeps your board in <code>localStorage</code>. It survives a
              refresh — but open the app on your phone, or in a different browser,
              and it&apos;s empty. The data never left the machine you typed it on.
            </p>
          </div>
          <div className="cn-tile cn-tile-green cn-compare-after">
            <div className="cn-tile-meta">V8 · after</div>
            <h3 className="cn-tile-title">Saved to your account, in a database.</h3>
            <p className="cn-tile-sub">
              V8 stores tasks in MongoDB behind a real login. Log in on another
              device and the same board is there — because it lives on the server,
              not in one browser. That&apos;s the headline of what a backend adds.
            </p>
          </div>
        </div>
        <p className="cn-compare-try">
          Try it: {signedIn ? "you're logged in" : "log in"}, add a task, then open{" "}
          <Link href="/login">this site in a second browser</Link> and log in as
          the same user — the task is waiting.
        </p>
      </section>

      {/* 2 — Real auth */}
      <section className="cn-section">
        <div className="cn-section-tag">difference 02 · accounts</div>
        <h2 className="cn-section-h">A real login and profile.</h2>
        <div className="cn-compare-grid">
          <div className="cn-tile cn-compare-before">
            <div className="cn-tile-meta">V7 · before</div>
            <h3 className="cn-tile-title">No accounts at all.</h3>
            <p className="cn-tile-sub">
              V7 has no users. Anyone who opens it sees the same board. There&apos;s
              nothing to log into, because there&apos;s no server to log into.
            </p>
          </div>
          <div className="cn-tile cn-tile-yellow cn-compare-after">
            <div className="cn-tile-meta">V8 · after</div>
            <h3 className="cn-tile-title">Sign up, log in, log out.</h3>
            <p className="cn-tile-sub">
              V8 has signup and login. Passwords are hashed with bcrypt (never
              stored as text), and a JWT proves who you are on every request. Your{" "}
              <Link href="/profile" style={{ color: "inherit", textDecoration: "underline" }}>
                profile page
              </Link>{" "}
              is only served to an authenticated request.
            </p>
          </div>
        </div>
      </section>

      {/* 3 — The list is an API response */}
      <section className="cn-section">
        <div className="cn-section-tag">difference 03 · data over an API</div>
        <h2 className="cn-section-h">The task list arrives as an API response.</h2>
        <div className="cn-compare-grid">
          <div className="cn-tile cn-compare-before">
            <div className="cn-tile-meta">V7 · before</div>
            <h3 className="cn-tile-title">No network request.</h3>
            <p className="cn-tile-sub">
              In V7 the board reads straight from <code>localStorage</code> — open
              the Network tab and you&apos;ll see no request for your tasks, because
              there&apos;s no server to ask.
            </p>
          </div>
          <div className="cn-tile cn-tile-pink cn-compare-after">
            <div className="cn-tile-meta">V8 · after</div>
            <h3 className="cn-tile-title">
              <code>GET /api/tasks</code> on every load.
            </h3>
            <p className="cn-tile-sub">
              V8 fetches your tasks from the server, scoped to your account. Run it
              below, then open DevTools → Network and run it again to watch the
              request and JSON response.
            </p>
          </div>
        </div>
        <LiveFetch label="Run GET /api/tasks" run={fetchTaskList} />
      </section>

      {/* 4 — The hidden third-party key */}
      <section className="cn-section">
        <div className="cn-section-tag">difference 04 · the hidden key</div>
        <h2 className="cn-section-h">A third-party API key the browser never sees.</h2>
        <div className="cn-compare-grid">
          <div className="cn-tile cn-compare-before">
            <div className="cn-tile-meta">V7 · before</div>
            <h3 className="cn-tile-title">No third-party data.</h3>
            <p className="cn-tile-sub">
              V7 is frontend-only, so it can&apos;t safely call a key-protected API
              — a key shipped to the browser is a key anyone can steal from the
              Network tab.
            </p>
          </div>
          <div className="cn-tile cn-tile-dark cn-compare-after">
            <div className="cn-tile-meta">V8 · after</div>
            <h3 className="cn-tile-title">Weather, fetched server-side.</h3>
            <p className="cn-tile-sub">
              The planning weather on your board comes from OpenWeatherMap. The
              browser calls <code>/api/weather</code>; the server adds the secret
              key and calls OpenWeatherMap. Run it and check: the key isn&apos;t in
              the response, and it isn&apos;t anywhere in the Network tab.
            </p>
          </div>
        </div>
        <LiveFetch label="Run GET /api/weather" run={fetchWeather} />
      </section>

      <section className="cn-section">
        <h2 className="cn-section-h">That&apos;s the whole difference.</h2>
        <p className="cn-aside" style={{ marginBottom: 18 }}>
          Persistence, accounts, data over an API, and a protected secret. Four
          capabilities, one cause: V8 has a server and a database. Everything else
          — the board, the cards, the filters — is identical to V7.
        </p>
        <Link href="/tasks" className="cn-back-link">
          Go to your board →
        </Link>
      </section>
    </main>
  );
}
