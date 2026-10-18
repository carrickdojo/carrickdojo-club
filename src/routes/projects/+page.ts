import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	try {
		const response = await fetch('https://carrickdojo.wasmer.app/json/api/projects');

		if (!response.ok) {
			console.error(`Projects request failed: ${response.status}`);
			return { projects: [] };
		}
		console.log('Fetched Posts');
		// console.log(response.json());
		return { projects: await response.json() };
	} catch (error) {
		console.error('Could not load projects:', error);
		return { projects: [] };
	}
}) satisfies PageLoad;
