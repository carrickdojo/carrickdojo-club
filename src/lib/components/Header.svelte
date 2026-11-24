<script lang="ts">
	import { page } from '$app/state';
	import roundel from '#lib/assets/coderdojo-roundel.svg';
	import { resolve } from '$app/paths';
	const linkClass =
		'hover:text-accent aria-[current=page]:font-semibold aria-[current=page]:text-accent';

	// Highlights the section you're in, e.g. /projects/my-game highlights Projects
	const isActive = (href: string) =>
		href === '/'
			? page.url.pathname === '/'
			: page.url.pathname === href || page.url.pathname.startsWith(href + '/');
</script>

<header class="border-b border-muted/30">
	<nav aria-label="Main" class="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 p-4">
		<a href={resolve('/')} class="mr-auto flex items-center gap-2 font-bold">
			<img src={roundel} alt="" width="32" height="32" />
			CarrickDojo Club
		</a>
		<ul class="flex gap-4">
			<li>
				<a href={resolve('/')} aria-current={isActive('/') ? 'page' : undefined} class={linkClass}>
					Home
				</a>
			</li>
			<li>
				<a
					href={resolve('/docs/[...slug]', { slug: 'start-here/welcome' })}
					aria-current={isActive('/docs') ? 'page' : undefined}
					class={linkClass}
				>
					Docs
				</a>
			</li>
			<li>
				<a
					href={resolve('/polls')}
					aria-current={isActive('/polls') ? 'page' : undefined}
					class={linkClass}
				>
					Polls
				</a>
			</li>
		</ul>
	</nav>
</header>
