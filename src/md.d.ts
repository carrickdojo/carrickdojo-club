// Tells TypeScript that .md files import as Svelte components (compiled by mdsvex)
declare module '*.md' {
	import type { Component } from 'svelte';
	const component: Component;
	export default component;
}
