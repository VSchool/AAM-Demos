"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBoards } from "@/lib/board-store";
import { useAuth } from "@/lib/auth-store";
import { BOARD_COLORS } from "@/lib/boards";

function firstName(name?: string): string {
  if (!name) return "there";
  return name.trim().split(/\s+/)[0] || "there";
}

// The logged-in home page: a grid of the user's boards plus a card to create a
// new one. Each board links into /tasks?board=<id>.
export default function BoardsHome() {
  const router = useRouter();
  const { user } = useAuth();
  const { boards, hydrated, error, createBoard, deleteBoard } = useBoards();

  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function remove(id: string) {
    setDeletingId(id);
    await deleteBoard(id);
    setDeletingId(null);
    setConfirmId(null);
  }

  async function submit() {
    const trimmed = name.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    const board = await createBoard(trimmed);
    setBusy(false);
    setName("");
    setCreating(false);
    if (board) router.push(`/tasks?board=${board.id}`);
  }

  return (
    <main className="cn-page">
      <div className="cn-eyebrow">Cadence · your boards</div>
      <h1 className="cn-h1">Welcome back, {firstName(user?.name)}.</h1>
      <p className="cn-lede">
        Pick a board to jump back in, or spin up a new one for a different
        project. Every board and its tasks live in the cloud, scoped to your
        account.
      </p>

      {error ? (
        <div className="cn-auth-error" role="alert" style={{ marginBottom: 16 }}>
          {error}
        </div>
      ) : null}

      <section className="cn-section">
        <div className="cn-section-tag">your boards</div>
        <h2 className="cn-section-h">Boards</h2>

        {!hydrated ? (
          <div className="cn-boards-grid">
            {[0, 1, 2].map((i) => (
              <div key={i} className="cn-board-tile cn-board-tile-skel">
                <div className="cn-skel" style={{ width: "60%", height: 20 }} />
                <div
                  className="cn-skel"
                  style={{ width: "30%", height: 12, marginTop: 12 }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="cn-boards-grid">
            {boards.map((board) => (
              <div
                key={board.id}
                className="cn-board-tile-wrap"
                style={
                  {
                    "--board-accent": BOARD_COLORS[board.color],
                  } as React.CSSProperties
                }
              >
                <Link href={`/tasks?board=${board.id}`} className="cn-board-tile">
                  <span className="cn-board-tile-stripe" aria-hidden="true" />
                  <span className="cn-board-tile-name">{board.name}</span>
                  <span className="cn-board-tile-meta">
                    {board.taskCount} {board.taskCount === 1 ? "task" : "tasks"}
                  </span>
                  <span className="cn-board-tile-open">Open the board →</span>
                </Link>

                {confirmId === board.id ? (
                  <div className="cn-board-confirm" role="dialog" aria-label={`Delete ${board.name}?`}>
                    <span className="cn-board-confirm-text">Delete this board?</span>
                    <div className="cn-board-confirm-actions">
                      <button
                        type="button"
                        className="cn-board-confirm-yes"
                        onClick={() => void remove(board.id)}
                        disabled={deletingId === board.id}
                      >
                        {deletingId === board.id ? "Deleting…" : "Delete"}
                      </button>
                      <button
                        type="button"
                        className="cn-board-confirm-no"
                        onClick={() => setConfirmId(null)}
                        disabled={deletingId === board.id}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="cn-board-delete"
                    onClick={() => setConfirmId(board.id)}
                    aria-label={`Delete board ${board.name}`}
                    title="Delete board"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {creating ? (
              <div className="cn-board-tile cn-board-tile-new">
                {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
                <input
                  className="cn-board-new-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void submit();
                    } else if (e.key === "Escape") {
                      setName("");
                      setCreating(false);
                    }
                  }}
                  placeholder="Board name"
                  autoFocus
                  disabled={busy}
                  aria-label="New board name"
                />
                <div className="cn-board-new-actions">
                  <button
                    type="button"
                    className="cn-newtask-submit"
                    onClick={() => void submit()}
                    disabled={busy || !name.trim()}
                  >
                    {busy ? "Creating…" : "Create board"}
                  </button>
                  <button
                    type="button"
                    className="cn-newtask-cancel"
                    onClick={() => {
                      setName("");
                      setCreating(false);
                    }}
                    disabled={busy}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="cn-board-tile cn-board-tile-add"
                onClick={() => setCreating(true)}
              >
                <span className="cn-board-tile-add-plus" aria-hidden="true">
                  +
                </span>
                <span className="cn-board-tile-add-label">New board</span>
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
