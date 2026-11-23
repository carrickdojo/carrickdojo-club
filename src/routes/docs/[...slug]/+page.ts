import { error, redirect } from '@sveltejs/kit';
import type { Component } from 'svelte';
import { docs } from '#lib/docs.ts';
import type { EntryGenerator, PageLoad } from './$types';

// Docs are built once into plain HTML: fast, and they need no server
export const prerender = true;
export const entries: EntryGenerator = () => docs.map((doc) => ({ slug: doc.slug }));

const pages = import.meta.glob<{ default: Component }>('/src/content/docs/**/*.md');

export const load: PageLoad = async ({ params }) => {
	if (!params.slug) redirect(307, '/docs/start-here/welcome');

	const doc = docs.find((d) => d.slug === params.slug);
	if (!doc) error(404, 'Doc not found');

	const page = await pages[`/src/content/docs/${doc.slug}.md`]();
	return { doc, content: page.default };
};
