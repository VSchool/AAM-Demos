# astro-event-listing-v0

**Progressive state 0** of the After Hours event-listing demo. First in a 5-state series for AIM Week 5 Day 2 (Astro lane).

| State | URL | What it adds |
|-------|-----|--------------|
| **v0 (this)** | [astro-event-listing-v0](https://vschool.github.io/AAM-Demos/astro-event-listing-v0/) | Scaffold + homepage + events index skeleton + about page |
| v1 | astro-event-listing-v1 | Events content collection (≥5 entries) + dynamic detail pages |
| v2 | astro-event-listing-v2 | RSVP toggle React island on event detail |
| v3 | astro-event-listing-v3 | Genre filter React island on events index |
| v4 | astro-event-listing-v4 | SEO basics: per-page meta + OG images + sitemap |

## Scope of v0

What students see in this state:
- Astro scaffold with `src/pages/`, `src/layouts/`, `src/components/` structure
- File-based routing working: `/`, `/shows`, `/about`
- Shared `BaseLayout.astro` with sticky nav + footer
- "After Hours" UI kit applied: Anton display + Inter body + JetBrains Mono meta, dark palette with vivid orange accent
- The events index page renders the card grid scaffold with placeholder cards labeled "Awaiting collection"

What v0 does **not** have yet (lands in later states):
- No content collection (v1)
- No dynamic event detail route (v1)
- No React islands (v2 / v3)
- No SEO basics, OG images, or sitemap (v4)

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Builds to `dist/` via `npm run build`. The AAM-Demos `deploy.yml` workflow copies `dist/` into `_site/astro-event-listing-v0/` and publishes to `https://vschool.github.io/AAM-Demos/astro-event-listing-v0/`.

## UI kit

Design tokens live in `src/styles/global.css`. All 5 progressive states (v0–v4) share this exact kit — palette, typography, component shapes. The kit is recorded in `tools/registries/demo-registry.json` (in the curriculum repo) under each state's entry.
