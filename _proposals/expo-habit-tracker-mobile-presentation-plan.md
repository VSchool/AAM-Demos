# Pulse — Mobile-First Presentation Plan

**Status:** v6 PILOT BUILT + VERIFIED (Chrome, dark theme, 2026-05-28) and approved by Emily as the direction. Presentation model + all decisions LOCKED (see §7 below). Next: propagate to v0–v5 → audit → deploy → then curriculum (Strand B). The v6 pilot working-tree changes are UNCOMMITTED unless committed since. **Execution sections to follow: §7 Locked decisions, §8 v6 reference inventory, §9 Propagation checklist, §10 Verification protocol, §11 Open questions, §12 Curriculum refactor.**
**Date:** 2026-05-28
**Author:** Emily + Claude
**Problem:** The Pulse demos are genuine React Native, but on the deployed web build they *present* as a web app. Students could be confused about what they're building. Goal: make every version unmistakably present as a **mobile app**, and give students a true-to-mobile dev experience.

---

## Guiding principle — CROSS-PLATFORM, NO MAC/iOS LOCK-IN (hard)

Students are on **Windows, Mac, and Linux**, and carry **both iPhones and Android phones**. Nothing we teach or require may assume a Mac, an iPhone, or Apple-only/paid tooling. This is non-negotiable and overrides any "iOS / Xcode" language from the original framing:
- **Develop on any OS** → Expo's core value prop (this is already our stack).
- **Run on any phone** → Expo Go (iOS **and** Android), scanned from any dev OS. No simulator/emulator required (iOS Simulator is Mac-only; Android Emulator is heavy — both optional, never the floor).
- **Launch/share on any phone** → EAS Build emits iOS + Android. The **free** path leans on Android (shareable APK, no paid account). Stores are optional: Google Play ($25 one-time) and Apple App Store ($99/yr) are both *open doors, never requirements*.
- **Copy says "your phone," never "your iPhone."** The bezel is a generic phone, not an Apple device claim.

## 0. Findings (grounded in the current code)

### Did we build with React Native? — Yes, unambiguously.
- Expo SDK 56, RN 0.85, React 19, **Expo Router** file-based routing (`app/(tabs)/`, `app/habit/[id].tsx`).
- Real native primitives: `View` / `Text` / `Pressable` / `FlatList` / `TextInput` / `Switch`.
- `react-native-gesture-handler`, `react-native-reanimated`, `@react-native-async-storage/async-storage`, `expo-notifications`, `expo-haptics`.
- The **same JS bundle runs on a real iPhone** via the Expo Go QR on each home page.

### Why it *feels* like a web app (two presentation choices, not a wrong framework)
1. **Deploy target:** `expo export -p web` → GitHub Pages. RN-web renders to DOM in a browser tab, full-bleed.
2. **The teaching chrome is literally a web page.** `app/index.tsx` is a long-scrolling marketing/docs page (`Nav`, hero, QR, `FeaturesStrip`, `Progression`, "Inside vN" bento, "Motion tour", `Footer`). The *real* interactive app (`today` / `streaks` / `settings` / `habit/[id]`) renders via `TabScreen` as a **560px centered column with thin side borders** — never inside a phone bezel.

### The key asset already exists
`components/instrument.tsx:364` `DeviceFrame` — a real iPhone mockup (rounded bezel, dynamic island, drop shadow). Today it only wraps the **static** Today preview on the home page and a contained motion demo. The fix is largely *reframing*: run the **live** app inside that frame, and demote the web chrome to clearly-external callouts.

### Tensions to hold (not blockers, but must be honored)
- **Reverses a logged decision.** Heavy web chrome was deliberate (`_docs/DEMO_BUILD_GUIDELINES.md` + memory). This initiative overrides that *for the mobile lane* → the guideline should be updated, and the change spans v0–v6 (7 copied dirs).
- **W5D4 curriculum already shipped** linking these demos as "richly self-narrating." Links won't break; lesson framing may need a light pass.
- **Article (`xcrun mcpbridge`) targets native Swift/SwiftUI, not Expo.** Use as inspiration for the dev-loop strand; the Expo equivalent is iOS Simulator / Expo Go / dev client, not the Xcode MCP bridge.

---

## 1. Strands

### Strand A — Demo Presentation (this repo, AAM-Demos)
Make every version present as a phone app: persistent bezel + an in-app "what's new" tour. **Piloted on v6**, then propagated to v0–v5.

### Strand B — Student Dev-Loop + Launch (AAM-Course curriculum)
Give students a true-to-mobile build experience and a path to a **real, shareable, launched app they own**:
- **Build → see it on device/simulator while building.** Expo toolchain: `expo start` + Expo Go on a real phone; `expo run:ios` + iOS Simulator; dev clients. Not just a web preview.
- **Launch = shareable build (LOCKED).** EAS Build / dev build / Expo Go shareable link so a student ends W5 with a real, installable app they can use and hand to others. **A $99/yr Apple Developer account is NEVER required.** Full App Store / TestFlight submission is the documented *extra mile* (door open, never the expectation). App must be free + student-owned.
- **Expo-flavored `CLAUDE.md` starter for students** — so when *they* build with Claude Code, the agent defaults to `expo run:ios` / device preview. Kept on our-stack merit (the shared article's native-Swift `xcrun mcpbridge` tooling is out of lane; only the *workflow philosophy* transfers).

Sequenced after the pilot proves out Strand A so we're not editing curriculum against a moving demo target.

### Feature — mock login / auth (LOCKED direction)
Pulse gets a **mocked login + auth section** that **models the expectation** (real apps have a login) while staying **on-device, free, student-owned**:
- Mock = local profile, **no server** → preserves Pulse's honesty narrative (refine copy "no account" → *"your profile lives on this device — no cloud, no server"*; no rework of the on-device story).
- Taught as a **UI + forms + navigation** worked example — rides existing D4S2 (forms/`TextInput`) + D4S3 (auth pattern: tokens, SecureStore). Not new scope; connective tissue.
- **"Turn it real" is a door, not a gate** — students build the screen + mock; wiring real auth (Firebase/Supabase/Auth0/etc.) is *their* optional choice, never required.
- **Honors the W6 silence rule** — mock = no backend; "make it real" framing stays generic, never "next week you'll wire a backend."
- Matches how credible curricula teach it (Meta RN Specialization on Coursera, freeCodeCamp, Codecademy): login screen first as mock UI, real identity is an advanced/optional capstone topic.

---

## 2. Strand A — the v6 pilot (the decision artifact)

Build a single, reviewable v6 that demonstrates the new presentation, contained to `demos/expo-habit-tracker-v6/` and reversible. Emily reviews it live, then we lock the model.

### 2a. Persistent device bezel
- Lift `DeviceFrame` to the **layout level** so the live `<Stack>` renders *inside* the bezel's screen area on web. The app (tabs + habit detail) navigates within the frame; the bezel persists across routes.
- On a real phone (Expo Go / native), the bezel is a no-op — the OS *is* the frame. Web-only chrome, same pattern as existing `Platform.OS === "web"` guards.
- `/` (home) stops being a scrolling web page. Opening the deploy URL shows **the phone running the app** (boots into Today, optionally with the tour overlay).

### 2b. Teaching chrome → external callouts
- Demote `Nav` / `Footer` / `FeaturesStrip` / `Progression` / "Inside vN" bento / "Motion tour" from "the page the app lives in" to **annotations arranged around the bezel** — visually obvious they are notes *about* the phone, not a web page the app sits in.
- Decide on the pilot how much survives as external callouts vs. folds into the in-phone tour (see 2c). Candidate: a slim caption rail beside/below the bezel; "Inside vN" + Motion-tour likely move into the tour.

### 2c. In-phone "what's new" tour (prototype, then decide)
- A coachmark / walkthrough overlay **inside the device** on first open: "What's new in vN" — highlights the version's new feature(s) with the teaching point, like a real app's first-run tour.
- Prototype it on v6 (tour points: dynamic-route detail screen, tap-to-drill UX shift). Then decide: **tour replaces the external bento** (Emily's lean) vs. tour + bento. Keep it lean — reuse existing copy from the "Inside vN" tiles rather than authoring new.
- Per-version: the tour shows the **newly-added** feature for that version (compounding the story v0→vN), mirroring the existing one-callout-per-version `FeatureCallout` rule.

### 2d. "View on your phone" path
- Keep + strengthen the Expo Go QR so students can run the demo on their own device. Confirm it's prominent in the new bezel-centric layout (it's the bridge to "this is really mobile").

### 2e. Guardrails (carry from the v6 build plan)
- Edit **only** `demos/expo-habit-tracker-v6/`. v0–v5 stay frozen until propagation is approved.
- `./node_modules/.bin/tsc --noEmit` (never `npx expo tsc` — migrates tsconfig).
- **Verification (checked 2026-05-28): full Xcode is NOT installed on this machine — only Command Line Tools, so `xcrun simctl` / iOS Simulator is unavailable.** Adjusted plan: my automated verify stays **Chrome (RN-web)** for rendering/logic + both-theme pass; **Expo Go on a physical phone (iPhone OR Android)** (the QR path) is the "feel it on a phone" pass (Emily's manual step). Installing full Xcode for a simulator is optional (Emily's call), never required — and never assumed for students.
- **Strand B consequence:** teach **Expo Go on the student's own phone (iOS or Android)** as the default "see it on your device" loop — no Xcode, no Mac, any OS. Per the cross-platform principle above, no Mac/iOS-only tooling is ever the taught floor. (Reinforces that the shared article's simulator/native-Swift tooling is out of lane.)
- No new npm deps unless a tour/coachmark genuinely needs one (prefer building on Reanimated, already present).

### 2f. Decision gate
Emily reviews the live v6 pilot and locks: (1) presentation model / how much external chrome, (2) tour placement (replaces bento or not), (3) go/no-go to propagate to v0–v5.

---

## 3. Strand A — propagate (after the gate)
Apply the locked pattern to v0–v5 (each its own dir). Per-version the tour content differs (each shows *its* new feature). Update `_docs/DEMO_BUILD_GUIDELINES.md` to record the mobile-lane presentation pattern. Light pass on W5D4 lesson framing if the "self-narrating" language no longer fits.

---

## 4. Strand B — student dev-loop (AAM-Course, sequenced after pilot)
- Audit the W5D4 sessions (`content/html/week5/day4/`) for where the build workflow is taught (currently Snack-first per `s1-05-expo-snack-default-path.html` + `s1-06-optional-local-development.html`).
- Evaluate adding/elevating a **device + simulator** loop: `expo start` → Expo Go on a real phone; `expo run:ios` → iOS Simulator; dev clients. Frame "see your app on your actual device while building" as the true-to-mobile experience.
- Decide whether AI-assisted iOS dev (the article's spirit, adapted to Expo) belongs as an optional/advanced note. The native `xcrun mcpbridge` path is **out of lane** unless a separate native-Swift track is ever desired.
- Honor existing curriculum guardrails (W6 silence rule, Marcus's voice, architecture spec authority). Any AAM-Course edits scoped + committed separately from AAM-Demos.

---

## 5. Open questions for the gate (not blocking the pilot)
- How prominent should external callouts be in the final model? (Resolve by seeing the pilot.)
- Does the tour auto-open every visit, first-visit-only, or a tappable "?" — for a teaching demo, probably a replayable trigger.
- Strand B: simulator-first or device-first as the taught default? (Device is more "real," simulator has no hardware requirement.)

---

## 6. What this plan does NOT do
- Touch v0–v5 before the pilot gate.
- Add a native-Swift track or `xcrun mcpbridge` tooling (out of lane).
- Re-architect the demo's *features* — v6's feature set is frozen; this is presentation only.
- Edit AAM-Course before the v6 pilot is reviewed.

---

## 7. LOCKED DECISIONS (Emily, 2026-05-28) — do not redecide without Emily

1. **Adaptive presentation.** WIDE desktop browser → app in a phone **bezel** + **device-model selector** + **exactly 3 external annotation modals** (helper palette): (1) "this is the app" disclaimer, (2) scan-to-open QR, (3) the 7 states. NARROW / real phone / native → **fullscreen app, no bezel, no modals**; build-info reached in-app via About. App screens are IDENTICAL in both presentations.
2. **Mock login = first screen.** Any input signs in; does NOT persist (every load replays login→welcome→app→tour). On-device, no server. "Make it real" is an optional student choice, never required. Taught as UI+forms (rides D4S2 + D4S3 auth pattern); W6-silence-safe.
3. **Welcome** = one-time post-login screen → Today.
4. **Nav = 3 tabs (Today / Streaks / Settings). Today is home. NO Home tab.** About is NOT a tab — reached from Today's "More about this version" footer + Settings → About; it's the in-app home for overflow (disclaimer, 7-states, on-device honesty, source).
5. **Tour auto-runs on entry** (overlay, not "?"-gated); **theme-colored spotlight ring** highlights what's visibly new, card placed OPPOSITE the ring; explanatory text when nothing visible; collapses to a **"What's new"** pill (re-engageable). Content is per-version.
6. **Palette pill + panel DELETED.** Theme toggle lives ONLY in Settings (no floating FAB). Settings gained Log out + About rows.
7. **Launch = shareable build** (EAS/dev build). $99 Apple acct never required; Android APK is the free path; stores optional. Copy says "your phone," never "iPhone."
8. **Cross-platform, no Mac/iOS lock-in** (see Guiding Principle at top) governs everything.

## 8. v6 REFERENCE IMPLEMENTATION (the pattern to copy/adapt) — all in `demos/expo-habit-tracker-v6/`

NEW: `lib/session.tsx` (mock-auth gate: authed/welcomed/toured), `lib/tour.tsx` (TourProvider + per-version steps + spotlight-target registry, `V6_TOUR`), `components/Tour.tsx` (overlay: ring + card-opposite + `WhatsNewPill`), `components/TourTarget.tsx` (measureInWindow→registers rect), `components/LoginScreen.tsx`, `components/WelcomeScreen.tsx`, `components/DeviceShell.tsx` (adaptive bezel/rail/selector + auth gate + tour autorun + screen-rect measurement).
MODIFIED: `app/_layout.tsx` (Session+Tour providers; ThemeToggle removed), `app/index.tsx` (→ `<Redirect href="/today" />`), `app/(tabs)/_layout.tsx` (web Nav removed), `app/habit/[id].tsx` (Nav + 560 column removed), `components/TabScreen.tsx` (flex-fill), `components/TodayList.tsx` (TourTarget on first row + "More about this version" footer), `components/CalloutRail.tsx` (3 modals only), `components/SettingsInstrument.tsx` (Log out + About rows), `app/about.tsx` (in-app screen, not web `<Screen>`), `components/instrument.tsx` `DeviceFrame` (added optional `aspect` prop).
DELETED: `components/ThemeToggle.tsx`.

## 9. PROPAGATION CHECKLIST (v0–v5) — per version, suggested order v5 → v0

Each version is its own dir; the SHELL is shared presentation, the TOUR is version-specific. For each `expo-habit-tracker-vN`:
1. **Port the shell** (the §8 NEW files + the same MODIFIED edits), adapting to vN's existing screens/store. Earlier versions have fewer features — only wire what exists (e.g., v0 scaffold may lack tabs/store/detail; v1 has tabs but no add-form; etc.).
2. **Author vN's tour** — `VN_TOUR` steps for THAT version's newly-introduced concept, with a spotlight `TourTarget` on the visibly-new element (v1=tab bar, v2=add form + first row, v3=swipe affordance [likely explanatory], v4=persistence [explanatory], v5=reminder/Coach in Settings). v0 = "what's here in the scaffold" tour. Wire `TourProvider steps={VN_TOUR}` in `_layout`.
3. **Adaptive shell + 3 modals + device selector + login + welcome** — same as v6.
4. **Version markers** — keep each version's existing Nav/Footer/Progression/About `current={N}`, slug, baseUrl, package name, QR `DEPLOY_URL`, etc. (don't regress the version identity).
5. **Verify** per §10 (BOTH themes).
6. Do NOT touch v6 (the reference) except bug-parity fixes.

## 10. VERIFICATION PROTOCOL (per version, BOTH themes)
- `./node_modules/.bin/tsc --noEmit` from the version dir — NEVER `npx expo tsc`/`npx tsc` (migrates `tsconfig.json`). Back up tsconfig before `expo export`; restore if migrated.
- `expo export -p web` must succeed (route list sane).
- Chrome verify: symlink `dist` → `/tmp/pulse-preview/AAM-Demos/expo-habit-tracker-vN`; `python3 -m http.server 8099` from `/tmp/pulse-preview`; open `http://localhost:8099/AAM-Demos/expo-habit-tracker-vN/`. Confirm: login→welcome→app + auto-tour with spotlight ring → "What's new" pill; exactly 3 modals; device selector resizes the bezel; **narrow (<980px) → fullscreen, no bezel/modals**; theme toggle in Settings re-skins; (v6) tap→detail. No console errors.
- Chrome tool gotchas: needs `--chrome`; permission is **per-action** (single calls get approved; `browser_batch` re-triggers and is often denied — prefer single calls); `left_click_drag` mis-scales (verify gestures via tap); window can rescale between shots (use `find`→click-by-ref, or coords from the CURRENT screenshot). Don't commit `dist/`.

## 11. OPEN QUESTIONS for Emily (resolve at propagation start)
- **Does v0 (and v1) get the full login + welcome shell**, or is login introduced only from a later version? (Lean: all versions get it for consistency — confirm.)
- **Commit/deploy cadence:** commit each version as built, or all at once after audit? Deploy (push main) only after all 7 audited (per "build → audit → deploy → then curriculum").
- **v3/v4 tour steps** are explanatory (swipe/persistence aren't static elements) — confirm that's acceptable vs. trying to ring a transient affordance.

## 12. CURRICULUM REFACTOR — Strand B (AAM-Course, ONLY after all versions built + audited + deployed)
Target: `content/html/week5/day4/` (+ possibly `week5-architecture.md`). Scope:
- Lead the "see it on your device" loop with **Expo Go on the student's own phone (iOS or Android), any dev OS** — NOT simulator (Mac-only). 
- Add a **shareable-launch** path (EAS/dev build → real installable app; Android free; stores optional, never required).
- Add a **mock login** worked example (rides D4S2 forms + D4S3 auth pattern; W6-silence-safe — never "wire a backend next week").
- Optionally ship an Expo-flavored `CLAUDE.md` starter for students.
- Honor: W6 silence rule, Marcus voice, architecture-spec authority. Re-verify demo GH-Pages URLs after redeploy. Commit AAM-Course separately from AAM-Demos. The shared Medium article (`xcrun mcpbridge`) is native-Swift, OUT OF LANE — only the workflow philosophy transfers, via Expo.
