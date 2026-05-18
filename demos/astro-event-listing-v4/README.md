# astro-event-listing-v4

**Progressive state 4 (final)** of the After Hours event-listing demo (5 states for AIM Week 5 Day 2, Astro lane).

## What v4 adds on top of v3

- **`@astrojs/sitemap`** integration — generates `sitemap-index.xml` + `sitemap-0.xml` at build time, covering every page including all 6 event detail routes
- **`public/robots.txt`** — explicit allow + sitemap pointer
- **BaseLayout extended** with per-page SEO metadata:
  - Unique `<title>` per page (already had this)
  - `<meta name="description">` per page
  - `<link rel="canonical">` per page
  - Open Graph tags: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:image`, `og:url`
  - Twitter card tags: `twitter:card="summary_large_image"`, `twitter:title`, `twitter:description`, `twitter:image`
- **Event detail pages** pass the event poster image as the OG image, set `og:type="article"`, and craft a title that includes the venue name
- **Sitemap discovery** via `<link rel="sitemap">` in `<head>`

This is the SEO-complete state. View source on any page to see the full meta block; visit `/sitemap-index.xml` to see the generated sitemap.

## UI kit

Identical to v0–v4 — palette, typography, components in `src/styles/global.css` are the shared "After Hours" kit.

## Run

```bash
npm install
npm run dev
```

Live: https://vschool.github.io/AAM-Demos/astro-event-listing-v4/
