# astro-event-listing-v2

**Progressive state 2** of the After Hours event-listing demo (5 states for AIM Week 5 Day 2, Astro lane).

## What v2 adds on top of v1

- **`@astrojs/react` integration** wired into `astro.config.mjs`
- **`src/components/RSVPButton.tsx`** — React component with local state (going / maybe / none), persisting to `localStorage`
- **Event detail page** mounts `<RSVPButton client:load ... />` as an island below the metadata sidebar
- Everything else stays static — only the RSVP button ships JavaScript to the browser

This is the "island architecture" lesson: static HTML for everything except the one interactive widget. View source on `/events/velvet-sky-tour/` and the page is mostly pre-rendered HTML; the React runtime loads only for the RSVP component.

## What still hasn't landed (later states)

- v3 — Genre filter React island on events index
- v4 — SEO basics: per-page meta + OG images + sitemap

## UI kit

Identical to v0–v4 — palette, typography, components in `src/styles/global.css` are the shared "After Hours" kit.

## Run

```bash
npm install
npm run dev
```

Live: https://vschool.github.io/AAM-Demos/astro-event-listing-v2/
