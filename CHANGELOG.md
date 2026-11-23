# Changelog

Each entry records what changed, why, and how important it was.

Impact levels: **Critical** (security or site down) · **High** (broken feature) · **Medium** (new feature or improvement) · **Low** (cosmetic, tidy-up)

## 2026-11-23

- **Medium:** Fresh SvelteKit 3 scaffold (TypeScript, Tailwind 4, ESLint, Prettier, Vercel adapter), replacing the test build. _Why:_ start clean on current best practice.
- **Low:** Holding page with day/night theme that follows the OS setting. _Why:_ the site is live, so it needs an acceptable landing page while we build.
- **Medium:** Server-only CMS module (`src/lib/server/cms.ts`) with the URL set in `src/env.ts`. _Why:_ one place for WordPress calls, consistent errors, and nothing CMS-related sent to the browser.
- **Medium:** Added mdsvex 1.0 (via `npx sv add mdsvex`) so `.md` files can be pages or imported into Svelte files as components. _Why:_ lets the web team edit content in Markdown.