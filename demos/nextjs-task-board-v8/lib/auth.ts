import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ============================================================
// Auth helpers. The flow W6 teaches, made real:
//   signup/login → bcrypt-hash the password → on login, issue a JWT →
//   client stores the JWT and sends it as `Authorization: Bearer <token>` →
//   protected routes verify the token before touching the database.
// No black-box auth library — just bcrypt + jsonwebtoken.
// ============================================================

const SALT_ROUNDS = 10;
const TOKEN_TTL = "7d";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set. Add it to .env.local (local dev) or the Vercel project env (production).",
    );
  }
  return secret;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export interface TokenPayload {
  userId: string;
  email: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: TOKEN_TTL });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, getSecret());
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded &&
      "email" in decoded
    ) {
      return { userId: String(decoded.userId), email: String(decoded.email) };
    }
    return null;
  } catch {
    return null;
  }
}

// Pull the bearer token out of a request and verify it. Returns the payload
// (the authenticated user) or null if missing/invalid/expired.
export function getAuthFromRequest(req: Request): TokenPayload | null {
  const header = req.headers.get("authorization") || "";
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  if (!match) return null;
  return verifyToken(match[1]);
}
