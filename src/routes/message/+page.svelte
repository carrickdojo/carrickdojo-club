<script lang="ts">
	import { enhance } from '$app/forms';
	import { Mail } from 'lucide-svelte';

	let { form } = $props();
</script>

<div class="m-2 mx-auto flex w-[50vw] flex-col gap-2 rounded bg-purple-800 p-8 text-lime-200">
	<div class="flex items-center justify-center gap-2 rounded bg-lime-600 text-purple-800">
		<h1 class=" text-3xl font-semibold tracking-tighter">Send a Message</h1>
		<Mail class=" p-.5  leading-1.5" />
	</div>

	{#if form?.success}
		<p class="text-lime-600">Message sent successfully</p>
	{/if}

	<form method="POST" class="flex flex-col gap-2" use:enhance>
		<div class="flex gap-4">
			<label for="firstname" class="flex flex-col gap-1">
				<span>First name</span>
				<input
					name="firstname"
					type="text"
					class="rounded border p-2"
					value={form?.firstname ?? ''}
				/>
			</label>

			<label for="lastname" class="flex flex-col gap-1">
				<span>Last name</span>
				<input
					name="lastname"
					type="text"
					class="rounded border p-2"
					value={form?.lastname ?? ''}
				/>
			</label>
		</div>
		<div class="flex gap-4">
			<label for="email" class="flex flex-col gap-4">
				<span>Email</span>
				<input name="email" type="email" class="rounded border p-2" value={form?.email ?? ''} />
			</label>
			<label for="phone" class="flex flex-col gap-4">
				<span>Phone</span>
				<input name="phone" type="tel" class="rounded border p-2" value={form?.phone ?? ''} />
			</label>
		</div>

		<label for="question" class="flex flex-col gap-4">
			<span>Question</span>
			<input name="question" type="text" class="rounded border p-2" value={form?.question ?? ''} />
		</label>

		<label for="message" class="flex flex-col gap-4">
			<span>Message</span>
			<textarea name="message" class="rounded border p-2" value={(form?.message as string) ?? ''}
			></textarea>
		</label>

		{#if form?.missing}
			<p class="">All fields are required</p>
		{/if}

		<button class="rounded bg-blue-600 p-2 text-zinc-200 hover:bg-blue-700">
			<span class="flex items-center justify-center gap-2"> <Mail /> Send Message</span></button
		>
	</form>
</div>
