# AAM Demo Build Guidelines

Read this **before** building any new W5+ demo. It encodes everything that made the W5D3 `nextjs-task-board` demo work, so the next demo doesn't need round after round of "actually, also do X."

The reference implementation is `demos/nextjs-task-board-v0` through `v6` and `_proposals/nextjs-task-board-ui-kit.html`. When something is ambiguous, copy the pattern from there.

---

## 0 · The non-negotiables (read first)

A demo is "done" only if **all** of these are true:

1. There is a **UI-kit proposal HTML** that was reviewed before any version code was written.
2. There are **multiple progressive versions** (typically v0 → v6), one per concept the lesson introduces, each its **own deployable app** in its own directory.
3. Every version ships a **shared chrome suite** (Nav, Footer, Progression, FeaturesStrip-equivalent, PaletteToggle) and a **CSS / motion progression** that runs in parallel to the lesson progression.
4. The home page of each version explains **what changed this version** and **what's coming next**, via animated expandable affordances — never a wall of prose.
5. Every animation has a `prefers-reduced-motion` gate. Every accent color is **reserved** for one semantic role. Status colors never get used as decoration.
6. The demo has a **proper name** (e.g. "Cadence"), not "task board v6."

If you can't check all six, you're not done; ask Marcus before declaring victory.

---

## 1 · Phase 0 — UI-kit proposal (REQUIRED before any v0 code)

**Goal:** lock the visual language before committing to component code.

Deliverable: a single HTML file at `_proposals/<demo-name>-ui-kit.html` that shows **up to three distinct UI-kit directions** side by side. The reviewer (Marcus) picks one before any version is built.

### 1.1 Rules for the proposal

- **Each direction is a complete mini-product**, not a color swap. Different typography, different surface treatment, different structural moves (timeline vs. broadsheet vs. bento, etc.). If swapping colors would make direction A into direction B, you've built one direction with palette variants — start over.
- **Palettes and structural choices come from real sites, sampled live via `--chrome`**, not from your training data. If you're building a Next.js demo, study Linear, Plain, Attio, Raycast, Charm.sh, etc. If you're building an Expo / mobile demo, study Things 3, Linear Mobile, Cron, Sunsama, Reflect, Twitter native, Airbnb iOS, etc. Use Chrome / browser inspection to extract actual hex values and font weights — don't approximate.
- **List your sources at the bottom of the proposal**, hyperlinked. Sample line (copy this voice):
  > Sources sampled live: linear.app · plain.com · attio.com · raycast.com · charm.sh — palette + typography + structural-component data extracted via browser inspection, not summary.
- For each direction, render **the same artifacts in the same order** so the reviewer can compare apples-to-apples:
  1. Palette swatches with hex + role labels (canvas, surface, text, muted, accents).
  2. Typography specimen: display / h2 / h3 / body / small label / mono — with the actual font family and weight, plus pixel size and tracking.
  3. **Status indicators** rendered in each direction's style. This is the most diagnostic artifact — pill vs. icon-and-slate-text vs. bracketed-flag vs. chevron-banner reveals the direction's whole personality.
  4. Two or three component studies: the primary list row, a card/detail composition, and the page composition (sidebar shape, header height, etc.).
- **Each direction needs an opinionated concept paragraph** — what it argues for. "The primary surface is an activity timeline, not a kanban." "Violet IS the canvas, not a button color." If you can't write that sentence, the direction isn't sharp enough.
- Include an **intro "how to read this" note** explaining that the differences are not color but structure (status indicator A vs. B vs. C is the real comparison).

### 1.2 Workflow

1. Spawn an Explore agent with `--chrome` to load and inspect 4–6 candidate reference sites for the demo's domain.
2. Extract: full palette (8–10 swatches per site), font family + axis weights, status/badge treatment, primary surface composition.
3. Draft three directions where each anchors on a different site (or pair of sites).
4. Write the HTML. Use sticky top-nav with anchor jumps to each direction.
5. Show Marcus. Wait for selection. Don't start v0 until a direction is picked.

---

## 2 · Phase 1 — Versioning (the spine of the demo)

**Each version teaches exactly one new concept from that day's lesson.** Look at the lesson HTML files at `Applied AI Mastery Curriculum/content/html/weekN/dayN/*.html` to find the concept list. One session block ≈ one version.

### 2.1 Architecture

- **Every version is its own standalone app** in its own directory, e.g. `demos/<demo-name>-v0/`, `demos/<demo-name>-v1/`, … This is intentional. It is **not** a monorepo. It is **not** a single app with feature flags. Each version is self-contained so students can navigate to any prior version's deployed URL and see exactly that state — no bleed.
- Web demos: `output: "export"` + `basePath: "/AAM-Demos/<demo-name>-vX"` in `next.config.ts`. Deploy each version's `out/` to GitHub Pages independently. Commit messages: `ci: build + deploy <demo-name>-vX`.
- Mobile demos (Expo / RN): each version is a separate Expo project. Use `npx expo export -p web --base-url /AAM-Demos/<demo-name>-vX` for the web build that gets deployed to GH Pages. Native preview lives in Expo Go via QR code; the home page should embed the QR for the current version.
- Lock the package versions per version directory. `package-lock.json` is committed. Different versions can have different deps if a later lesson introduces a new library.

### 2.2 Shared data layer (the unsung hero)

Every version shares the same `lib/` data shape:
- `lib/<entity>.ts` — typed sample data + `getAll()`, `getById(id)`, status/label maps. v0 imports it; v2+ may read it on the server.
- `lib/<entity>-store.tsx` (introduced at the CRUD version) — Context-based in-memory store. Refresh = reset, on purpose.

For W5D3 this is `lib/tasks.ts` and `lib/task-store.tsx`. For W5D4 it could be `lib/journals.ts` and `lib/journals-store.tsx`. Pick a domain that fits mobile UX (journaling, habit-tracking, fitness, etc. — something with realistic touch interaction).

### 2.3 The "Honest fine print" section

Every demo home page must have a section that's brutally honest about what's *not* there: "Session-only persistence, on purpose. The UI patterns are the lesson; persistence isn't." This sets expectations and is itself a teaching moment. Don't skip it.

---

## 3 · Phase 2 — The shared chrome suite (build these once, ship in every version)

Each component listed here must exist in every version's `components/` folder. They are not a UI library — they're curriculum tools. Each one does double duty: chrome + teaching artifact.

### 3.1 `Nav.tsx`
Sticky top nav with brand, a `vN · <one-line state>` indicator ("v3 · client filter"), and primary route links. Brand glyph uses the reserved `--neon` (or direction-equivalent) accent.

### 3.2 `Footer.tsx`
Copyright, version string, GitHub source link. Boring on purpose.

### 3.3 `FeaturesStrip.tsx` (interactive tablist)
A row of 5–7 pill buttons on the home page, one per top-level feature of the final app (Board, CRUD, Filter, Sort, Detail, Resilient — adapt to the demo). Hovering / clicking a pill highlights it and reveals the feature's caption below. Each pill carries a `data-tone` attribute that drives reserved color coding. Uses real `role="tablist"`, `role="tab"`, `aria-selected`. **This is the user's at-a-glance preview of what the final app does.**

### 3.4 `Progression.tsx` (the version timeline)
A row showing v0 → vN with the current version marked `aria-current="step"`. Past versions link to their deployed URL (`https://vschool.github.io/AAM-Demos/<demo-name>-vX/`). Future versions are locked/grayed. Pure HTML + CSS, no JS state.

### 3.5 `PaletteToggle.tsx` (floating action button)
A fixed-position FAB that opens a modal panel showing the full palette grouped by role: Canvas, Paper/Surface, Status accents, Helper palette. Each swatch click-to-copy via `navigator.clipboard.writeText(hex)`, shows "copied" feedback ~1.1s. Closes on Escape or outside click. Focus management via refs. **Doubles as a teaching tool: students can crack open any version and see the whole design system in one click.**

### 3.6 `CssFeatureBento.tsx` + `CssFeatureTile.tsx` + `CssFeatureDemos.tsx` (the parallel CSS curriculum)
**This is the thing Marcus loved most about d3.** It runs a *parallel* curriculum: in addition to the lesson concept of each version (server components, dynamic routes, etc.), each version introduces exactly one new **CSS / motion** primitive. The bento on the home page shows all of them as expandable tiles; the current version's tile is `live`, future ones show `ships in vX`.

Each tile expands (with View Transitions when available) to reveal:
- A 1-paragraph description of the primitive.
- A **live mini-demo** rendered from the tile's `Demo` component.
- The **CSS snippet** in a code block — copy-pasteable.
- An **instruction string**: "Try this in your project — add `view-transition-name: card-{id}` to your detail card, wrap your nav handler in `document.startViewTransition(...)`, ship it." This is Marcus's "prompt that lets them add similar to their own project" requirement.

The `CSS_FEATURES` registry pattern (`CssFeatureDemos.tsx`) is the canonical implementation. Feature-as-data:
```ts
type CssFeature = {
  tier: number;
  slug: string;
  name: string;
  description: string;
  snippet: string;
  instruction: string;
  Demo: React.ComponentType;
};
```

For an Expo demo the analog is `MOTION_FEATURES` — Reanimated `withSpring`, shared-element transitions, `LayoutAnimation`, `interpolate` driven by `useSharedValue`, etc. One per version. Same registry shape.

### 3.7 `ExpandableBento.tsx` + `ExpandableTile.tsx`
A bento container that enforces single-open-at-a-time. The parent injects `isOpen`, `isCompact`, `onToggle`, `viewTransitionName` into its children via `Children.toArray` + `cloneElement`. State changes are wrapped in `startViewTransition` so tile expansion morphs instead of jumping. Closed tiles get `aria-hidden`, `inert`, and `grid-template-rows: 0fr → 1fr` animation. **This is the chassis the V6-style "deep dive on the new files" lives inside.**

### 3.8 `DemoNote.tsx` (the animated explain-where-edits-were-made affordance)
A pill button that starts collapsed showing just `title` (e.g. "Where the edits live"). Click → animates from its measured `closedWidth` to `100%` width, revealing the explanation. Uses `useLayoutEffect` to measure width before fonts settle (with a `document.fonts.ready` rebound for late font swaps). **This is the literal "animated buttons that expand to explain where edits were made" pattern.** Use it inline next to each new feature, pointing at the file(s) that changed and why.

Where to drop `DemoNote`s in each version:
- Next to the route or component that introduces the new concept ("`tasks/[id]/page.tsx` — generateStaticParams here").
- In the `CssFeatureTile` if the CSS primitive lives in a specific file.
- In the home-page "deep dive" section as a row of pinned annotations.

### 3.9 `VersionDemos.tsx` (the v0…vN mini-demo registry)
Exports `DemoV0`, `DemoV1`, … `DemoVN` — each a self-contained "fake screen" (dark inset surface, fake URL bar, fake nav, fake buttons) illustrating that version's concept without real navigation. State is local. Used by the About page and home-page progression deep-dives.

### 3.10 `VNDemos.tsx` (the current-version deep-dive)
For the latest version, a separate file (e.g. `V6Demos.tsx`) exports 4–6 dark-screen mini-demos specific to that version's new files: `loading.tsx` skeleton sim, `error.tsx` retry sim, "new files this version" list, build-output introspection, layout-boundary illustration. Co-located with the section in `app/page.tsx` that introduces them.

### 3.11 Helper palette (teaching annotation colors)
Define a **separate** palette for teaching annotations — NOT the brand palette. Defaults from d3:
- `--helper-bg: #EAF3FB`
- `--helper-accent: #0B6FB0`
- `--helper-accent-strong: #084E7E`
- `--helper-text: #0F2A44`

`DemoNote`, `VersionDemos`, and `VNDemos` use these so teaching content doesn't fight the product UI for attention.

---

## 4 · Phase 3 — The CSS / motion progression

One new primitive per version. Each lives in `app/globals.css` (web) or a `motion/` folder (Expo). The W5D3 progression is the gold standard — copy its shape:

| Ver | Primitive | What it teaches |
|-----|-----------|-----------------|
| v1 | Hover & focus transitions | `transition: background 200ms ease, transform 200ms ease, border-color 200ms ease` — the baseline interactive feel |
| v2 | Custom easing + reduced-motion gate | `cubic-bezier(0.32, 0.72, 0.24, 1)` and `@media (prefers-reduced-motion: no-preference)` — accessibility is built in from the second beat |
| v3 | Skeleton shimmer | `@keyframes cn-shimmer` animating `background-position` for placeholder sweep |
| v4 | View-transition-name (basic) | `view-transition-name: card-{id}` + `document.startViewTransition(...)` for morphing layouts |
| v5 | Entrance keyframe | `@keyframes cn-palette-pop` — opacity + translateY + scale for content arrival |
| v6 | Refined view-transition orchestration | `::view-transition-group(*)` and `::view-transition-old/new(*)` with custom duration / easing |

Every animation is **gated** behind `prefers-reduced-motion: no-preference`. Every named keyframe gets the `cn-` (or demo-specific) prefix.

For Expo W5D4 substitute Reanimated v3 primitives (sample sequence):

| Ver | Primitive | What it teaches |
|-----|-----------|-----------------|
| v1 | `Pressable` + `useSharedValue` opacity | Touch feedback baseline |
| v2 | `withSpring` + `useReducedMotion()` | Native easing + accessibility gate |
| v3 | `LayoutAnimation` skeleton fade-in | List-arrival animation |
| v4 | Shared element transition (`sharedTransitionTag`) | Detail-screen morphing |
| v5 | `withSequence` entrance choreography | Multi-step arrival |
| v6 | Gesture-driven `interpolate` (`useAnimatedStyle` + pan) | Direct manipulation feel |

---

## 5 · Phase 4 — The home page

Every version's `app/page.tsx` (or `app/(home)/index.tsx` in Expo Router) follows the d3 section order. Don't reinvent this:

1. **Hero** — eyebrow (mono, uppercase, tracked), display H1, lede sentence. Max ~24ch headline.
2. **CTA pair** — primary button (filled with reserved accent) → main app surface; secondary outline → `/about`.
3. **Section 01 · What you can do here** — `FeaturesStrip` (interactive tablist of the final app's features).
4. **Section 02 · Honest fine print** — the non-persistence explainer tile.
5. **Section 03 · Behind the scenes** — `Progression` timeline + a sentence linking out to `/about`.
6. **Section 04 · vN deep-dive** — `ExpandableBento` with one tile per new file / new concept this version introduced. Each tile uses `VNDemos` mini-demos and `DemoNote`s for inline annotation.
7. **Section 05 · CSS tour (parallel curriculum)** — `CssFeatureBento`.

Section headers use `.cn-section-tag` (mono, uppercase, 11px, tracked) for the eyebrow and `.cn-section-h` (display, 36–44px) for the H2. The `.cn-bento` 12-column grid is the workhorse for all bento sections; bento columns collapse to 4 at `@media (max-width: 800px)`.

---

## 6 · Phase 5 — The About page

`/about` (or its Expo equivalent) is an `ExpandableBento` with one `ExpandableTile` per version. Clicking a tile expands it to show that version's `DemoVX()` mini-demo from `VersionDemos.tsx`, plus a paragraph explaining what changed. Include a "why no backend" tile that explains the deliberate session-only stance.

Goal: a visitor can grok the whole 7-state arc on one page without leaving.

---

## 7 · Reserved color discipline

Status accents are **never** used as decoration. Once `--neon` means "done / editing," it never appears in a button background that isn't a done/editing state. Once `--pink` means "blocked," it doesn't go on a generic "delete" affordance unless delete-while-blocked is the semantic.

The d3 reservation, for reference:
- `--neon: #00FFB2` — done / editing state
- `--pink: #FF7BF5` — blocked / deleted-in-session
- `--yellow: #FFE066` — in progress
- `--sky: #7DD3FC` — info (helper notes)

Pick four reserved roles for the new demo and write them at the top of `globals.css` as comments. Audit yourself before merging: grep each token and check every use site is the assigned role.

---

## 8 · Naming, branding, copy

- Pick a real **codename** for the app (W5D3 = "Cadence"). It appears in the nav brand, the page titles, and the proposal. Never refer to the app as "task board" or "the demo" inside the app itself.
- Eyebrow copy is monospace, uppercase, tracked 0.12em–0.14em.
- H1 / H2 copy uses tight letter-spacing (-0.02em to -0.025em) and short ledes (≤24ch).
- Section-tag pattern: `01 · Palette` / `02 · Status` / `03 · Typography` — number + middot + label, mono.

---

## 9 · Deploy + CI

- Each version directory has its own `next.config.ts` (or Expo `app.config.ts`) with the version-specific `basePath`.
- A GitHub Actions workflow per version builds and deploys its `out/` (web) or `dist/` (Expo web) to `gh-pages` under `/AAM-Demos/<demo-name>-vX/`.
- Commit message convention: `feat(<demo>-vX): <what>` for code; `ci: build + deploy <demo>-vX` for deploy commits.
- For Expo demos: also build a native QR code (Expo Go) and embed it in the home page for that version, so reviewers can scan and try on a phone.

---

## 10 · Build order (chronological checklist)

1. Read the lesson HTML files for the target day. List the concepts. Map each concept to a version (v0 baseline, v1 = first concept, …).
2. Pick 4–6 real reference sites in the demo's domain. **Inspect them live with `--chrome`**, not from memory.
3. Draft three UI-kit directions in `_proposals/<demo-name>-ui-kit.html`. Get approval.
4. Build `v0` — scaffold, chrome suite, home-page sections in skeleton form, **no real feature yet** beyond file routing.
5. Build `v1` through `vN` one at a time. For each version:
   - Implement the lesson concept in `app/` / `screens/`.
   - Add the CSS / motion primitive for the tier.
   - Update `Progression` to mark this version current.
   - Add `DemoNote`s next to the new files.
   - Add an entry to `VersionDemos.tsx`.
   - For the latest version, also expand `VNDemos.tsx` for the home-page deep dive.
   - Deploy to GH Pages with the version's `basePath`.
6. Final pass on the **latest version's home page** — this is the front door, polish it.
7. Build / refresh `/about` so its bento covers every version.
8. Audit: every animation has the reduced-motion gate; every reserved color is used only for its assigned role; every link in `Progression` resolves.

---

## 11 · What Marcus's six bullets missed (so they're now covered above)

Cross-reference for the original brief:

1. ✅ Progressive versions — Phase 1 (§2), build order (§10).
2. ✅ Animated expand-to-explain buttons — `DemoNote` (§3.8). The pattern that literally measures `closedWidth` with `useLayoutEffect` and morphs to `100%`.
3. ✅ Incremental CSS features + snippet + instruction prompt — `CssFeatureBento` (§3.6), full CSS curriculum (§4).
4. ✅ Awesome app first, teaching second — section ordering rule (§5), helper palette separation (§3.11).
5. ✅ UI-kit proposal HTML with 3 directions, `--chrome` site inspection, named sources — Phase 0 (§1).

**What was missing from Marcus's bullets (now in this doc):**

- **6.** Each version is its own standalone deployed app, not a branch or feature flag (§2.1).
- **7.** Shared `lib/` data + Context store pattern; "session-only persistence" stance with an explicit "Honest fine print" home-page section (§2.2, §2.3).
- **8.** The full chrome suite is fixed: Nav, Footer, FeaturesStrip, Progression, PaletteToggle, CssFeatureBento, ExpandableBento, DemoNote, VersionDemos, VNDemos — these are not optional (§3).
- **9.** Reserved-color discipline: status accents have one role and only that role (§7).
- **10.** Helper palette is *separate* from brand palette so teaching annotations don't compete with product UI (§3.11).
- **11.** `prefers-reduced-motion` gate on every animation (§4).
- **12.** View Transitions API integration for bento / tile morphs — a graceful enhancement (§3.7, §4).
- **13.** Per-version `output: "export"` + `basePath` + GH Pages deploy, with version-specific commit conventions (§9).
- **14.** Codename the app (e.g. "Cadence") so it has a brand, not a tutorial label (§8).
- **15.** Build-output introspection demo (e.g. "4 static + 12 SSG + 1 not-found HTML files") — make the abstraction visible the moment the lesson introduces it (§3.10).
- **16.** `live` vs `ships in vX` chip on version-aware tiles so v3 viewers see v4/v5/v6 features as "coming up" (§3.6).
- **17.** About page = single-page bento of all versions with embedded mini-demos (§6).
- **18.** Snippet + instruction string on every CSS feature so students get the *prompt* to apply it themselves (§3.6).
- **19.** For W5D4 specifically: it's Expo / Mobile, so swap CSS for Reanimated, swap GH Pages-only deploy for GH Pages web + Expo Go QR, pick a domain that suits touch UX (§2.1, §4).

---

## 12 · Quick-reference for a fresh Claude session

Paste this at the top of a new session that's about to build the next demo:

> Read `DEMO_BUILD_GUIDELINES.md` in the repo root before you do anything. Then read the lesson HTML files for the target day under `Applied AI Mastery Curriculum/content/html/weekN/dayN/` to map concepts → versions. Then start with Phase 0 — the `_proposals/<demo-name>-ui-kit.html` file. Use `--chrome` to actually open and inspect the reference sites; do not approximate palettes from memory. Wait for approval on the proposal before scaffolding v0. The reference implementation to mirror is `demos/nextjs-task-board-v0` through `v6`.

That's it. Match the shape, ship the same caliber.
