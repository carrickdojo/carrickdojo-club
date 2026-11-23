---
title: Changelog
description: What changed on the site, why, and how important it was.
order: 2
level: beginner
---

Each entry records what changed, why, and how important it was.

Impact levels: **Critical** (security or site down) · **High** (broken feature) · **Medium** (new feature or improvement) · **Low** (cosmetic, tidy-up)

## 2026-11-23

- **Medium:** Fresh SvelteKit 3 scaffold (TypeScript, Tailwind 4, ESLint, Prettier, Vercel adapter), replacing the test build. _Why:_ start clean on current best practice.
- **Low:** Holding page with day/night theme that follows the OS setting. _Why:_ the site is live, so it needs an acceptable landing page while we build.
- **Medium:** Server-only CMS module (`src/lib/server/cms.ts`) with the URL set in `src/env.ts`. _Why:_ one place for WordPress calls, consistent errors, and nothing CMS-related sent to the browser.
- **Medium:** Added mdsvex 1.0 (via `npx sv add mdsvex`) so `.md` files can be pages or imported into Svelte files as components. _Why:_ lets the web team edit content in Markdown.
- **Medium:** Docs section at `/docs`: Markdown pages in `src/content/docs/`, prerendered, with front matter for title, order and level. Changelog and troubleshooting moved into it. _Why:_ learning docs for the web team, easy to edit.
- **Low:** Site header with nav, a skip link and the current page highlighted (`aria-current`). _Why:_ navigation and accessibility.
- **Low:** Fixed type and lint issues: `.ts` extensions on `#lib` imports, typed `PageProps`, and `resolve()` for internal links. _Why:_ no technical debt from the start.
- **Low:** Docs sidebar and breadcrumbs, generated from the folder structure and front matter. Typography plugin styles Markdown in both themes. _Why:_ easy navigation; adding a page only needs a `.md` file.
- **Low:** Site information page (`/docs/reference/site-information`): build time, branch, commit and installed versions, baked in at build time via Vite `define`. _Why:_ always-accurate record of what's running.