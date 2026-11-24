<script lang="ts">
	import { resolve } from '$app/paths';
	import PollResults from '#lib/components/PollResults.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	type PollDefinition = (typeof data.questionnaire.polls)[number];

	const when = (date: Date) =>
		date.toLocaleString('en-IE', {
			timeZone: 'Europe/Dublin',
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			hour: '2-digit',
			minute: '2-digit'
		});

	// Keeps choices ticked if the form comes back with an error
	const checked = (id: string, value: string) => form?.values?.[id]?.includes(value) ?? false;

	// Every option in the order written in the .md file (used by the vote form)
	const optionsFor = (poll: PollDefinition): [string, string][] =>
		poll.type === 'yes-no'
			? [
					['yes', 'Yes'],
					['no', 'No']
				]
			: poll.options.map((option) => [option, option]);
</script>

<svelte:head>
	<title>{data.questionnaire.title} | CarrickDojo Club</title>
</svelte:head>

<article class="mx-auto prose w-full p-6">
	<p class="not-prose">
		<a href={resolve('/polls')} class="text-accent underline underline-offset-4">
			&larr; All polls
		</a>
	</p>

	<h1>{data.questionnaire.title}</h1>

	{#if data.status === 'closed'}
		<p><strong>This poll has closed.</strong></p>

		{#if data.resultsError}
			<p>Results aren't available right now. Please try again later.</p>
		{:else if data.results}
			{#each data.questionnaire.polls as poll (poll.id)}
				<PollResults {poll} result={data.results[poll.id]} />
			{/each}
		{/if}
	{:else if form?.voted || data.voted}
		<p role="status"><strong>Thanks! Your vote has been counted.</strong></p>
	{:else if data.status === 'upcoming'}
		<p><strong>Opens {when(data.questionnaire.opens)}.</strong></p>
		<data.content />
	{:else if !data.signedIn}
		<p><strong>Open now. Closes {when(data.questionnaire.closes)}.</strong></p>
		<data.content />
		<p><a href={resolve('/signin')}>Sign in with your code</a> to vote.</p>
	{:else if !data.sameSession}
		<p><strong>This poll is for a different session.</strong></p>
	{:else}
		<p><strong>Open now. Closes {when(data.questionnaire.closes)}.</strong></p>
		<data.content />

		<form method="POST" class="not-prose mt-8 space-y-8">
			{#if form?.formError}
				<p role="alert" class="font-semibold text-accent">{form.formError}</p>
			{/if}

			{#each data.questionnaire.polls as poll (poll.id)}
				<fieldset class="space-y-2">
					<legend class="mb-2 font-semibold">{poll.text}</legend>

					{#each optionsFor(poll) as [value, label] (value)}
						<label class="flex items-center gap-2">
							<input
								type={poll.type === 'choice' && poll.multiple ? 'checkbox' : 'radio'}
								name={poll.id}
								{value}
								required={!(poll.type === 'choice' && poll.multiple)}
								checked={checked(poll.id, value)}
							/>
							{label}
						</label>
					{/each}

					{#if form?.errors?.[poll.id]}
						<p class="text-sm text-accent">{form.errors[poll.id]}</p>
					{/if}
				</fieldset>
			{/each}

			<button
				type="submit"
				class="rounded bg-accent px-5 py-2 font-semibold text-bg hover:opacity-90"
			>
				Send my vote
			</button>
		</form>
	{/if}
</article>
