import { CMS_URL, DOJO_POLLING_SECRET } from '$app/env/private';

export class PollsError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

/**
 * Every call to the polls plugin goes through here. Server only: the secret never reaches the browser.
 */
async function call<T>(fetch: typeof globalThis.fetch, path: string, body: object): Promise<T> {
	if (!DOJO_POLLING_SECRET) throw new PollsError(503, 'Polls are not set up yet.');

	const response = await fetch(`${CMS_URL}/polls${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'X-Polling-Secret': DOJO_POLLING_SECRET },
		body: JSON.stringify(body),
		signal: AbortSignal.timeout(8000)
	});

	const data: unknown = await response.json().catch(() => null);

	if (!response.ok) {
		// The plugin's messages are written for ninjas, so pass them on
		const message =
			typeof data === 'object' &&
			data !== null &&
			'message' in data &&
			typeof data.message === 'string'
				? data.message
				: 'Something went wrong.';
		throw new PollsError(response.status, message);
	}

	return data as T;
}

export interface Me {
	session: string;
	code: string;
	voted: string[];
	nickname: string | null;
}

export const signin = (
	fetch: typeof globalThis.fetch,
	session: string,
	code: string,
	expires: Date
) =>
	call<{ token: string; expires_at: string }>(fetch, '/signin', {
		session,
		code,
		expires: expires.toISOString()
	});

export const signout = (fetch: typeof globalThis.fetch, token: string) =>
	call<{ signed_out: boolean }>(fetch, '/signout', { token });

export const me = (fetch: typeof globalThis.fetch, token: string) =>
	call<Me>(fetch, '/me', { token });

export const vote = (
	fetch: typeof globalThis.fetch,
	token: string,
	answers: Record<string, string | string[]>
) => call<{ voted: string[] }>(fetch, '/vote', { token, answers });

export interface PollResult {
	poll: string;
	total: number;
	finalised_at: string;
	result: Record<string, number> | null; // null when fewer than 5 votes: only the total is shown
}

/** The saved result, or null if the poll hasn't been finalised yet. Public, so no secret is sent. */
async function getResult(fetch: typeof globalThis.fetch, poll: string): Promise<PollResult | null> {
	const response = await fetch(`${CMS_URL}/polls/${poll}/results`, {
		signal: AbortSignal.timeout(8000)
	});
	if (response.status === 404) return null;
	if (!response.ok) throw new PollsError(response.status, 'Could not load results.');
	return (await response.json()) as PollResult;
}

/** Tallies the votes, saves the result and deletes the votes. Safe to call more than once. */
const finalise = (fetch: typeof globalThis.fetch, poll: string) =>
	call<PollResult>(fetch, `/${poll}/finalise`, {});

/** The result of a closed poll, finalising it the first time it's asked for. */
export async function resultFor(fetch: typeof globalThis.fetch, poll: string): Promise<PollResult> {
	return (await getResult(fetch, poll)) ?? (await finalise(fetch, poll));
}
