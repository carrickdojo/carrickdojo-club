import { dublinTime, isRecord } from '#lib/server/helpers.ts';
import { sessionOn } from '#lib/server/sessions.ts';

/** One question. Its id is the poll's slug in WordPress, so it must be unique across all files. */
export type Poll =
	| { id: string; type: 'yes-no'; text: string }
	| { id: string; type: 'choice'; text: string; options: string[]; multiple: boolean };

/** A .md file in src/content/polls: an intro and one or more polls, for one session. */
export interface Questionnaire {
	slug: string;
	title: string;
	session: string;
	opens: Date;
	closes: Date;
	polls: Poll[];
}

export type Status = 'upcoming' | 'open' | 'closed';

const SLUG = /^[a-z0-9-]{1,100}$/;
// Poll IDs need at least one letter (the WordPress plugin can't store all-number IDs)
const POLL_ID = /^[a-z0-9-]*[a-z][a-z0-9-]*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const LOCAL_TIME = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
const MINUTE = 60_000;

function fail(slug: string, message: string): never {
	throw new Error(`Poll file "${slug}": ${message}`);
}

function localTime(slug: string, value: unknown, name: string): Date {
	if (typeof value !== 'string' || !LOCAL_TIME.test(value)) {
		fail(slug, `${name} must be a quoted Irish time like '2026-11-24 19:00'`);
	}
	return dublinTime(value);
}

function parsePoll(slug: string, value: unknown): Poll {
	if (!isRecord(value)) fail(slug, 'each poll needs an id, type and text');

	const { id, type, text, options, multiple } = value;

	if (typeof id !== 'string' || !POLL_ID.test(id)) {
		fail(slug, `poll id "${String(id)}" must use lowercase letters, numbers and hyphens`);
	}
	if (typeof text !== 'string' || text === '') fail(slug, `poll "${id}" needs text`);

	if (type === 'yes-no') return { id, type, text };

	if (type === 'choice') {
		if (
			!Array.isArray(options) ||
			options.length < 2 ||
			!options.every((option): option is string => typeof option === 'string' && option !== '')
		) {
			fail(slug, `poll "${id}" needs at least two options`);
		}
		return { id, type, text, options, multiple: multiple === true };
	}

	fail(slug, `poll "${id}" type must be yes-no or choice`);
}

/**
 * Checks a questionnaire's front matter. A mistake stops the build, rather than breaking the live site.
 */
function parseQuestionnaire(slug: string, meta: unknown): Questionnaire {
	if (!SLUG.test(slug)) fail(slug, 'file name must use lowercase letters, numbers and hyphens');
	if (!isRecord(meta)) fail(slug, 'missing front matter');

	const { title, session, opens, closes, polls } = meta;

	if (typeof title !== 'string' || title === '') fail(slug, 'needs a title');
	if (typeof session !== 'string' || !DATE.test(session)) {
		fail(slug, "session must be a quoted date like '2026-11-24'");
	}

	const times = sessionOn(session);
	if (!times) fail(slug, `${session} is not a session day in sessions.md`);

	// Defaults: open 30 minutes before the session, close 10 minutes before it ends
	const opensAt =
		opens === undefined
			? new Date(times.start.getTime() - 30 * MINUTE)
			: localTime(slug, opens, 'opens');
	const closesAt =
		closes === undefined
			? new Date(times.end.getTime() - 10 * MINUTE)
			: localTime(slug, closes, 'closes');
	if (closesAt <= opensAt) fail(slug, 'must close after it opens');

	if (!Array.isArray(polls) || polls.length === 0) fail(slug, 'needs at least one poll');
	const parsed = polls.map((poll: unknown) => parsePoll(slug, poll));

	return { slug, title, session, opens: opensAt, closes: closesAt, polls: parsed };
}

const metadata = import.meta.glob<unknown>('/src/content/polls/*.md', {
	eager: true,
	query: '?metadata',
	import: 'metadata'
});

export const questionnaires: Questionnaire[] = Object.entries(metadata).map(([path, meta]) =>
	parseQuestionnaire(path.replace('/src/content/polls/', '').replace(/\.md$/, ''), meta)
);

// Poll IDs are slugs in WordPress, so they must be unique across every file
const ids = questionnaires.flatMap((q) => q.polls.map((poll) => poll.id));
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length > 0) {
	throw new Error(`Poll ids must be unique across all poll files: ${duplicates.join(', ')}`);
}

export function status(questionnaire: Questionnaire, now = new Date()): Status {
	if (now < questionnaire.opens) return 'upcoming';
	if (now < questionnaire.closes) return 'open';
	return 'closed';
}
