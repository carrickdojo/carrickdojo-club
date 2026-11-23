---
title: Troubleshooting
description: Common errors and how to fix them.
order: 1
level: intermediate
---

## `Module '"$app/env/private"' has no exported member 'X'`

The types for `$app/env/private` are generated from `src/env.ts`. After adding or changing a variable there, run `npx svelte-kit sync` in the project folder, or restart `npm run dev`.

## `.md` page shows raw Markdown, or 404s

- mdsvex only handles `.svx` by default. `vite.config.ts` sets `extensions: ['.md']` in the `mdsvex({...})` options.
- For `+page.md` routes, SvelteKit also needs `extensions: ['.svelte', '.md']` in the `sveltekit({...})` options.

## `Cannot find module '....md' or its corresponding type declarations`

TypeScript needs `src/md.d.ts`, which declares `.md` imports as Svelte components. Restart the Svelte language server after adding it.


## The editor and the command line disagree about errors

`npm run check` and `npm run lint` are the source of truth. If the editor still shows errors after they pass, restart the editor's servers: **ESLint: Restart ESLint Server** and **Svelte: Restart Language Server** from the command palette (`Ctrl+Shift+P`).