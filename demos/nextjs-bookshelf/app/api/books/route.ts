import { NextResponse } from "next/server";
import { books } from "@/lib/books";

// Required for static export — pre-renders this route as a JSON file at build time
export const dynamic = "force-static";

// GET /api/books — returns all books as JSON
// In a static export, this generates a static JSON response at build time.
// In a full Next.js deployment, this would run as a serverless function.
export async function GET() {
  return NextResponse.json(books);
}
