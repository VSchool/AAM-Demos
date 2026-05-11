---
title: "First Week with Astro"
description: "What surprised me about Astro after years of React-heavy development."
pubDate: 2026-05-05
tags: ["astro", "content-sites"]
---

I've spent the last five years in React-land. useState, useEffect, component trees, client-side routing — the whole stack. Picking up Astro felt like someone turned off the noise.

## The biggest shift: zero JS by default

In React, you start with JavaScript and subtract. In Astro, you start with HTML and add. That inversion changes everything.

My first Astro page was a blog post layout. I wrote it like a React component — `.astro` file, frontmatter for logic, template below. But when I checked the browser's network tab, there was no JavaScript bundle. Zero. The page was pure HTML and CSS.

That moment rewired something in my brain. I'd been shipping kilobytes of runtime to render static text.

## Content collections clicked fast

Astro's content collections are what I wanted MDX to be. You define a schema with Zod, drop Markdown files in a folder, and query them with `getCollection()`. Type safety from frontmatter to template.

```typescript
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()),
  }),
});
```

No GraphQL layer. No content API. Just files and types.

## File-based routing, but better

I'm used to file-based routing from Next.js. Astro's version is simpler because there's less to configure. `src/pages/about.astro` becomes `/about`. `src/pages/blog/[slug].astro` with `getStaticPaths` generates one page per blog post.

The mental model is direct: files become pages. No layout hierarchy to debug, no middleware chain to trace. If the file exists, the route exists.

## Where I'd still reach for React

Astro isn't trying to replace React for everything, and that's smart. For interactive components — a search bar, a theme toggle, a comment form — you can drop in React (or Vue, or Svelte) components with the `client:` directive.

I used `client:load` for a search component and `client:visible` for a newsletter signup that lives below the fold. The rest of the page stays static.

## One week verdict

Astro is what happens when a framework team asks "what if we shipped less?" instead of "what if we shipped more?" For content sites, it's the best tool I've used. I'll keep React for dashboards and apps, but my next blog, docs site, or landing page starts here.
