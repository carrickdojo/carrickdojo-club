<script lang="ts">
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Polls | CarrickDojo Club</title>
</svelte:head>

<div class="mx-auto w-full max-w-2xl space-y-6 p-6">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<p>Signed in as <strong class="tracking-wide">{data.code}</strong></p>
		<form method="POST" action="?/signout">
			<button
				type="submit"
				class="rounded border border-muted/50 px-4 py-2 font-semibold hover:border-accent"
			>
				I'm finished
			</button>
		</form>
	</div>

	<h1 class="text-3xl font-bold">Polls</h1>
	{#if data.polls.length === 0}
		<p class="text-muted">No polls today.</p>
	{:else}
		<ul class="space-y-3">
			{#each data.polls as poll (poll.slug)}
				<li>
					<a
						href={resolve('/polls/[slug]', { slug: poll.slug })}
						class="flex items-center justify-between rounded-lg border border-muted/30 p-4 hover:border-accent"
					>
						<span class="font-semibold">{poll.title}</span>
						<span class="text-sm text-muted">
							{#if poll.voted}Voted ✓{:else if poll.status === 'open'}Open{:else if poll.status === 'upcoming'}Not
								open yet{:else}Closed{/if}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>
