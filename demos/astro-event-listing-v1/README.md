# astro-event-listing-v1

**Progressive state 1** of the After Hours event-listing demo (5 states for AIM Week 5 Day 2, Astro lane).

## What v1 adds on top of v0

- **`src/content/config.ts`** — Astro content collection schema for events (Zod-validated)
- **`src/content/events/*.md`** — 6 event entries (markdown frontmatter + body)
- **`src/pages/events/[slug].astro`** — dynamic detail page generated per event via `getStaticPaths()`
- **`src/pages/shows.astro`** — now reads from `getCollection('events')` instead of hardcoded placeholders
- **`src/pages/index.astro`** — adds a "Three on the calendar" featured strip pulling the next 3 events

## What still hasn't landed (later states)

- v2 — RSVP toggle React island on event detail
- v3 — Genre filter React island on events index
- v4 — SEO basics: per-page meta + OG images + sitemap

## UI kit

Identical to v0–v4 — palette, typography, components in `src/styles/global.css` are the shared "After Hours" kit.

## Run

```bash
npm install
npm run dev
```

Live: https://vschool.github.io/AAM-Demos/astro-event-listing-v1/
