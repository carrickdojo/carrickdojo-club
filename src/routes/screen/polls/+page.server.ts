import { redirect } from '@sveltejs/kit';
import QRCode from 'qrcode';
import { questionnaires, status, type Questionnaire } from '#lib/server/polls.ts';
import {
	live,
	me,
	PollsError,
	resultFor,
	signout,
	type Live,
	type PollResult
} from '#lib/server/polls-api.ts';
import { SIGNIN_COOKIE } from '#lib/server/signin.ts';
import type { Actions, PageServerLoad } from './$types';

/** The open one closing soonest, else the last one closed, else the next one to open. */
function pick(today: Questionnaire[], now: Date): Questionnaire | undefined {
	const byCloses = [...today].sort((a, b) => a.closes.getTime() - b.closes.getTime());
	return (
		byCloses.find((q) => status(q, now) === 'open') ??
		byCloses.findLast((q) => status(q, now) === 'closed') ??
		byCloses.find((q) => status(q, now) === 'upcoming')
	);
}

export const actions = {
	signout: async ({ locals, cookies, fetch }) => {
		if (locals.token) await signout(fetch, locals.token).catch(() => undefined);
		cookies.delete(SIGNIN_COOKIE, { path: '/' });
		redirect(303, '/signin');
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ locals, cookies, fetch, url }) => {
	if (!locals.token) redirect(303, '/signin');
	const token = locals.token;

	const signedOut = (err: unknown) => {
		if (err instanceof PollsError && err.status === 401) {
			cookies.delete(SIGNIN_COOKIE, { path: '/' });
			redirect(303, '/signin');
		}
	};

	const info = await me(fetch, token).catch((err: unknown) => {
		signedOut(err);
		throw err;
	});
	if (info.kind === 'member') redirect(303, '/polls');
	// if (info.kind === 'screen' || info.kind === 'mentor') redirect(303, '/screen/polls');

	const now = new Date();
	const signinAddress = `${url.host}/signin`;
	const qr = await QRCode.toDataURL(new URL('/signin', url.origin).href, { margin: 1, width: 320 });

	const questionnaire = pick(
		questionnaires.filter((q) => q.session === info.session),
		now
	);
	const state = questionnaire ? status(questionnaire, now) : null;

	// Totals only. If WordPress is slow, keep the screen up and try again on the next refresh
	let counts: Live | null = null;
	if (questionnaire) {
		try {
			counts = await live(
				fetch,
				token,
				questionnaire.polls.map((poll) => poll.id)
			);
		} catch (err) {
			signedOut(err);
			console.error('Live counts failed:', err instanceof Error ? err.message : 'unknown error');
		}
	}

	let results: Record<string, PollResult> | null = null;
	if (questionnaire && state === 'closed') {
		try {
			const list = await Promise.all(questionnaire.polls.map((poll) => resultFor(fetch, poll.id)));
			results = Object.fromEntries(list.map((result) => [result.poll, result]));
		} catch (err) {
			console.error(
				'Loading results failed:',
				err instanceof Error ? err.message : 'unknown error'
			);
		}
	}

	return {
		questionnaire: questionnaire ?? null,
		status: state,
		signedIn: counts?.signed_in ?? 0,
		voted: Math.max(0, ...Object.values(counts?.polls ?? {}).map((poll) => poll.votes)),
		offline: questionnaire !== undefined && counts === null,
		results,
		signinAddress,
		qr,
		serverNow: now.getTime()
	};
};
