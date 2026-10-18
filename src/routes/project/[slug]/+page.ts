import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	const fetchProject = async () => {
		const response = await fetch(`https://carrickdojo.wasmer.app/json/api/project/${params.slug}`);
		const project = await response.json();

		return project;
	};

	return {
		project: fetchProject()
	};
}) satisfies PageLoad;
