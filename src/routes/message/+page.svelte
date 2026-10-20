<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<div class="mx-auto max-w-md p-10">
	<h1 class="mb-4 text-2xl font-bold">Send a Message</h1>

	{#if form?.success}
		<p class="text-lime-600">Message sent successfully</p>
	{/if}

	<form method="POST" class="flex flex-col gap-4" use:enhance>
		<div class="flex gap-4">
			<label for="firstname" class="flex flex-col gap-4">
				<span>First name</span>
				<input
					name="firstname"
					type="text"
					class="rounded border p-2"
					value={form?.firstname ?? ''}
				/>
			</label>

			<label for="lastname" class="flex flex-col gap-4">
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
			<p class="">Email and message fields are required</p>
		{/if}

		<button class="rounded bg-blue-600 p-2 text-zinc-200 hover:bg-blue-700">Send Message</button>
	</form>
</div>
