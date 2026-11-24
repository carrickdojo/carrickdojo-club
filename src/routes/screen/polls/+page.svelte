<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import CountdownRing from '#lib/components/CountdownRing.svelte';
	import PollResults from '#lib/components/PollResults.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const REFRESH_MS = 30_000;
	const LAST_CALL_MS = 2 * 60_000;

	// The projector's clock may be wrong, so count down from the server's time
	const offset = $derived(data.serverNow - Date.now());
	let now = $state(Date.now());

	$effect(() => {
		const tick = setInterval(() => (now = Date.now()), 1000);
		const refresh = setInterval(() => void invalidateAll(), REFRESH_MS);
		return () => {
			clearInterval(tick);
			clearInterval(refresh);
		};
	});

	const remaining = $derived(
		data.questionnaire ? data.questionnaire.closes.getTime() - (now + offset) : 0
	);
	const duration = $derived(
		data.questionnaire
			? data.questionnaire.closes.getTime() - data.questionnaire.opens.getTime()
			: 0
	);
	const lastCall = $derived(data.status === 'open' && remaining <= LAST_CALL_MS);

	// At closing time, fetch the results (retrying every few seconds until the server agrees)
	let closingReload = false;
	$effect(() => {
		if (data.status === 'open' && remaining <= 0 && !closingReload) {
			closingReload = true;
			setTimeout(() => {
				void invalidateAll().finally(() => (closingReload = false));
			}, 3000);
		}
	});

	const time = (date: Date) =>
		date.toLocaleTimeString('en-IE', {
			timeZone: 'Europe/Dublin',
			hour: '2-digit',
			minute: '2-digit'
		});

	const turnout = $derived(
		data.signedIn === 0 ? 0 : Math.min(100, (data.voted / data.signedIn) * 100)
	);
</script>

<svelte:head>
	<title>Polls screen | CarrickDojo Club</title>
</svelte:head>

{#snippet signin()}
	<div class="flex items-center gap-6">
		<img
			src={data.qr}
			alt="QR code for {data.signinAddress}"
			class="size-40 rounded bg-white p-2"
		/>
		<p class="text-3xl">
			Sign in at<br /><strong class="text-accent">{data.signinAddress}</strong>
		</p>
	</div>
{/snippet}

<div data-theme="night" class="fixed inset-0 z-50 overflow-y-auto bg-bg p-10 text-fg">
	{#if !data.questionnaire}
		<div class="flex h-full flex-col items-center justify-center gap-10 text-center">
			<h1 class="text-6xl font-bold">No polls right now</h1>
			{@render signin()}
		</div>
	{:else}
		<h1 class="mb-10 text-5xl font-bold">{data.questionnaire.title}</h1>

		{#if data.status === 'upcoming'}
			<p class="mb-10 text-4xl">Opens at {time(data.questionnaire.opens)}</p>
			{@render signin()}
		{:else if data.status === 'open'}
			<div class="grid grid-cols-[1fr_auto] items-center gap-16">
				<div class="space-y-10">
					<p class="text-5xl font-bold tabular-nums" role="status">
						{data.voted} of {data.signedIn} voted
					</p>
					<div class="h-10 w-full overflow-hidden rounded-full bg-muted/20" aria-hidden="true">
						<div
							class="h-full rounded-full bg-accent transition-[width] duration-700 motion-reduce:transition-none"
							style:width="{turnout}%"
						></div>
					</div>
					{@render signin()}
				</div>
				<div class="flex flex-col items-center gap-6">
					<CountdownRing {remaining} total={duration} warn={lastCall} />
					<p class={['text-4xl font-bold text-accent', !lastCall && 'invisible']}>Last call!</p>
				</div>
			</div>
		{:else if data.results}
			<div class="grid gap-16 lg:grid-cols-2">
				{#each data.questionnaire.polls as poll, i (poll.id)}
					<PollResults {poll} result={data.results[poll.id]} large reveal delay={i * 1500} />
				{/each}
			</div>
		{:else}
			<p class="text-4xl">Counting the votes…</p>
		{/if}

		{#if data.offline}
			<p class="fixed right-6 bottom-6 text-xl text-muted">Reconnecting…</p>
		{/if}
	{/if}
	<form method="POST" action="?/signout" class="fixed bottom-6 left-6">
		<button type="submit" class="rounded px-3 py-1 text-xl text-muted hover:text-fg">
			Sign out
		</button>
	</form>
</div>
