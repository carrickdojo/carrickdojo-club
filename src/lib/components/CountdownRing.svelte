<script lang="ts">
	let {
		remaining,
		total,
		warn = false
	}: { remaining: number; total: number; warn?: boolean } = $props();

	const RADIUS = 54;
	const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

	const fraction = $derived(total > 0 ? Math.min(1, Math.max(0, remaining / total)) : 0);
	const seconds = $derived(Math.max(0, Math.ceil(remaining / 1000)));
	const label = $derived(`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`);
</script>

<div class="relative size-64">
	<svg viewBox="0 0 120 120" class="size-full -rotate-90" aria-hidden="true">
		<circle cx="60" cy="60" r={RADIUS} fill="none" stroke-width="8" class="stroke-muted/25" />
		<circle
			cx="60"
			cy="60"
			r={RADIUS}
			fill="none"
			stroke-width="8"
			stroke-linecap="round"
			stroke-dasharray={CIRCUMFERENCE}
			stroke-dashoffset={CIRCUMFERENCE * (1 - fraction)}
			class={[
				'transition-[stroke-dashoffset] duration-1000 ease-linear motion-reduce:transition-none',
				warn ? 'stroke-accent' : 'stroke-fg'
			]}
		/>
	</svg>
	<p class="absolute inset-0 flex items-center justify-center text-6xl font-bold tabular-nums">
		<span class="sr-only">Time left:</span>
		{label}
	</p>
</div>
