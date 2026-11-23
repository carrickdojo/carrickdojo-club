<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.doc.title} | Docs | CarrickDojo Club</title>
	{#if data.doc.description}
		<meta name="description" content={data.doc.description} />
	{/if}
</svelte:head>

<article class="mx-auto prose w-full p-6">
	<h1 class="mb-4 text-3xl font-bold">{data.doc.title}</h1>
	<data.content />
</article>
