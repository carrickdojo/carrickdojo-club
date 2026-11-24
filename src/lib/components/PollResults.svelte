<script lang="ts">
	import type { Poll } from '#lib/server/polls.ts';
	import type { PollResult } from '#lib/server/polls-api.ts';

	let {
		poll,
		result,
		large = false,
		reveal = false,
		delay = 0
	}: {
		poll: Poll;
		result: PollResult;
		large?: boolean;
		reveal?: boolean;
		delay?: number;
	} = $props();

	// Every option in the order written in the .md file, including ones nobody picked
	const options = $derived<[string, string][]>(
		poll.type === 'yes-no'
			? [
					['yes', 'Yes'],
					['no', 'No']
				]
			: poll.options.map((option) => [option, option])
	);

	const percent = (count: number, total: number) =>
		total === 0 ? 0 : Math.round((count / total) * 100);
</script>

<section>
	<h2 class={large ? 'mb-2 text-4xl font-bold' : undefined}>{poll.text}</h2>
	{#if result.result === null}
		<p>
			{result.total}
			{result.total === 1 ? 'vote' : 'votes'}. Fewer than 5 people voted, so only the total is
			shown.
		</p>
	{:else}
		<p class="text-muted">
			{result.total} votes{poll.type === 'choice' && poll.multiple
				? ' (people could pick more than one)'
				: ''}
		</p>
		<ul class={['not-prose', large ? 'mt-6 space-y-6 text-3xl' : 'space-y-3']}>
			{#each options as [value, label], i (value)}
				{@const count = result.result[value] ?? 0}
				<li>
					<div class="flex justify-between">
						<span>{label}</span>
						<span class="tabular-nums">{count} ({percent(count, result.total)}%)</span>
					</div>
					<div
						class={['w-full overflow-hidden rounded bg-muted/20', large ? 'h-6' : 'h-2']}
						aria-hidden="true"
					>
						<div
							class={['h-full rounded bg-accent', reveal && 'grow']}
							style:width="{percent(count, result.total)}%"
							style:animation-delay="{delay + i * 300}ms"
						></div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.grow {
		transform-origin: left;
		animation: grow 1s ease-out both;
	}

	@keyframes grow {
		from {
			transform: scaleX(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.grow {
			animation: none;
		}
	}
</style>
