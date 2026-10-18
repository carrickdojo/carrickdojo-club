<script>
	import Button from './ui/button/button.svelte';
</script>

<div class="flex h-[8vh] items-center bg-purple-800 text-zinc-200">
	<a class="flex w-[20vw] items-center justify-center gap-1" href="/">
		<img class="h-[6vh] w-[6vh]" src="images/logos/coderdojo-roundel.svg" alt="CarrickDojo Logo" />
		<div class="flex h-full w-[20vm-6vh] flex-col text-center hover:text-white">
			<div class="text-2xl leading-snug font-extrabold">CarrickDojo</div>
			<div class="text-xl leading-0.5 font-extrabold">Club Site</div>
		</div>
	</a>

	<div class="">
		<a href="/projects">
			<Button>PROJECTS</Button>
		</a>
	</div>
</div>
