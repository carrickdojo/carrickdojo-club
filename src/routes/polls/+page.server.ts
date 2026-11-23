import { redirect } from '@sveltejs/kit';
import { me, PollsError, signout } from '#lib/server/polls-api.ts';
import { SIGNIN_COOKIE } from '#lib/server/signin.ts';
import type { Actions, PageServerLoad } from './$types';
import { questionnaires, status } from '#lib/server/polls.ts';

export const load: PageServerLoad = async ({ locals, cookies, fetch }) => {
	if (!locals.token) redirect(303, '/signin');

	try {
		const { code, session, voted } = await me(fetch, locals.token);

		const polls = questionnaires
			.filter((q) => q.session === session)
			.map((q) => ({
				slug: q.slug,
				title: q.title,
				status: status(q),
				voted: q.polls.every((poll) => voted.includes(poll.id))
			}));

		return { code, polls };
	} catch (err) {
		// The sign-in has ended (or was never valid): clear the cookie and start again
		if (err instanceof PollsError && err.status === 401) {
			cookies.delete(SIGNIN_COOKIE, { path: '/' });
			redirect(303, '/signin');
		}
		throw err;
	}
};

export const actions = {
	signout: async ({ locals, cookies, fetch }) => {
		if (locals.token) await signout(fetch, locals.token).catch(() => undefined);
		cookies.delete(SIGNIN_COOKIE, { path: '/' });
		redirect(303, '/signin');
	}
} satisfies Actions;
