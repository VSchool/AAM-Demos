import mongoose from "mongoose";

// ============================================================
// Mongoose connection — cached across serverless invocations.
//
// On Vercel, each API route runs in a serverless function that may be reused
// across many requests (warm) or spun up fresh (cold). If we called
// mongoose.connect() on every request we'd open a new connection each time and
// quickly exhaust MongoDB Atlas's small connection pool. So we cache the
// connection promise on the Node global and reuse it.
// ============================================================

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// `global` persists across hot reloads in dev and across warm invocations in
// serverless, so the cache survives where module-level `let` would not.
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache =
  global._mongooseCache ?? (global._mongooseCache = { conn: null, promise: null });

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (local dev) or the Vercel project env (production).",
    );
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    // Reset so a later request can retry instead of being stuck on a rejected promise.
    cache.promise = null;
    throw err;
  }

  return cache.conn;
}
