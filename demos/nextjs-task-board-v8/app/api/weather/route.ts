import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ============================================================
// GET /api/weather?city=Provo — the "third-party API with a hidden key" beat
// (frozen behavior #5). The browser calls OUR route; OUR server calls
// OpenWeatherMap with the secret key. The key lives only in server-side env
// (OPENWEATHER_API_KEY) and never reaches the browser — open DevTools →
// Network and you'll see /api/weather, but never the OpenWeatherMap key.
//
// Degrades safely: with no key configured it returns { available: false }
// (200) so the UI shows a quiet "weather unavailable" state instead of erroring.
// ============================================================

interface CacheEntry {
  at: number;
  payload: WeatherPayload;
}
interface WeatherPayload {
  available: boolean;
  city?: string;
  tempC?: number;
  description?: string;
  icon?: string;
}

// Per-instance cache so we don't hammer the free tier (the "server-side
// weather cache" from the build brief). TTL = 10 minutes.
const TTL_MS = 10 * 60 * 1000;
const cache = new Map<string, CacheEntry>();

export async function GET(req: Request) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    // No key yet (e.g. local dev before one is provisioned). Don't error.
    return NextResponse.json({ available: false } satisfies WeatherPayload);
  }

  const { searchParams } = new URL(req.url);
  const city = (searchParams.get("city") || "Provo").trim().slice(0, 60);
  const cacheKey = city.toLowerCase();

  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.at < TTL_MS) {
    return NextResponse.json(cached.payload);
  }

  try {
    const url = new URL("https://api.openweathermap.org/data/2.5/weather");
    url.searchParams.set("q", city);
    url.searchParams.set("units", "metric");
    url.searchParams.set("appid", apiKey);

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      // Upstream failed (bad city, key not yet active, rate limit). Return a
      // safe unavailable state — no upstream body, no key, no internals.
      return NextResponse.json({ available: false } satisfies WeatherPayload);
    }

    const data = (await res.json()) as {
      name?: string;
      main?: { temp?: number };
      weather?: Array<{ description?: string; icon?: string }>;
    };

    const payload: WeatherPayload = {
      available: true,
      city: data.name ?? city,
      tempC:
        typeof data.main?.temp === "number"
          ? Math.round(data.main.temp)
          : undefined,
      description: data.weather?.[0]?.description,
      icon: data.weather?.[0]?.icon,
    };

    cache.set(cacheKey, { at: Date.now(), payload });
    return NextResponse.json(payload);
  } catch (err) {
    console.error("[GET /api/weather]", err);
    return NextResponse.json({ available: false } satisfies WeatherPayload);
  }
}
