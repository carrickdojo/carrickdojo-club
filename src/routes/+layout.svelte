<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/coderdojo-roundel.svg';
	import type { LayoutProps } from './$types';
	import Header from '#lib/components/Header.svelte';
	import Footer from '#lib/components/Footer.svelte';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a
	href="#content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-wobble focus:border-2 focus:border-ink focus:bg-paper focus:px-4 focus:py-2"
>
	Skip to content
</a>

<div class="flex min-h-screen flex-col">
	<Header />

	<main id="content" class="mx-auto flex w-full max-w-6xl flex-1 justify-center">
		{@render children()}
	</main>

	<Footer />
</div>
