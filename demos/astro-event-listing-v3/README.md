# astro-event-listing-v3

**Progressive state 3** of the After Hours event-listing demo (5 states for AIM Week 5 Day 2, Astro lane).

## What v3 adds on top of v2

- **`src/components/GenreFilter.tsx`** — React client component on the events index page
  - Pill tabs for each genre with live counts
  - Filters cards in place as user clicks
  - Empty state when no events match
  - Mounted with `client:load` on `/shows`

## What still hasn't landed (last state)

- v4 — SEO basics: per-page `<title>` + meta description + OG images + sitemap + robots.txt

## UI kit

Identical to v0–v4 — palette, typography, components in `src/styles/global.css` are the shared "After Hours" kit. The GenreFilter component inlines its styling to keep the island self-contained.

## Run

```bash
npm install
npm run dev
```

Live: https://vschool.github.io/AAM-Demos/astro-event-listing-v3/
