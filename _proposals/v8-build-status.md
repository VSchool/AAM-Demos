# V8 Demo — Build Status

**Date:** 2026-06-05
**Branch:** `feat/nextjs-task-board-v8` (committed `3fe6bf9`, **not pushed** — see "Remaining")
**Picks up from:** `_proposals/v8-handoff-brief.md`

## Done — the full V8 code build, verified locally

`demos/nextjs-task-board-v8` is V7 + a real backend, built to the Frozen Demo
Contract. Same Cadence app and UI kit; the backend is the only difference.

- **Copied v7 → v8**, removed `output:'export'` + `basePath` from `next.config.ts`
  (serves at Vercel root). No stale `/AAM-Demos/nextjs-task-board-v7` refs remain
  (the only v7 references left are intentional: `/compare` links to the live V7
  demo as the "before"; the footer points to the v8 source).
- **Database:** Mongoose + MongoDB. `User` + `Task` models; tasks user-scoped via
  `userId`. Connection cached across serverless invocations (`lib/db.ts`).
- **Auth (no black-box lib):** signup + login routes, bcrypt hashing, JWT on
  login, Bearer-token verify helper (`lib/auth.ts`), protected `/api/auth/me` +
  a profile screen. Safe errors (wrong-password and unknown-email return the
  identical 401 — no user enumeration).
- **Full CRUD REST** over `/api/tasks` (incl. `GET` list = frozen #4). Client
  store rewired from localStorage → `fetch()` (`lib/task-store.tsx`).
  Server-side validation on every write (`lib/validation.ts`).
- **Third-party API, hidden key:** server-proxied OpenWeatherMap weather strip
  (`/api/weather` + `components/WeatherStrip.tsx`). Key lives in server env only,
  never in the browser. Degrades to a quiet "unavailable" state with no key.
- **`/compare`:** the one intentional teaching layer — a V7→V8 walkthrough with
  live "Run" beats (`GET /api/tasks`, `GET /api/weather`) so the backend is
  demonstrated, not just described.
- **Seed:** `npm run seed` creates the seed user + 12 tasks for the cross-device
  beat. Creds in `.env.local` (`SEED_USER_EMAIL` / `SEED_USER_PASSWORD`).
- **Secrets:** `.env.local` gitignored; `.env.local.example` committed. `JWT_SECRET`
  minted locally with `openssl rand -base64 32`.

### Verification (local MongoDB + headless Chromium)

- `next build` green (17→ routes; 6 API routes dynamic, `/tasks/[id]` dynamic).
- **19/19 API checks** (`tmp/verify.sh`): seed login, list-as-API-response,
  protected-route 401s, signup+JWT+profile, user-scoping, full CRUD persistence,
  cross-scope 404 isolation, validation 400s, safe error parity, weather key
  absent from payload, bcrypt-at-rest (`$2a$...`).
- **12/12 browser checks** (`tmp/browser_verify.py`): login flow, board renders,
  `GET /api/tasks` fires, weather via our route + no OWM key in any network URL,
  create/edit via UI, both `/compare` Run beats, profile, second-device redirect
  to /login, and **cross-device** (fresh browser context → same tasks). Zero
  console errors. Screenshots confirm design continuity with V7.

## Remaining — blocked on infra/access (not code)

These need Emily / account access and were explicitly out of the local build:

1. **MongoDB Atlas** — console login comes from Emily out-of-band. Then: project,
   M0 cluster, DB user, `0.0.0.0/0` network access, SRV string → `MONGODB_URI`.
2. **OpenWeatherMap key** — free-tier signup → `OPENWEATHER_API_KEY`. Until set,
   the weather strip shows its safe "unavailable" fallback (architecture is
   already correct + verified; only the live data is missing).
3. **Vercel project** — connect to `VSchool/AAM-Demos`, Root Directory →
   `demos/nextjs-task-board-v8`, Ignored Build Step, env vars (the three secrets
   + seed creds). Then push the branch → preview deploy → verify the six
   behaviors against the live serverless backend → merge to `main`.
4. **Seed against Atlas** — run `npm run seed` with `MONGODB_URI` pointed at
   Atlas so the cross-device login is reproducible in production.

## Local dev quickstart

```bash
cd demos/nextjs-task-board-v8
# local mongod on 27017 (or point MONGODB_URI at Atlas)
npm install
npm run seed          # creates demo@cadence.app / cadence-demo-2026
npm run dev           # http://localhost:3000
```

## Downstream (Emily / curriculum — unchanged from handoff §9)

Register v7/v8 as states 7/8 in `demo-registry.json`, capture thumbnails
(`tools/screenshot-demos.py`, V8 by explicit slug since it's off `/AAM-Demos/`),
swap `data-demo-pending` placeholders in `content/html/week6/`.

## Notes

- Next.js pinned at **16.2.4** to match V7 exactly (frozen visual/behavioral
  parity). `npm audit` flags a high advisory on 16.2.4 — it's inherited from the
  V7 baseline, not introduced by V8; patch fix is 16.2.7 (same 16.2.x line) if a
  bump is wanted.
- Doc-vs-code naming gap confirmed: the task-detail component is `TaskDetailCard`
  (both arch docs say `TaskDetailActions`). Carried forward as-is.
