import { error } from '@sveltejs/kit';
import { CMS_URL } from '$app/env/private';

// Every WordPress request goes through here. Files in lib/server can never reach the browser.
export async function cmsGet<T>(fetch: typeof globalThis.fetch, path: string): Promise<T> {
	const response = await fetch(`${CMS_URL}${path}`, {
		headers: { Accept: 'application/json' },
		signal: AbortSignal.timeout(8000)
	});

	if (response.status === 404) error(404, 'Not found');

	if (!response.ok) {
		console.error(`CMS request ${path} failed: ${response.status}`);
		error(502, 'The CMS is unavailable right now');
	}

	return response.json() as Promise<T>;
}
