import { link_check } from '@mdsvex/plugin-link-check';
import { page_data } from '@mdsvex/plugin-page-data';
import { numbering } from '@mdsvex/plugin-numbering';
import { citations } from '@mdsvex/plugin-citations';
import { references } from '@mdsvex/plugin-references';
import { external_links } from '@mdsvex/plugin-external-links';
import { toc } from '@mdsvex/plugin-toc';
import { anchors } from '@mdsvex/plugin-anchors';
import { figures } from '@mdsvex/plugin-figures';
import { embeds } from '@mdsvex/plugin-embeds';
import { diagram } from '@mdsvex/plugin-diagram';
import { code_blocks } from '@mdsvex/plugin-code-blocks';
import { emoji } from '@mdsvex/plugin-emoji';
import { tabs } from '@mdsvex/plugin-tabs';
import { steps } from '@mdsvex/plugin-steps';
import { elements } from '@mdsvex/plugin-elements';
import { callouts } from '@mdsvex/plugin-callouts';
import { mdsvex } from 'mdsvex';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

// Installed version of a package, read from node_modules at build time
const installed = (name: string): string =>
	(JSON.parse(readFileSync(`node_modules/${name}/package.json`, 'utf8')) as { version: string })
		.version;

const buildInfo = {
	built: new Date().toISOString(),
	commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local',
	branch: process.env.VERCEL_GIT_COMMIT_REF ?? 'local',
	node: process.version,
	packages: Object.fromEntries(
		['@sveltejs/kit', 'svelte', 'vite', 'tailwindcss', 'mdsvex', 'typescript'].map((name) => [
			name,
			installed(name)
		])
	)
};

export default defineConfig({
	define: {
		__BUILD_INFO__: JSON.stringify(buildInfo)
	},
	plugins: [
		mdsvex({
			extensions: ['.md'],
			heading_ids: true,
			unwrap_images: true,
			plugins: [
				callouts(),
				elements(),
				steps(),
				tabs(),
				emoji(),
				code_blocks(),
				diagram(),
				embeds(),
				figures(),
				anchors(),
				toc(),
				external_links(),
				references(),
				citations(),
				numbering(),
				page_data(),
				link_check()
			]
		}),
		tailwindcss(),
		sveltekit({
			extensions: ['.svelte', '.md'],
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter()
		})
	]
});
