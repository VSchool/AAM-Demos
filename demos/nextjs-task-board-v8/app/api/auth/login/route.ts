import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/User";
import { verifyPassword, signToken } from "@/lib/auth";
import { validateLogin } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/auth/login — verify credentials and issue a JWT.
// On any failure we return the SAME generic 401 whether the email is unknown
// or the password is wrong, so the response never reveals which emails exist.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = validateLogin(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { email, password } = result.value;

  try {
    await connectToDatabase();

    const user = await User.findOne({ email });
    const INVALID = NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
    if (!user) return INVALID;

    const match = await verifyPassword(password, user.passwordHash);
    if (!match) return INVALID;

    const token = signToken({ userId: String(user._id), email: user.email });
    return NextResponse.json({
      token,
      user: { email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return NextResponse.json(
      { error: "Could not sign you in. Try again." },
      { status: 500 },
    );
  }
}
