# Pulse — Phase 1 (v0) Kickoff & Handoff

**Status:** Phase 0 CLOSED. UI direction, codename, themes, and one net-new feature are **locked** (Emily, approver). No version code written yet. This doc + the proposal HTML are everything the next session needs to start v0.

---

## 1 · What's locked (do NOT re-litigate the design)

- **App brand name: `Pulse`.** Use it in the nav brand, page titles, and copy.
- **Demo directory slug stays `expo-habit-tracker-vN`** (v0…v5), per the architecture spec — the *brand* is Pulse, the *slug/URL* is `expo-habit-tracker-vN`. Don't rename the dirs.
- **Design language = the machined-hardware "instrument"** (black + brushed aluminum, indicator LEDs, segment LCD readouts, a physical switch you throw). This is **Direction A** in the proposal.
- **Two themes of ONE app via an in-app toggle** (the toggle is also the guideline's PaletteToggle chrome):
  - **Dark = DEFAULT** — black canvas, glowing LCD readouts.
  - **Light = "day mode"** — the *same* screens re-skinned: brushed-silver canvas, light panels, LEDs glow on silver, and the LCD inverts to a **positive** readout (dark/colored digits on a pale LCD). It is NOT a different app/layout.
- **Reserved status colors — 4 roles, constant across themes; only hex changes:**
  | role | dark hex | light hex |
  |------|----------|-----------|
  | done | `#3DDC84` | `#17B56E` |
  | today (now) | `#FFB200` | `#E8920A` |
  | streak | `#FF5A1F` | `#EC4D12` |
  | skipped / rest | `#6B7886` | `#6F7C8C` |
  Reserved-color discipline (guideline §7): each hue = one role, never decoration.
- **Type:** Space Grotesk (display/UI) + Space Mono (labels + segment readouts). Same in both themes.
- **Net-new feature: Coach tone dial (Chill / Firm / Elite)** — reminder-personality selector rendered as a hardware mode toggle; ships at the **v5** push beat (affects notification copy/cadence).
- **Hero motion "The Throw"** (swipe-to-complete): `Gesture.Pan()` → `withSpring({damping:12,stiffness:220})` + `Haptics.impactAsync(Heavy)` + LED color-snap amber→green. Lands at **v3**. Identical in both themes; gated by `useReducedMotion()`.
- **Locked palette/screens reference:** `_proposals/expo-habit-tracker-ui-kit-v2.html` (open it; it's the source of truth — 6 screens per theme: Today, Add-habit, Detail, Stats/Streaks, Settings, signature moment).

---

## 2 · v0–v5 spine (locked by architecture spec + feature brief)

| Ver | Teaching beat | Feature | Reanimated primitive |
|-----|---------------|---------|----------------------|
| v0 | Scaffold + RN components | single screen, static habit list | `StyleSheet` only |
| v1 | Tab nav (Expo Router) | Today / Streaks / Settings tabs | `Pressable` + `useSharedValue` opacity |
| v2 | `FlatList` + `TextInput` | Today list + add-habit form | `withSpring` + `useReducedMotion()` |
| v3 | Swipe gesture | **swipe-to-complete = "The Throw"** | `Gesture.Pan()` → `withSpring` + Haptics |
| v4 | AsyncStorage | habits + completions survive restart; **kind rest day** logic | `LayoutAnimation` / shared-element |
| v5 | Push notification (EAS) | daily reminder + **Coach tone** | `withSequence` entrance |

Status vocabulary (functional, fixed): **done / today / streak / skipped-rest** (rest is neutral, never punishing — pauses the streak, doesn't reset it).

---

## 3 · THE NEXT STEP — build v0 (Phase 1)

Per `DEMO_BUILD_GUIDELINES.md` §10 step 4 + §2.1–§2.3 + §3. v0 is **scaffold + chrome + skeleton home page, NO real feature beyond routing.** Concretely:

1. `demos/expo-habit-tracker-v0/` — fresh Expo + Expo Router app. Lock package versions, commit `package-lock.json`.
2. **Theme tokens first:** a `theme/` with `dark` (default) + `light` token sets; the 4 reserved roles mapped per theme (table above); a `ThemeProvider` + the **theme toggle** (the PaletteToggle analog). Default dark.
3. **Shared chrome suite** (guideline §3, Expo analogs): `Nav` (brand "Pulse" + `v0 · scaffold` indicator), `Footer`, `FeaturesStrip` (Today/Streaks/Add/Swipe/Persist/Remind), `Progression` (v0→v5), `PaletteToggle`→theme toggle, `MotionFeatureBento` (Reanimated curriculum, one tile `live` per version), `ExpandableBento`/`ExpandableTile`, `DemoNote`, `VersionDemos`, `VNDemos`. These are curriculum tools, build them once.
4. **Shared data layer:** `lib/habits.ts` (typed sample habits + `getAll`/`getById` + status/label maps). `lib/habit-store.tsx` arrives at the CRUD/persistence beat (v2/v4), not v0.
5. **Home page sections** (skeleton, guideline §5 order): Hero → CTA → "What you can do here" (FeaturesStrip) → "Honest fine print" (session-only until v4) → "Behind the scenes" (Progression) → vN deep-dive → Motion tour (MotionFeatureBento).
6. Render the **instrument look** in both themes from the start (the proposal screens are the spec).

**Deploy model (locked):** `npx expo export -p web --base-url /AAM-Demos/expo-habit-tracker-v0` → GitHub Pages; embed an **Expo Go QR** on the home page; **EAS preview specifically for v5** (push can't run on web). Wire `deploy.yml` build+assemble step + a `landing.html` card (the 3 repo touchpoints — see `repo-topology` memory). Commit convention: `feat(expo-habit-tracker-v0): …` for code, `ci: build + deploy expo-habit-tracker-v0` for deploy.

Then build v1→v5 one at a time per the table, updating Progression/DemoNotes/VersionDemos each step, deploying each independently.

---

## 4 · Paste-this kickoff prompt for the fresh v0 session

> Build **v0** of the W5D4 Expo habit-tracker demo. **Phase 0 is locked — do not redesign.** Read first, in full: `_proposals/pulse-v0-kickoff.md` (the locked spec + next steps), `_proposals/expo-habit-tracker-ui-kit-v2.html` (the locked UI — Direction A "the instrument", dark default + light "day mode" theme), `_docs/DEMO_BUILD_GUIDELINES.md` (the caliber + chrome suite + build order), `_proposals/expo-habit-tracker-feature-brief.md` (features/IA/states), and the project memory under `…/memory/`. Reference implementation to mirror: `demos/nextjs-task-board-v0..v6`. App brand = **Pulse**; directory slug = `demos/expo-habit-tracker-v0`. Build the scaffold + theme tokens (dark default + light, 4 reserved roles per theme) + theme toggle + the full shared chrome suite + skeleton home-page sections — **no real feature beyond routing.** Deploy: `expo export -p web --base-url /AAM-Demos/expo-habit-tracker-v0` → GH Pages + Expo Go QR on the home page. Then stop and show me v0 before v1.

---

## 5 · Housekeeping for the next session
- Stale W5D4 sidecars to clear at lesson-rebuild time (NOT needed for the demo build): `tools/registries/sessions/W5D4S{1,2,3}.json` (in AAM-Course). Lesson rebuild is downstream of all 6 demos existing.
- The 17 W5D4 SVGs + 6 mini-demo fragments inventoried in `week5d4-rebuild-prep.md` are for the *lesson* rebuild, not the demo build.
- Default theme = **Dark** (confirmed). Light is the same instrument re-skinned.
