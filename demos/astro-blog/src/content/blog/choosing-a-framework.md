---
title: "How I Pick a Framework"
description: "A practical decision tree for choosing the right tool — not the trendiest one."
pubDate: 2026-05-01
tags: ["frameworks", "architecture"]
---

Every few months someone asks me the same question: "What framework should I use?" And every time, the honest answer is the same: **it depends**.

That answer frustrates people. They want a name — React, Astro, SvelteKit, whatever the current frontrunner is. But picking a framework based on popularity is how you end up rewriting your app 18 months later.

## The three questions I actually ask

Before I even look at documentation, I run through three filters:

1. **What kind of content am I serving?** Static content (blogs, docs, marketing) plays to different strengths than a highly interactive dashboard. If 80% of my pages are read-only, I don't need a runtime-heavy SPA framework.

2. **What does the team already know?** A framework you can ship with beats a framework you have to learn first. Velocity matters more than architectural purity in most real projects.

3. **What's the deployment target?** Edge functions, traditional servers, static hosts — each one narrows the field. If I'm deploying to a CDN with no server runtime, that eliminates anything that requires SSR at request time.

## A real example

Last year I rebuilt a documentation site. The old version was a Next.js app with `getServerSideProps` on every page. Pages that changed once a month were being server-rendered on every request.

The fix wasn't complicated: move to a static-first framework (I chose Astro), pre-render everything at build time, and add client-side interactivity only where users actually interact — search, theme toggle, copy-to-clipboard buttons.

Build time went from "deploy and wait" to "deploy and it's already there." Time to first byte dropped from ~400ms to under 50ms.

## What I look for in docs

Once I've narrowed the field to two or three options, I spend an hour with each framework's documentation. I'm looking for:

- **A clear getting-started path.** If it takes more than 10 minutes to get "hello world" running, that's a signal about the framework's complexity budget.
- **Error messages that teach.** Good frameworks tell you what went wrong *and* how to fix it. Astro is excellent at this.
- **Escape hatches.** Every framework makes tradeoffs. I want to know where the boundaries are and what happens when I hit them.

## The meta-lesson

Framework selection is a microcosm of every architectural decision: understand your constraints first, then pick the tool that fits. The best framework is the one that disappears — you stop thinking about the framework and start thinking about the product.

Start with your content. Start with your users. The framework follows.
