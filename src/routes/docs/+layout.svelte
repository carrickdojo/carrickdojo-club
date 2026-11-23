<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { docs, docsNav } from '#lib/docs.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// The doc and section we're on, worked out from the URL
	const current = $derived(docs.find((doc) => doc.slug === page.params.slug));
	const section = $derived(docsNav.find((s) => s.slug === current?.section));

	const crumb = "before:mr-2 before:content-['/']";
</script>

<div class="mx-auto flex w-full max-w-6xl flex-1 flex-col md:flex-row">
	<aside class="border-b border-muted/30 p-6 md:w-60 md:shrink-0 md:border-r md:border-b-0">
		<nav aria-label="Docs">
			{#each docsNav as s (s.slug)}
				<h2 class="mt-4 mb-1 text-sm font-semibold tracking-wide text-muted uppercase first:mt-0">
					{s.title}
				</h2>
				<ul class="space-y-1">
					{#each s.pages as doc (doc.slug)}
						<li>
							<a
								href={resolve('/docs/[...slug]', { slug: doc.slug })}
								aria-current={doc.slug === current?.slug ? 'page' : undefined}
								class="hover:text-accent aria-[current=page]:font-semibold aria-[current=page]:text-accent"
							>
								{doc.title}
							</a>
						</li>
					{/each}
				</ul>
			{/each}
		</nav>
	</aside>

	<div class="min-w-0 flex-1">
		{#if current && section}
			<nav aria-label="Breadcrumb" class="px-6 pt-6 text-sm text-muted">
				<ol class="flex flex-wrap gap-2">
					<li>
						<a
							href={resolve('/docs/[...slug]', { slug: 'start-here/welcome' })}
							class="hover:text-accent"
						>
							Docs
						</a>
					</li>
					<li class={crumb}>{section.title}</li>
					<li class="{crumb} text-fg" aria-current="page">{current.title}</li>
				</ol>
			</nav>
		{/if}

		{@render children()}
	</div>
</div>
