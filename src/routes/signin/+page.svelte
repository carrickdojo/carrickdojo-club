<script lang="ts">
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Sign in | CarrickDojo Club</title>
</svelte:head>

<div class="mx-auto w-full max-w-sm p-6">
	<h1 class="mb-4 text-3xl font-bold">Sign in</h1>

	{#if !data.sessionToday}
		<p class="text-muted">There's no session today. Codes only work on the day of a session.</p>
	{:else}
		<form method="POST" class="space-y-4">
			<label for="code" class="block font-semibold">Your code</label>
			<input
				id="code"
				name="code"
				type="text"
				required
				autocomplete="off"
				autocapitalize="characters"
				spellcheck="false"
				placeholder="e.g. RED-TIGER"
				aria-invalid={form?.error ? 'true' : undefined}
				aria-describedby={form?.error ? 'code-error' : undefined}
				class="w-full rounded border border-muted/50 bg-bg px-3 py-2 tracking-wide uppercase"
			/>
			{#if form?.error}
				<p id="code-error" role="alert" class="text-sm font-semibold text-accent">{form.error}</p>
			{/if}
			<button
				type="submit"
				class="rounded bg-accent px-5 py-2 font-semibold text-bg hover:opacity-90"
			>
				Sign in
			</button>
		</form>
	{/if}
</div>
