import { Suspense } from "react";
import TasksView from "@/components/TasksView";

export const metadata = {
  title: "Tasks · Cadence",
  description:
    "Your task board — create, filter, sort, and open any ticket to edit it. Saved in your browser.",
};

export default function TasksPage() {
  return (
    <Suspense fallback={null}>
      <TasksView />
    </Suspense>
  );
}
