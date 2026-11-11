<script lang="ts">
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import { Mail } from 'lucide-svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let submitting = $state(false);

	const values: Record<string, string | undefined> = $derived(form?.values ?? {});
	const errors: Record<string, string | undefined> = $derived(form?.errors ?? {});
</script>

{#snippet field(
	name: string,
	label: string,
	type: HTMLInputAttributes['type'],
	autocomplete: HTMLInputAttributes['autocomplete'],
	max: number
)}
	<div class="flex flex-1 flex-col gap-1">
		<label for={name}>{label}</label>
		<input
			id={name}
			{name}
			{type}
			{autocomplete}
			maxlength={max}
			required
			value={values[name] ?? ''}
			aria-invalid={errors[name] ? 'true' : undefined}
			aria-describedby={errors[name] ? `${name}-error` : undefined}
			class="rounded border p-2"
		/>
		{#if errors[name]}
			<p id="{name}-error" class="">{errors[name]}</p>
		{/if}
	</div>
{/snippet}

<div class="mx-auto my-2 w-full max-w-xl rounded p-6 sm:p-8">
	<div class="mb-4 flex items-center justify-center gap-2 rounded p-1">
		<h1 class="text-3xl font-semibold tracking-tighter">Send a Message</h1>
		<Mail aria-hidden="true" />
	</div>

	<!-- Always in the page, so screen readers announce the text when it appears -->
	<div role="status" aria-live="polite">
		{#if form?.success}
			<p class="mb-2 rounded p-2 font-medium">Thanks, your message has been sent.</p>
		{/if}
	</div>

	{#if form?.formError}
		<p role="alert" class="mb-2 rounded p-2 font-medium">
			{form.formError}
		</p>
	{/if}

	<form
		method="POST"
		class="flex flex-col gap-3"
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				await update();
				submitting = false;
				// Move focus to the first field with a problem
				await tick();
				document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
			};
		}}
	>
		<div class="flex flex-col gap-3 sm:flex-row sm:gap-4">
			{@render field('firstname', 'First name', 'text', 'given-name', 100)}
			{@render field('lastname', 'Last name', 'text', 'family-name', 100)}
		</div>

		<div class="flex flex-col gap-3 sm:flex-row sm:gap-4">
			{@render field('email', 'Email', 'email', 'email', 254)}
			{@render field('phone', 'Phone', 'tel', 'tel', 50)}
		</div>

		{@render field('question', 'Question', 'text', 'off', 200)}

		<div class="flex flex-col gap-1">
			<label for="message">Message</label>
			<textarea
				id="message"
				name="message"
				rows="6"
				maxlength="5000"
				required
				value={values.message ?? ''}
				aria-invalid={errors.message ? 'true' : undefined}
				aria-describedby={errors.message ? 'message-error' : undefined}
				class="rounded border p-2"></textarea>
			{#if errors.message}
				<p id="message-error" class="text-amber-200">{errors.message}</p>
			{/if}
		</div>

		<!-- Honeypot: hidden from people, often filled in by bots. Do not remove. -->
		<div class="absolute -left-[9999px]" aria-hidden="true">
			<label>
				Website
				<input name="website" type="text" tabindex="-1" autocomplete="off" />
			</label>
		</div>

		<p class="text-center text-xs">
			We only use your details to reply to your message. Please don't include sensitive personal
			information.
		</p>

		<button
			disabled={submitting}
			class="rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
		>
			<span class="flex items-center justify-center gap-2">
				<Mail aria-hidden="true" />
				{submitting ? 'Sending…' : 'Send Message'}
			</span>
		</button>
	</form>
</div>
