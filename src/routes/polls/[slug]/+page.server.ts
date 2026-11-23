import { error, fail, redirect } from '@sveltejs/kit';
import { questionnaires, status, type Poll } from '#lib/server/polls.ts';
import { me, PollsError, resultFor, vote, type PollResult } from '#lib/server/polls-api.ts';
import { SIGNIN_COOKIE } from '#lib/server/signin.ts';
import type { Actions, PageServerLoad } from './$types';

function findQuestionnaire(slug: string) {
	const questionnaire = questionnaires.find((q) => q.slug === slug);
	if (!questionnaire) error(404, 'Poll not found');
	return questionnaire;
}

export const load: PageServerLoad = async ({ params, locals, cookies, fetch }) => {
	const questionnaire = findQuestionnaire(params.slug);

	let signedIn = false;
	let sameSession = false;
	let voted = false;

	if (locals.token) {
		try {
			const info = await me(fetch, locals.token);
			signedIn = true;
			sameSession = info.session === questionnaire.session;
			voted = questionnaire.polls.every((poll) => info.voted.includes(poll.id));
		} catch (err) {
			// The sign-in has ended: clear the cookie and carry on as signed out
			if (!(err instanceof PollsError && err.status === 401)) throw err;
			cookies.delete(SIGNIN_COOKIE, { path: '/' });
		}
	}

	// Closed: fetch the results, finalising each poll the first time
	let results: Record<string, PollResult> | null = null;
	let resultsError = false;

	if (status(questionnaire) === 'closed') {
		try {
			const list = await Promise.all(questionnaire.polls.map((poll) => resultFor(fetch, poll.id)));
			results = Object.fromEntries(list.map((result) => [result.poll, result]));
		} catch (err) {
			console.error(
				'Loading results failed:',
				err instanceof Error ? err.message : 'unknown error'
			);
			resultsError = true;
		}
	}

	return {
		questionnaire,
		status: status(questionnaire),
		signedIn,
		sameSession,
		voted,
		results,
		resultsError
	};
};

/**
 * Checks an answer against the poll's .md file. Returns null if it isn't a valid answer.
 */
function readAnswer(poll: Poll, values: string[]): string | string[] | null {
	if (values.length === 0 || new Set(values).size !== values.length) return null;

	if (poll.type === 'yes-no') {
		return values.length === 1 && (values[0] === 'yes' || values[0] === 'no') ? values[0] : null;
	}

	if (!values.every((value) => poll.options.includes(value))) return null;
	if (poll.multiple) return values;
	return values.length === 1 ? values[0] : null;
}

export const actions = {
	default: async ({ params, request, locals, cookies, fetch }) => {
		const questionnaire = findQuestionnaire(params.slug);
		if (!locals.token) redirect(303, '/signin');

		const data = await request.formData();

		// Keep what was chosen, so the form can be shown again with it filled in
		const values: Record<string, string[]> = {};
		const errors: Record<string, string> = {};
		const answers: Record<string, string | string[]> = {};

		for (const poll of questionnaire.polls) {
			values[poll.id] = data
				.getAll(poll.id)
				.filter((value): value is string => typeof value === 'string');

			const answer = readAnswer(poll, values[poll.id]);
			if (answer === null) errors[poll.id] = 'Please choose an answer';
			else answers[poll.id] = answer;
		}

		// One shape for every failure, so the page can rely on it
		const failWith = (code: number, fieldErrors: Record<string, string>, formError?: string) =>
			fail(code, { values, errors: fieldErrors, formError });

		if (status(questionnaire) !== 'open') return failWith(409, {}, 'This poll is not open.');
		if (Object.keys(errors).length > 0) return failWith(400, errors);

		// Never log the answers: votes must stay anonymous
		let signedOut = false;
		try {
			const info = await me(fetch, locals.token);
			if (info.session !== questionnaire.session) {
				return failWith(409, {}, 'This poll is for a different session.');
			}
			await vote(fetch, locals.token, answers);
		} catch (err) {
			if (err instanceof PollsError && err.status === 401) {
				signedOut = true;
			} else if (err instanceof PollsError && (err.status === 400 || err.status === 409)) {
				return failWith(err.status, {}, err.message);
			} else {
				console.error('Voting failed:', err instanceof Error ? err.message : 'unknown error');
				return failWith(500, {}, 'Sorry, your vote could not be sent. Please tell a mentor.');
			}
		}

		if (signedOut) {
			cookies.delete(SIGNIN_COOKIE, { path: '/' });
			redirect(303, '/signin');
		}

		return { voted: true };
	}
} satisfies Actions;
