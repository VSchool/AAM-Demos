# V8 Demo — Build Handoff Brief

**From:** Emily Parker
**Status at handoff:** V7 is **done and live**; V8 is **not started**. You are picking up at the exact seam between the two.
**Date:** 2026-06-04

This is the Cadence (`nextjs-task-board`) series in the **AAM-Demos** repo. V7 is the frontend-only "before"; **V8 is the full-stack "after"** you're building — the first full-stack demo in a repo that was, until now, 100% static → GitHub Pages.

---

## 0. Read these first (authoritative, in order)

The two documents below are the source of truth. The frozen contract in them is **locked** — building V8 means building *to* it, not reinterpreting it.

1. **`AAM-Course/architecture/courses/2-software-architecture/detailed/week6-rebuild-brief.md`**
   → Read the **"FROZEN DEMO CONTRACT — Cadence V7 + V8"** section, the **six frozen behaviors** ("the contract's public API"), and the **"Build-kickoff directives"** section. These are the exact phrases the lesson HTML asserts; if a behavior changes, the demo contract is broken and every punch-list callsite has to change with it. Do not casually edit the Frozen Demo Contract.

2. **`AAM-Course/architecture/courses/2-software-architecture/detailed/week6-architecture.md`**
   → The parent spec. See its **Demo Placement / V7–V8 build spec**. This is the single source of truth for *what each block teaches*; the rebuild-brief is the *how-to-source-assets-and-reference-the-demos* layer on top of it.

> Both repos sit side by side: `~/development/vschool/AAM-Demos` and `~/development/vschool/AAM-Course`. AAM-Course reads demos out of this repo through a symlink at `~/Dev/v-school/curriculum/AI/AAM-Demos-Here`. Demos are always built **here** in AAM-Demos, never moved.

---

## 1. Where V7 left off (your starting point)

**V7 = `demos/nextjs-task-board-v7`. DONE, committed, and pushed → live on GitHub Pages.**

- Commit `b127bcc` — "feat(nextjs-task-board-v7): Cadence frontend-only 'before' demo + deploy wiring". Pushed to `origin/main` 2026-06-04; Pages deploy triggered on push.
- Built by copying v6 → v7, then **stripping all teaching scaffolding** (deleted 8 teaching components: VersionDemos, V6Demos, DemoNote, Progression, ExpandableBento, ExpandableTile, PaletteToggle, TriggerError).
- Home / about / tasks / tasks/[id] / layout + Nav/Footer rewritten to clean product copy. `/about` is a real product page (deliberate — a real app has one; sanctioned by the architecture).
- Persistence copy corrected to the accurate V7 tell: **"saved in this browser, survives refresh, does NOT follow you to another device."** That absence is the whole point of V8.
- `next build` static export is green (17 routes). Manual click-through passed all 6 frozen behaviors, including refresh-persists and incognito-resets.
- `deploy.yml` already has the v7 build + assemble step (with a comment noting V8 is Vercel, not in this workflow).
- **Landing card:** V7 is intentionally **un-carded** — the whole `nextjs-task-board` series has no `landing.html` card (it's curriculum-linked via `.demo-preview-card` instead). Don't add one.
- **Known leftover (intentional):** dead teaching CSS remains in `app/globals.css` — a deliberate "leave it" call during the strip, not an oversight. Carry it into v8 or prune it; either is fine.
- **Live V7 URL:** `https://vschool.github.io/AAM-Demos/nextjs-task-board-v7/`

### V7 app shape (what you'll be copying)

```
demos/nextjs-task-board-v7/
  app/        page.tsx · about/page.tsx · tasks/page.tsx · tasks/[id]/{page,loading,error}.tsx · layout.tsx · globals.css
  components/ Nav · Footer · TaskBoard · TaskCard · TaskFilter · NewTaskForm · TaskDetailCard · TagPicker · TaskListSkeleton · FeaturesStrip
  lib/        task-store.tsx (client store, localStorage) · tasks.ts
  next.config.ts   ← output:'export' + basePath:'/AAM-Demos/nextjs-task-board-v7'
```
Next 16.2.4, React 19.2.4. **Note:** the task-detail component is `TaskDetailCard` — both architecture docs call it `TaskDetailActions`; the real name is `TaskDetailCard`. (One of several doc-vs-code naming gaps; see §8.)

---

## 2. Running it locally (V7 now, V8 once it exists)

Each demo is a self-contained Next.js app. Node **20+** recommended (Next 16 needs ≥18.18).

```bash
cd demos/nextjs-task-board-v7      # or -v8 once you've created it
npm install
npm run dev                        # http://localhost:3000
npm run build                      # V7: static export to ./out  (V8: standard Next build)
```

For **V8 local dev** you can point `MONGODB_URI` at either a local `mongod` or the free Atlas M0 cluster — either works; deploy uses Atlas. The frontend is unchanged from V7, so the new surface area to run/verify is the API routes, auth, and the weather proxy.

---

## 3. What V8 is (the locked decisions)

V8 = **copy v7 → `demos/nextjs-task-board-v8`, add a real backend.** From the frozen contract + build-kickoff directives:

- **Read path = `GET /api/tasks`** (client `fetch()`, user-scoped). V8 is **full CRUD REST, not mutations-only.** The arch's "replace the three store methods with fetch()" refers to the v5 client-store migration (`createTask`/`updateTask`/`deleteTask`) — it is **not** a license to keep the list server-rendered. A server-component DB read would make the backend invisible in DevTools and break frozen behavior #4 + the D1S1 Network-trace pedagogy. The list read is the **fourth** CRUD route.
- **Auth (no black-box lib):** signup + login API routes, **bcrypt** hashing, **JWT** on login, an auth helper/middleware that verifies the token, a **profile screen**. JWT secret in server-side env.
- **Database: MongoDB Atlas + Mongoose.** `User` and `Task` models. Tasks **user-scoped** (`userId` on each); a user sees only their own.
- **Cross-device persistence** — the headline V7→V8 difference: log in on another browser/device, your tasks are still there (the DB, not localStorage).
- **Third-party API with a hidden key:** a **weather strip** for planning, **OpenWeatherMap free tier** (matches D4S2). The call runs in a **server API route**; the key lives in server-side env and is **absent from the browser network tab**.
- **`/compare` walkthrough:** a guided V7→V8 comparison page/overlay that walks each backend difference — log in on another device (DB vs. localStorage), the task list arriving as an API response, the hidden third-party key. This is V8's **one** intentional teaching layer — everything else stays clean product UI.
- **Deploy: Vercel** (frontend + API routes) + **MongoDB Atlas** (data) + secrets in Vercel env.

### The six frozen behaviors (the lessons name these by phrase — do not break)

1. V7 = same app, **no backend** → localStorage, **doesn't follow you to another device**.
2. V8 = **real login + profile**.
3. V8 = **cross-device persistence** ("log in on another device and your tasks are still here — that's the database, not localStorage").
4. V8 = **task list arrives as an API response** (visible in DevTools Network).
5. V8 = **one third-party feature (weather strip)** whose **API key never appears in the browser network tab**.
6. V8 ships a **V7→V8 `/compare` walkthrough**.

### Scope fence — both directions

V8 = auth (bcrypt + JWT) · `User` + `Task` · full CRUD incl. `GET` list · user-scoping · server-side validation · server-proxied weather route · `/compare`. **Nothing** from the D5 untaught-feature menu or the C3 hand-off — **no** roles/admin, refresh tokens, search/filter, pagination, real-time, or email. Adding those pre-empts the capstone and C3.

**No automated test suite is a demo deliverable.** v6/v7 ship no test script, and testing is *lesson content* (D2S3, D3S3), not something the demo must contain. Don't add a test harness unless you want one for your own confidence — it's out of scope for "done."

### Quality bar (C2-OVR-4 — part of "done")

- **No hardcoded secrets** (all via env; see §5/§6).
- **WCAG AA contrast** — 4.5:1 body text, 3:1 large text.
- **Validated inputs** server-side on every write.
- **Safe error messages** — no stack traces / DB internals / "user not found vs. wrong password" leakage to the client.

### Design continuity (from Emily's standing design feedback)

New surfaces V8 introduces — auth/login/signup screens, profile, the weather strip, `/compare` — must use the existing **Cadence UI kit + theme tokens** and stay visually consistent with V7 (so `/compare` is honest). Don't let new screens regress to a generic default-SaaS look; match the kit. If you need to inspect anything visually, do it in a real browser (`--chrome`), not from memory.

### Monorepo / Vercel wiring

V8 lives at `demos/nextjs-task-board-v8` as a sibling continuing the series — it is committed to **this** repo (`VSchool/AAM-Demos`), not a separate one.

**Access:** you already have push access to `VSchool/AAM-Demos` and to the team Vercel account — so no new access is needed. The piece to get right is the **wiring between them**: Vercel deploys V8 by **watching this GitHub repo**, so the Vercel project must be **connected to `VSchool/AAM-Demos`** with:
- **Root Directory** → `demos/nextjs-task-board-v8` (so Vercel builds only the v8 app, not the whole repo), and
- an **Ignored Build Step** so unrelated AAM-Demos pushes (other demos, the W5 expo work, etc.) don't trigger a v8 redeploy.

The GitHub Pages pipeline (`deploy.yml`) only builds the demos it explicitly lists, so it ignores v8 entirely — the two deploy paths (Pages for v0–v7, Vercel for v8) don't collide.

**Suggested git/deploy flow:** build V8 on a branch → Vercel auto-creates a **preview deploy** for the branch/PR → verify all six behaviors against the preview URL → merge to `main` for the production deploy. This gives a safe place to test the live serverless backend before it's the reference demo, and keeps approval (Emily) in the loop before it goes "live" for the curriculum.

---

## 4. V8 build gotchas (carry these into the build session)

1. **The basePath / static-export trap.** Copying v7 → v8 carries **both** `output: 'export'` **and** `basePath: '/AAM-Demos/nextjs-task-board-v7'` in `next.config.ts` (plus `images.unoptimized`). **Remove both** — V8 serves at the **Vercel root**, not under `/AAM-Demos/...`. Then **audit every internal link and asset reference** for the stale `/AAM-Demos/nextjs-task-board-v7` prefix. (Verified still present in v7's config at handoff.)
2. **Cache the Mongoose connection across serverless invocations** (module-level global cache). Don't reconnect per request or you'll exhaust the Atlas connection pool.
3. **Secrets handling — do NOT paste live secrets into the chat.** Put the real `MONGODB_URI` / `JWT_SECRET` / `OPENWEATHER_API_KEY` straight into `demos/nextjs-task-board-v8/.env.local` (gitignored) and just tell the session they're there. Pasting them into the conversation risks them being cached/logged. Add a committed **`.env.local.example`** with placeholder keys so the shape is documented in git. (Atlas console login comes from Emily out-of-band — see §6.)
4. **Launch the V8 session with `--chrome`.** V8 needs real-browser verification the static V7 didn't: the auth flow, the task list arriving as an API response in the Network tab, the hidden-key-absent-from-Network beat, and cross-device persistence (two browser profiles).
5. **Provision infra before opening the build session** — Atlas cluster + OWM key + JWT secret + Vercel access (see §5). The session is idle without them.

---

## 5. Infra provisioning checklist (do this BEFORE opening the build session)

The build session is idle without these. None of the values below ever go in the repo — they go into a local `.env.local` (gitignored) for local dev and into Vercel env vars at deploy time. V8 will ship a committed `.env.local.example` (placeholder keys only) so the shape is self-documenting.

**1. Vercel — just confirm access now (no project yet).**
- Log in to the team account and confirm two things: (a) you can create a new project, and (b) the **VSchool GitHub org is connectable** — i.e., the Vercel GitHub app is installed on that org (or you have rights to install it). That org connection is the one thing that could need an admin, so eyeball it now.
- **Don't create the project yet** — we create it at V8 deploy time, with the exact Root Directory + env-var values then. *Produces: nothing yet — just a confirmed green light.*

**2. MongoDB Atlas — the account already exists; you do everything else.**
- Emily has set up the Atlas **account** and nothing past that. She'll send you the **console login** out-of-band — so **you don't sign up**, you log in and do all the setup below inside that account.
- Log in → create a Project (if one doesn't exist yet).
- Build a **free M0 cluster** (region near Vercel's default, e.g. AWS `us-east-1`).
- **Database Access** → create a DB user (username + password — **save the password**; it goes into the connection string).
- **Network Access** → add `0.0.0.0/0` (allow from anywhere). Feels scary but is correct: Vercel's serverless functions have no static IPs on the free tier, so you can't allowlist specific ones. Access is still gated by the DB credentials.
- **Connect → Drivers** → copy the SRV connection string (`mongodb+srv://USER:PASSWORD@cluster0.xxxx.mongodb.net/?...`). *Produces: `MONGODB_URI`.*

**3. OpenWeatherMap key + JWT secret — two different things.**
- **OpenWeatherMap:** sign up free → API keys tab → copy the key. Use the **Current Weather Data** free tier. ⚠️ Gotcha: brand-new keys take **~10 min–2 hrs to activate** — if it 401s right after creation, that's why, not a bug. *Produces: `OPENWEATHER_API_KEY`.*
- **JWT secret — you mint this yourself**, not from any service. It's just a long random string: `openssl rand -base64 32`, copy the output. *Produces: `JWT_SECRET`.*

So the three runtime secrets the build needs are **`MONGODB_URI`**, **`OPENWEATHER_API_KEY`**, and **`JWT_SECRET`** → into `demos/nextjs-task-board-v8/.env.local` and Vercel env at deploy time.

---

## 6. Credentials & access

- **Vercel:** you already have team access — nothing to hand over.
- **MongoDB Atlas console login:** Emily set up the **account only** and will send you the login **out-of-band** (not in this repo, not in chat). Everything past the account — project, M0 cluster, DB user, network access, connection string — is yours to do (see §5 step 2).
- **Runtime service secrets** (connection string, JWT secret, OWM key) go into `demos/nextjs-task-board-v8/.env.local` (gitignored) and the Vercel project env — **never** into the repo or into chat (see gotcha #3). Commit a `.env.local.example` with placeholder keys so the shape is self-documenting.

### Heads-up: the seed account is a future artifact (not in this handoff)

The "log in on another device and your tasks are still here" beat (frozen behavior #3) needs a **known seed user**. That email/password **does not exist yet** — there's nothing missing from this handoff. You create it during the build (a seed script or a one-time manual signup against Atlas), and once it exists it belongs in `.env.local` / the Vercel env / the credentials file alongside the other secrets, so the seed login can be reproduced on demand. Flagging it only so nobody hunts for a seed credential that was never meant to be here yet.

---

## 7. Definition of done — V8 acceptance checklist

V8 is done when all of the below are **verified in a real browser** (`--chrome`). This is just the six frozen behaviors plus the quality/hygiene bar, made checkable.

**Frozen behaviors**
- [ ] Signup + login work; passwords stored as **bcrypt hashes** (not plaintext) in Atlas; **JWT** issued on login; protected routes reject missing/invalid tokens; **profile screen** renders the logged-in user. *(frozen #2)*
- [ ] Tasks persist to Atlas and are **user-scoped** — a second account sees none of the first's tasks.
- [ ] **Cross-device:** log in as the seed user in a second browser profile → the same tasks appear. *(frozen #3)*
- [ ] Task list loads via **`GET /api/tasks`**, visible as an API response in DevTools → Network. *(frozen #4)*
- [ ] **Full CRUD** over the API (create/read/update/delete) persists to Atlas; server-side validation rejects bad writes.
- [ ] **Weather strip** renders; its OWM call runs **server-side**; the API key **never appears** in the browser Network tab. *(frozen #5)*
- [ ] **`/compare`** walkthrough walks the three differences: DB vs. localStorage, list-as-API-response, hidden key. *(frozen #6)*
- [ ] V7 behavior is unchanged and V8 stays **visually + behaviorally consistent** with V7 (so `/compare` is honest).

**Quality + hygiene**
- [ ] Quality bar (C2-OVR-4): no hardcoded secrets · WCAG AA contrast (4.5:1 / 3:1) · validated inputs · safe error messages.
- [ ] `next.config` has **no** `output:'export'` and **no** `basePath`; no stale `/AAM-Demos/...` links or asset refs remain.
- [ ] Mongoose connection is **cached** across invocations.
- [ ] Secrets live **only** in `.env.local` + Vercel env; **`.env.local.example`** is committed with placeholder keys.
- [ ] Deployed to **Vercel** (Root Directory → `demos/nextjs-task-board-v8`, Ignored Build Step set); live URL verified.
- [ ] **Scope fence respected** — nothing from the D5 untaught-feature menu / C3 hand-off; no test harness expected.

**Not your DoD (downstream — Emily / curriculum owner):** registering states 7/8 in `demo-registry.json`, thumbnails, and the lesson-HTML placeholder swap (see §9).

---

## 8. Known reconciliation (a build-time task, not plan drift)

Both the architecture and the rebuild-brief describe the strip-list using **Pulse/expo vocabulary** that does **not** exist in the real `nextjs-task-board-v6` (e.g. `FeatureCallout`, `MotionFeatureBento`, `NoteText/NoteCode`, "mock login → welcome → tour shell"). That stripping already happened in V7 — but if you cross-reference the docs while building, map intent → **real** component names by reading the code. Notably: the task-detail component is **`TaskDetailCard`**, not `TaskDetailActions` as both docs say. This naming gap does **not** touch the six frozen behaviors.

---

## 9. Downstream (after V8 is live — not your blocker, just context)

Once both demos are live, the curriculum side (in AAM-Course) gets wired:
- register v7/v8 as states 7/8 in `tools/registries/demo-registry.json` (record land-book inspiration **and any new Unsplash imagery the weather feature introduces**, per the repo's no-image-reuse policy);
- capture thumbnails with `tools/screenshot-demos.py` (V7 from its GH-Pages URL; **V8 by passing the slug explicitly** since it's off the `/AAM-Demos/` path);
- swap the demo placeholders in the W6 lesson HTML (grep `data-demo-pending` in `content/html/week6/`).

The W6 lesson-HTML build (D1–D5) is a **separate workstream** and is not blocked by you — but the demos must be live and swapped in before any student-facing W6 deploy. **Reviewer/approver is Emily** (and her boss, the architecture author, reviews the W6 work); nothing goes student-facing without her sign-off.

---

## 10. Ready-to-paste kickoff prompt for the V8 session

> Resuming the W6 Cadence demo work — starting V8. First read the
> **Frozen Demo Contract + Build-kickoff directives** in
> `AAM-Course/architecture/courses/2-software-architecture/detailed/week6-rebuild-brief.md`
> (and the Demo Placement spec in `week6-architecture.md`), plus this repo's
> `_proposals/v8-handoff-brief.md`. V7 is done and live on GitHub Pages
> (commit `b127bcc`). Infra (Atlas / OWM / JWT) is provisioned and the values are in
> `demos/nextjs-task-board-v8/.env.local` — **don't echo them**. Build V8 by copying
> v7 and adding the backend per the locked decisions: read path = `GET /api/tasks`
> (full CRUD REST), bcrypt+JWT auth with profile, User+Task models user-scoped on Atlas
> via Mongoose, server-proxied OpenWeatherMap weather strip with a hidden key, and a
> `/compare` walkthrough. Remove `output:'export'` and the `basePath` from next.config
> and audit internal links. Cache the Mongoose connection across serverless invocations.
> Seed account + open signup + server-side weather cache. Hold to the §7 acceptance checklist.

Launch that session **with `--chrome`** and make sure infra is provisioned first. Everything substantive is in the frozen contract + this brief; the prompt just points there.
