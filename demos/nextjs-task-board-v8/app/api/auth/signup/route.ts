import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import { hashPassword, signToken } from "@/lib/auth";
import { validateSignup } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/auth/signup — create an account.
// Hashes the password with bcrypt, stores the hash (never the plaintext),
// then issues a JWT so the new user is logged in immediately.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = validateSignup(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { email, password, name } = result.value;

  try {
    await connectToDatabase();

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      // Don't leak which emails exist beyond what signup inevitably reveals;
      // a generic conflict message is fine here.
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({ email, passwordHash, name });

    const token = signToken({ userId: String(user._id), email: user.email });
    return NextResponse.json(
      { token, user: { email: user.email, name: user.name } },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/auth/signup]", err);
    return NextResponse.json(
      { error: "Could not create the account. Try again." },
      { status: 500 },
    );
  }
}
