<script lang="ts">
	import Project from '#lib/components/Project.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-full w-full flex-col items-center justify-center bg-purple-900 text-lime-600">
	<div class="text-6xl font-extrabold">CarrickDojo Club</div>

	{#await data.projects}
		<p>Loading projects</p>
	{:then projects}
		{#if projects.length}
			<div class=" flex h-96 min-h-full w-6xl flex-col rounded-2xl bg-lime-300 p-3 text-purple-900">
				<h2>Featured Projects: ({projects.length})</h2>
				<div class="flex overflow-hidden">
					{#each projects as project, i (i)}
						<div class=" overflow-scroll p-3">
							<a href={'/project/' + project.title}> <Project {...project} /></a>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{:catch error}
		<p>Something went wrong: {error.message}</p>
	{/await}
</div>
