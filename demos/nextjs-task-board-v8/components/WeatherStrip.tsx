"use client";

import { useEffect, useState } from "react";

// ============================================================
// Planning weather strip. Calls OUR server route (/api/weather) — which calls
// OpenWeatherMap with the secret key on the server. Open DevTools → Network:
// you'll see the request to /api/weather, but the OpenWeatherMap API key is
// nowhere in the browser (frozen behavior #5). When no key is configured the
// route returns { available: false } and we render a quiet fallback.
// ============================================================

interface Weather {
  available: boolean;
  city?: string;
  tempC?: number;
  description?: string;
  icon?: string;
}

const DEFAULT_CITY = "Provo";

export default function WeatherStrip({ city = DEFAULT_CITY }: { city?: string }) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      .then((r) => r.json())
      .then((data: Weather) => {
        if (!cancelled) setWeather(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [city]);

  // Loading.
  if (!weather && !failed) {
    return (
      <div className="cn-weather cn-weather-loading" aria-hidden="true">
        <span className="cn-weather-tag">Planning weather</span>
        <span className="cn-skel" style={{ width: 120, height: 14 }} />
      </div>
    );
  }

  // No key configured / upstream unavailable — quiet, honest fallback.
  if (failed || !weather?.available) {
    return (
      <div className="cn-weather cn-weather-muted">
        <span className="cn-weather-tag">Planning weather</span>
        <span className="cn-weather-fallback">
          Weather unavailable right now.
        </span>
      </div>
    );
  }

  return (
    <div className="cn-weather">
      <span className="cn-weather-tag">Planning weather</span>
      <div className="cn-weather-body">
        {weather.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="cn-weather-icon"
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt=""
            width={40}
            height={40}
          />
        ) : null}
        <span className="cn-weather-temp">
          {typeof weather.tempC === "number" ? `${weather.tempC}°C` : "—"}
        </span>
        <span className="cn-weather-city">{weather.city}</span>
        {weather.description ? (
          <span className="cn-weather-desc">· {weather.description}</span>
        ) : null}
      </div>
    </div>
  );
}
