# Habit Tracker — Feature & IA Brief (W5D4 · Expo)

**Purpose:** capture the *functional* substance for the habit-tracker demo so it isn't
re-derived from zero — the features below were validated in the first proposal pass.

**How to use this:** this brief is **functional only — features, data, screens, states,
mechanics.** It contains *zero* visual/aesthetic prescription on purpose. Palette,
typography, layout, motion, device-frame styling, and the named directions are wholly
open — design them from scratch via live `--chrome` inspection. Where this brief names a
representation (e.g. "a progress ring"), read it as *one example* of the functional
intent ("show daily completion at a glance"); the designer may choose any form. **Do not
let this brief constrain the aesthetic.**

---

## 1 · Locked teaching spine (from week5-architecture.md — non-negotiable)

Each version teaches exactly one Expo/RN concept. Features must hang off these beats;
novelty rides *on top of* a beat, it does not add a new subsystem that balloons scope.

| Ver | Teaching concept | Feature that carries it |
|-----|------------------|-------------------------|
| v0 | Scaffold + RN components (`View`/`Text`/`Pressable`/`StyleSheet`) | Single screen, static habit list |
| v1 | Tab navigation (Expo Router) | 3 tabs: **Today / Streaks / Settings** |
| v2 | `FlatList` + `TextInput` form | Today screen: habit list + add-a-habit form |
| v3 | Swipe gesture (`react-native-gesture-handler`) | **Swipe-to-complete** a habit |
| v4 | AsyncStorage persistence | Habits + completions survive app restart |
| v5 | Push notification (EAS for the real build) | Daily reminder (permission + schedule) |

---

## 2 · Entity model (shared `lib/` data layer per GUIDELINES §2.2)

- **Habit** — `id`, `name`, `cadence` (daily / specific weekdays), `timeOfDay`
  (morning/afternoon/evening/anytime), `createdAt`, optional `note`/`why`.
- **Completion** — `habitId`, `date`, optional `reflection` (short text), `skipped: bool`.
- Derived: **streak** (current consecutive), **best streak**, **last-7-days** history,
  **today's completion %**.
- `lib/habits.ts` (typed sample data + getAll/getById) and `lib/habit-store.tsx`
  (Context in-memory store introduced at the CRUD/persistence beat). Session-only until
  v4 adds AsyncStorage — refresh = reset before then, on purpose.

---

## 3 · Core screens / IA

- **Today** (home) — what's due today, with each habit's current state and a one-tap /
  one-swipe complete. Should answer "what do I do right now" without scrolling a wall.
- **Habit detail** — one habit's history, current + best streak, last-7/30-day view,
  edit/delete, the habit's `why`.
- **Streaks** — momentum overview across all habits (the "don't break the chain" view).
- **Settings** — reminder time, theme/options, the honest-fine-print section.
- **Add / edit habit** — name, cadence, time-of-day, optional `why`.

---

## 4 · Status vocabulary (functional meaning fixed; visual form OPEN)

Four reserved semantic states — this four-word vocabulary was the strongest part of v1
and should persist. How each is *rendered* is entirely the designer's call.

- **Done** — completed today.
- **Today** — due today, not yet done (the "now" state).
- **Streak** — momentum / consecutive count (a positive, motivating signal).
- **Skipped / Rest** — intentionally not done today, treated as a *neutral, non-punishing*
  state (see §6 — this is a deliberate differentiator, not a failure state).

---

## 5 · Must-have features (table stakes)

- Create / complete / edit / delete habits.
- Daily completion + per-habit history (last 7 / 30 days).
- Current streak + best streak.
- At-a-glance "today's progress" (e.g. 5 of 7 done — form open).
- Daily reminder notification (v5).

---

## 6 · Signature / novel features — make it feel new to a jaded tracker user

The ask: go beyond the generic checkbox+streak app. These add genuine novelty while
staying inside the teaching beats. Tagged **[core]** (build into the arc) /
**[signature]** (the memorable moment) / **[stretch]** (optional polish).

- **Kind rest days, as a first-class state.** [core] Most trackers punish a miss and reset
  your streak to zero — it feels bad and people quit. Treat an intentional **rest/skip**
  as neutral: it pauses, doesn't shatter, the streak. This is genuinely differentiating
  and humane, and it's pure state logic (rides the v4 persistence beat).
- **A signature completion moment.** [signature] The swipe-to-complete (v3) should *feel*
  like something — a satisfying spring + haptic + a small celebratory flourish, not a
  checkbox going gray. This is the hero motion moment; let it be bold.
- **Momentum you can SEE, not just a number.** [signature] Represent streaks as something
  alive — a chain, a heat/contribution map, a charge that builds and visibly "cools" when
  neglected. (Form fully open — flame, plant, chain, grid, whatever the direction argues.)
- **A 5-second reflection on completion.** [stretch] An optional one-line note when you
  finish a habit ("felt great" / "barely made it"). Tiny journaling moment that gives the
  app emotional texture and pairs naturally with the reminder loop (v5).
- **Time-of-day framing.** [stretch] Group "today" by morning / evening so it reads like a
  day's rhythm rather than a flat checklist.
- **Streak-freeze / grace token.** [stretch] One "skip without breaking" token per period
  (Duolingo-style). Novel and motivating — but adds logic, so stretch only.

Scope guard: novelty lives in the *experience and interaction* layer (how completion
feels, how momentum is visualized, how rest is handled), NOT in heavy new subsystems.
If a feature can't ride one of the six teaching beats, it's stretch or out.

---

## 7 · Honest fine print (GUIDELINES §2.3 — required)

A home/settings section that's candid about what's *not* there: persistence is
session-only until v4, there's no account/cloud sync, the UI patterns are the lesson.

---

## 8 · Explicitly OUT of this brief (decided in the proposal, design-free)

Palette, typography, color roles' actual hex, layout, surface treatment, device-frame
styling, motion specifics, and the three visual directions + codename. Generate these
from scratch. The prior proposal HTML is an **anti-reference** for aesthetics only — its
*features* (this brief) were good; its *look* was too safe.
