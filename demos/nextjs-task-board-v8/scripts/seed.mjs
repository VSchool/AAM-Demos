// ============================================================
// Seed script — creates the known demo user and their tasks.
//
// This backs frozen behavior #3: "log in on another device and your tasks are
// still here." The seed account's email/password come from .env.local
// (SEED_USER_EMAIL / SEED_USER_PASSWORD) so the login can be reproduced on
// any device. Idempotent: re-running resets the seed user's board.
//
// Run with:  npm run seed
// ============================================================

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;
const SEED_EMAIL = (process.env.SEED_USER_EMAIL || "demo@cadence.app").toLowerCase();
const SEED_PASSWORD = process.env.SEED_USER_PASSWORD || "cadence-demo-2026";
const SEED_NAME = "Cadence Demo";

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set. Add it to .env.local.");
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

// Schema mirrors lib/models/Task.ts. timestamps:false here so the seed can set
// staggered createdAt/updatedAt and the board looks alive.
const TaskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    key: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: { type: String, default: "todo" },
    priority: { type: String, default: "P2" },
    assignee: { type: String, default: "??" },
    due: { type: String, default: "—" },
    labels: { type: [String], default: [] },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: false },
);
TaskSchema.index({ userId: 1, key: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

// minutesAgo → Date helper for staggered timestamps.
const now = Date.now();
const ago = (min) => new Date(now - min * 60 * 1000);

const TASKS = [
  { key: "CDN-042", title: "Wire client-side filter to server-rendered task list", description: "Confirm the filter state lives in the client wrapper, not the server parent. The server component owns the data read; the client receives the array as a prop and slices it locally.", status: "in_progress", priority: "P0", assignee: "MP", due: "today", labels: ["server-component", "routing"], min: 2 },
  { key: "CDN-041", title: "Add generateStaticParams to the dynamic detail route", description: "Pre-render every known task at build time so the static export works. generateStaticParams returns an array of { id } objects matching the dynamic route.", status: "in_progress", priority: "P1", assignee: "EK", due: "May 19", labels: ["routing"], min: 14 },
  { key: "CDN-040", title: "Add hover state to status flags", description: "Chevron flags should lift slightly on hover with a 100ms transition. Confirm contrast on every status color stays above 4.5:1.", status: "in_progress", priority: "P2", assignee: "MP", due: "May 21", labels: ["ui", "a11y"], min: 60 },
  { key: "CDN-039", title: "Convert /tasks page to an async server component", description: "Lift the data read out of useEffect; render at request time, no spinner state machine.", status: "blocked", priority: "P1", assignee: "ZR", due: "overdue", labels: ["server-component", "blocked-by-design"], min: 60 * 26 },
  { key: "CDN-038", title: "Draft a shared layout with the global nav and footer", description: "One layout wraps every page; loading and error boundaries land here too.", status: "todo", priority: "P2", assignee: "BY", due: "May 22", labels: ["chore", "layout"], min: 60 * 27 },
  { key: "CDN-037", title: "Audit AI-generated TypeScript prop types", description: "Confirm every component prop has an explicit interface. Watch for AI generating `any` or implicit any types.", status: "todo", priority: "P3", assignee: "MP", due: "May 26", labels: ["chore"], min: 60 * 49 },
  { key: "CDN-036", title: "Wire the error boundary at the detail route", description: "error.tsx catches errors thrown inside its segment. Test with an intentional throw.", status: "todo", priority: "P2", assignee: "EK", due: "May 23", labels: ["error-state"], min: 60 * 50 },
  { key: "CDN-035", title: "Audit AI-generated JSX for raw HTML injection of user input", description: "React escapes {userInput} in JSX by default. Watch for AI generating render paths that bypass this protection.", status: "done", priority: "P1", assignee: "MP", due: "May 14", labels: ["security"], min: 60 * 96 },
  { key: "CDN-034", title: "Scaffold three file-routed pages", description: "Home, /tasks, /about via App Router file-based routing.", status: "done", priority: "P2", assignee: "MP", due: "May 13", labels: ["routing"], min: 60 * 120 },
  { key: "CDN-033", title: "Pick a UI kit direction for the task-board demo", description: "Three directions surveyed: Build Log, Broadsheet, Inverted Studio. Locked the Inverted Studio direction.", status: "done", priority: "P2", assignee: "MP", due: "May 18", labels: ["design"], min: 60 * 5 },
  { key: "CDN-031", title: "Stub the loading skeleton component", description: "Ships as part of the layout-states work, not as a one-off.", status: "canceled", priority: "P3", assignee: "EK", due: "—", labels: [], min: 60 * 200 },
  { key: "CDN-030", title: "Prototype kanban drag-and-drop", description: "Kept as a future-work marker. Real DnD belongs after persistence lands.", status: "backlog", priority: "P3", assignee: "BY", due: "—", labels: ["future"], min: 60 * 210 },
];

async function main() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log("Connected.");

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
  let user = await User.findOne({ email: SEED_EMAIL });
  if (user) {
    user.passwordHash = passwordHash;
    user.name = SEED_NAME;
    await user.save();
    console.log(`Updated existing seed user: ${SEED_EMAIL}`);
  } else {
    user = await User.create({ email: SEED_EMAIL, passwordHash, name: SEED_NAME });
    console.log(`Created seed user: ${SEED_EMAIL}`);
  }

  // Reset this user's board so re-running is idempotent.
  await Task.deleteMany({ userId: user._id });
  const docs = TASKS.map((t) => ({
    userId: user._id,
    key: t.key,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    assignee: t.assignee,
    due: t.due,
    labels: t.labels,
    createdAt: ago(t.min),
    updatedAt: ago(t.min),
  }));
  await Task.insertMany(docs);
  console.log(`Seeded ${docs.length} tasks for ${SEED_EMAIL}.`);

  await mongoose.disconnect();
  console.log("Done.");
  console.log(`\nLog in with:\n  email:    ${SEED_EMAIL}\n  password: ${SEED_PASSWORD}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
