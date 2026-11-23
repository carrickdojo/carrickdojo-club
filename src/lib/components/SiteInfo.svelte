<script lang="ts">
	import { buildInfo as info } from '#lib/build-info.ts';

	const built = new Date(info.built).toLocaleString('en-IE', {
		dateStyle: 'long',
		timeStyle: 'short',
		timeZone: 'Europe/Dublin'
	});
</script>

<h2>This build</h2>
<table>
	<tbody>
		<tr><th scope="row">Built</th><td>{built}</td></tr>
		<tr><th scope="row">Branch</th><td>{info.branch}</td></tr>
		<tr>
			<th scope="row">Commit</th>
			<td>
				{#if info.commit === 'local'}
					local
				{:else}
					<a href="https://github.com/carrickdojo/carrickdojo-club/commit/{info.commit}">
						{info.commit}
					</a>
				{/if}
			</td>
		</tr>
		<tr><th scope="row">Node</th><td>{info.node}</td></tr>
	</tbody>
</table>

<h2>Versions</h2>
<table>
	<tbody>
		{#each Object.entries(info.packages) as [name, version] (name)}
			<tr><th scope="row"><code>{name}</code></th><td>{version}</td></tr>
		{/each}
	</tbody>
</table>
