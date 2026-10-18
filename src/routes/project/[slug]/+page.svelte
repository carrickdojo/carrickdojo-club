<script lang="ts">
	import Project from '#lib/components/Project.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

{#await data.project}
	<p>Loading projects</p>
{:then project}
	<section class="content container">
		<Project
			id={project.id}
			title={project.title}
			introduction={project.introduction}
			content={project.content}
			img={project.img}
		/>
	</section>

	<style>
		section {
			margin-top: 32px;
		}
	</style>
{:catch error}
	<p>Something went wrong: {error.message}</p>
{/await}
