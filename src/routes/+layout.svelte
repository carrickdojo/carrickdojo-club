<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import Header from '#lib/components/Header.svelte';
	import Footer from '#lib/components/Footer.svelte';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col justify-between bg-purple-900 text-zinc-100">
	<Header />
	<div class="mx-auto flex min-h-[84vh] max-w-6xl">
		{@render children()}
	</div>

	<Footer />
</div>
