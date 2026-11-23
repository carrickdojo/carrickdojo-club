import { fail, redirect } from '@sveltejs/kit';
import { todaysSession } from '#lib/server/sessions.ts';
import { PollsError, signin } from '#lib/server/polls-api.ts';
import { SIGNIN_COOKIE, cookieOptions } from '#lib/server/signin.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.token) redirect(303, '/polls');
	return { sessionToday: todaysSession() !== null };
};

export const actions = {
	default: async ({ request, cookies, fetch }) => {
		const value = (await request.formData()).get('code');
		const code = typeof value === 'string' ? value.trim() : '';

		if (!code) return fail(400, { error: 'Please enter the code from your slip.' });

		const session = todaysSession();
		if (!session) return fail(400, { error: "There's no session today." });

		let token: string;
		try {
			({ token } = await signin(fetch, session.id, code, session.end));
		} catch (err) {
			if (err instanceof PollsError && (err.status === 400 || err.status === 429)) {
				return fail(err.status, { error: err.message });
			}
			// Never log the code
			console.error('Sign-in failed:', err instanceof Error ? err.message : 'unknown error');
			return fail(500, {
				error: 'Sorry, signing in is not working right now. Please tell a mentor.'
			});
		}

		cookies.set(SIGNIN_COOKIE, token, cookieOptions());
		redirect(303, '/polls');
	}
} satisfies Actions;
