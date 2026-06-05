import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Task } from "@/lib/models/Task";
import { getAuthFromRequest } from "@/lib/auth";
import { validateTaskInput } from "@/lib/validation";
import { serializeTask } from "@/lib/serialize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// All three handlers scope by BOTH userId and key, so one user can never read
// or mutate another user's task even by guessing the id.

// GET /api/tasks/:id — one task.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const { id } = await params;

  try {
    await connectToDatabase();
    const doc = await Task.findOne({ userId: auth.userId, key: id });
    if (!doc) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }
    return NextResponse.json({ task: serializeTask(doc) });
  } catch (err) {
    console.error("[GET /api/tasks/:id]", err);
    return NextResponse.json({ error: "Could not load the task." }, { status: 500 });
  }
}

// PUT /api/tasks/:id — update (partial). Validates every provided field.
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = validateTaskInput(body, { partial: true });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const doc = await Task.findOneAndUpdate(
      { userId: auth.userId, key: id },
      { $set: result.value },
      { new: true, runValidators: true },
    );
    if (!doc) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }
    return NextResponse.json({ task: serializeTask(doc) });
  } catch (err) {
    console.error("[PUT /api/tasks/:id]", err);
    return NextResponse.json({ error: "Could not update the task." }, { status: 500 });
  }
}

// DELETE /api/tasks/:id — remove.
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const { id } = await params;

  try {
    await connectToDatabase();
    const doc = await Task.findOneAndDelete({ userId: auth.userId, key: id });
    if (!doc) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("[DELETE /api/tasks/:id]", err);
    return NextResponse.json({ error: "Could not delete the task." }, { status: 500 });
  }
}
