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

// export const load = (async ({ fetch }) => {
// 	const fetchProjects = async () => {
// 		try {
// 			const response = await fetch(`https://carrickdojo.wasmer.app/json/api/projects`);
// 			const projects = await response.json();
// 			return projects;
// 		} catch (error) {
// 			console.log(error);
// 			return [];
// 		}
// 	};

// 	return {
// 		projects: fetchProjects()
// 	};
// }) satisfies PageLoad;

// import { PUBLIC_URL_DATABASE } from '$env/static/public';

// export const load = async ({fetch}) => {

//     const fetchProjects = async () => {

//         try {
//             const response = await fetch(`${PUBLIC_URL_DATABASE}/json/api/projects`);
//             const projects = await response.json();
//             console.log("Fetched Posts")
//             return projects;

//         } catch (error) {
//             console.log("Something went wrong... ")
//             console.log(error)
//             return []
//         }
//     }
//   return {
//     projects: fetchProjects()
//   }
// }
