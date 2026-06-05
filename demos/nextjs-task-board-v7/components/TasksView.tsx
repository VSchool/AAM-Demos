"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import TaskBoard from "@/components/TaskBoard";
import TaskListSkeleton from "@/components/TaskListSkeleton";
import { useTaskStore } from "@/lib/task-store";
import { useBoards } from "@/lib/board-store";
import { BOARD_COLORS } from "@/lib/boards";

export default function TasksView() {
  const { hydrated, setActiveBoard, activeBoardId } = useTaskStore();
  const { boards, hydrated: boardsHydrated } = useBoards();
  const params = useSearchParams();
  const boardParam = params.get("board");

  // Resolve which board to show: the ?board= id if it exists, else the first
  // board. Falls back to null until boards have loaded.
  const resolvedBoardId =
    (boardParam && boards.find((b) => b.id === boardParam)?.id) ||
    boards[0]?.id ||
    null;

  // Tell the task store which board we're viewing (drives filtering + the board
  // new tasks are created on).
  useEffect(() => {
    setActiveBoard(resolvedBoardId);
  }, [resolvedBoardId, setActiveBoard]);

  const activeBoard = boards.find(
    (b) => b.id === (activeBoardId ?? resolvedBoardId),
  );

  return (
    <main className="cn-page">
      <Link
        href="/"
        className="cn-back-link"
        style={{ marginBottom: 14, display: "inline-flex" }}
      >
        ← All boards
      </Link>
      <div className="cn-eyebrow">
        {activeBoard ? (
          <>
            <span
              className="cn-board-eyebrow-dot"
              style={{ background: BOARD_COLORS[activeBoard.color] }}
              aria-hidden="true"
            />
            board
          </>
        ) : (
          "/tasks"
        )}
      </div>
      <h1 className="cn-h1">{activeBoard ? activeBoard.name : "All tasks."}</h1>
      <p className="cn-lede">
        Create a task, filter by status, and sort by priority, due date, or
        recent activity. Click into any ticket to edit it. Your board is saved
        in this browser.
      </p>

      <section className="cn-section">
        <div className="cn-section-tag">your board</div>
        <h2 className="cn-section-h">Create, filter, click into detail to edit</h2>

        {!hydrated || !boardsHydrated ? <TaskListSkeleton /> : <TaskBoard />}
      </section>
    </main>
  );
}
