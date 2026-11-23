import type { Component } from 'svelte';
import type { PageLoad } from './$types';

const pages = import.meta.glob<{ default: Component }>('/src/content/polls/*.md');

export const load: PageLoad = async ({ data }) => {
	const page = await pages[`/src/content/polls/${data.questionnaire.slug}.md`]();
	return { ...data, content: page.default };
};
