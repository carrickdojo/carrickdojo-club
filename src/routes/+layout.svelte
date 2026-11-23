<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/coderdojo-roundel.svg';
	import Header from '#lib/components/Header.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a
	href="#content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-bg focus:p-2"
>
	Skip to content
</a>

<div class="flex min-h-dvh flex-col">
	<Header />
	<main id="content" class="flex flex-1 flex-col">
		{@render children()}
	</main>
</div>
