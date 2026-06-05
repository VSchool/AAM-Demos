"use client";

import { useState } from "react";
import Link from "next/link";

// Where the Fullstack ("after") app lives. Swap this for the deployed Fullstack
// URL when it's online; locally the Fullstack app runs on :3000.
const FULLSTACK_URL = "http://localhost:3000/";

// A small live "see it" panel: runs some code and shows the raw result. On the
// Frontend app the interesting beat is that NOTHING hits the network — the data
// was already in your browser.
function LiveLocal({
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
  async function readTasks(): Promise<string> {
    const raw =
      typeof window !== "undefined"
        ? window.localStorage.getItem("cadence:tasks:v7")
        : null;
    const tasks = (raw ? JSON.parse(raw) : []) as Array<{
      id: string;
      title: string;
      status: string;
    }>;
    const preview = tasks.slice(0, 4).map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
    }));
    return [
      `localStorage.getItem("cadence:tasks:v7")`,
      `${tasks.length} task(s) found — in THIS browser. First few:`,
      JSON.stringify(preview, null, 2),
      "",
      "↳ Open DevTools → Network and run this again: nothing fires. There's",
      "  no server to call — the board was already sitting in localStorage.",
      "  The catch: it only exists here. Another device sees an empty board.",
    ].join("\n");
  }

  async function readBoards(): Promise<string> {
    const raw =
      typeof window !== "undefined"
        ? window.localStorage.getItem("cadence:boards:v7")
        : null;
    const boards = (raw ? JSON.parse(raw) : []) as Array<{
      id: string;
      name: string;
    }>;
    return [
      `localStorage.getItem("cadence:boards:v7")`,
      `${boards.length} board(s) stored in this browser:`,
      JSON.stringify(
        boards.map((b) => ({ id: b.id, name: b.name })),
        null,
        2,
      ),
      "",
      "↳ Create or delete a board, then run this again — it updates instantly,",
      "  no request, no database. Just a JSON string in your browser.",
    ].join("\n");
  }

  return (
    <main className="cn-page">
      <div className="cn-eyebrow">Frontend → Fullstack walkthrough</div>
      <h1 className="cn-h1">Everything here runs in your browser.</h1>
      <p className="cn-lede">
        The Frontend app and the Fullstack app are the <strong>same app</strong>.
        Same board, same UI kit, same drag-and-drop. This is the{" "}
        <strong>Frontend</strong> version: no server, no sign-in — it runs
        entirely in your browser, which makes it dead simple to ship and instant
        to use. What it <em>can&apos;t</em> do is exactly what a backend adds.
        Open the Fullstack app in another tab and compare as you go.
      </p>

      <div className="cn-banner cn-banner-info" style={{ marginTop: 8 }}>
        <div className="cn-banner-meta">how to read this page</div>
        <p>
          Each row shows the <strong>Frontend app “before”</strong> on the left
          and the <strong>Fullstack app “after”</strong> on the right. Where you
          see a <strong>Run</strong> button, click it — on this app it reads
          straight from your browser, so you can confirm in DevTools → Network
          that <em>nothing</em> is fetched.
        </p>
      </div>

      <p style={{ margin: "18px 0 0" }}>
        <a
          className="cn-back-link"
          href={FULLSTACK_URL}
          target="_blank"
          rel="noopener"
        >
          Open the Fullstack app (the “after”) in a new tab ↗
        </a>
      </p>

      {/* Capability matrix: what's shared, and what the backend unlocks */}
      <section className="cn-section">
        <div className="cn-section-tag">side by side</div>
        <h2 className="cn-section-h">Same app — the backend just unlocks more.</h2>

        <div className="cn-cap-legend">
          <span className="cn-cap-legend-item">
            <span className="cn-cap-pill cn-cap-pill-yes">✓</span> Supported
          </span>
          <span className="cn-cap-legend-item">
            <span className="cn-cap-pill cn-cap-pill-no">✕</span> Not possible
          </span>
          <span className="cn-cap-legend-item">
            <span className="cn-cap-newtag">NEW</span> Unlocked by the backend
          </span>
        </div>

        <table className="cn-cap-table">
          <thead>
            <tr>
              <th className="cn-cap-corner">Capability</th>
              <th className="cn-cap-col cn-cap-col-after">Frontend app</th>
              <th className="cn-cap-col">Fullstack app</th>
            </tr>
          </thead>
          <tbody>
            <tr className="cn-cap-band">
              <td colSpan={3}>Shared — identical in both</td>
            </tr>
            {[
              "Board & list views",
              "Drag to reorder tasks",
              "Fast filters & search",
              "A detail page per task",
              "Multiple boards",
            ].map((cap) => (
              <tr key={cap}>
                <th scope="row" className="cn-cap-rowhead">{cap}</th>
                <td className="cn-cap-cell cn-cap-after">
                  <span className="cn-cap-pill cn-cap-pill-yes">✓</span>
                </td>
                <td className="cn-cap-cell">
                  <span className="cn-cap-pill cn-cap-pill-yes">✓</span>
                </td>
              </tr>
            ))}

            <tr className="cn-cap-band cn-cap-band-accent">
              <td colSpan={3}>Only possible with a backend</td>
            </tr>
            {[
              "Tasks saved across devices",
              "Accounts, login & profile",
              "Task list over a real API",
              "Protected third-party API keys",
            ].map((cap) => (
              <tr key={cap}>
                <th scope="row" className="cn-cap-rowhead">{cap}</th>
                <td className="cn-cap-cell cn-cap-after">
                  <span className="cn-cap-pill cn-cap-pill-no">✕</span>
                </td>
                <td className="cn-cap-cell cn-cap-new">
                  <span className="cn-cap-pill cn-cap-pill-yes">✓</span>
                  <span className="cn-cap-newtag">NEW</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="cn-compare-try">
          Try it: add a task, then close this tab and reopen it — your board is
          still here, saved in this browser. Open the same app on another device,
          though, and it&apos;s empty. That&apos;s the line a backend crosses.
        </p>
      </section>

      {/* See where the data lives, live */}
      <section className="cn-section">
        <div className="cn-section-tag">see it live</div>
        <h2 className="cn-section-h">See where your data lives.</h2>
        <p className="cn-aside" style={{ marginBottom: 16 }}>
          These buttons read straight from your browser — no request goes out.
          Run them, then open DevTools → Network and confirm the tab stays empty.
        </p>
        <div className="cn-compare-live-grid">
          <LiveLocal label="Read tasks from localStorage" run={readTasks} />
          <LiveLocal label="Read boards from localStorage" run={readBoards} />
        </div>
      </section>

      <section className="cn-section">
        <h2 className="cn-section-h">That&apos;s the whole difference.</h2>
        <p className="cn-aside" style={{ marginBottom: 18 }}>
          The board, the cards, the filters, the drag-and-drop — all of it is
          real and runs with zero backend. The moment you need tasks on another
          device, accounts, a real API, or a hidden key, that&apos;s when you add
          a server. That&apos;s the Fullstack app — same screens, one new layer.
        </p>
        <Link href="/" className="cn-back-link">
          Go to your boards →
        </Link>
      </section>
    </main>
  );
}
