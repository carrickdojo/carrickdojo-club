<script lang="ts">
	import roundel from '#lib/assets/coderdojo-roundel.svg';
</script>

<svelte:head>
	<title>CarrickDojo Club</title>
	<meta
		name="description"
		content="The CarrickDojo club site for ninjas and mentors. Coming soon."
	/>
</svelte:head>

<main class="grid min-h-dvh place-items-center p-6 text-center">
	<div class="max-w-md space-y-6">
		<img src={roundel} alt="" width="120" height="120" class="mx-auto" />
		<h1 class="text-4xl font-bold">CarrickDojo Club</h1>
		<p class="text-lg text-muted">
			We're building something new for our ninjas and mentors. Check back soon!
		</p>
		<p>
			In the meantime, visit
			<a
				href="https://carrickdojo.com"
				class="font-semibold text-accent underline underline-offset-4">carrickdojo.com</a
			>
		</p>
	</div>
</main>
