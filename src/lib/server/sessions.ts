import { dev } from '$app/env';
import { dublinTime, isRecord, todayInDublin } from '#lib/server/helpers.ts';

export interface Session {
	id: string; // the date, e.g. '2026-11-24'
	start: Date;
	end: Date;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME = /^\d{2}:\d{2}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function fail(message: string): never {
	throw new Error(`sessions.md: ${message}`);
}

/**
 * Checks sessions.md. A mistake stops the build, rather than breaking the live site.
 */
function parseSchedule(meta: unknown) {
	if (!isRecord(meta)) fail('missing front matter');

	const { day, start, end, breaks } = meta;

	const dayIndex = DAYS.findIndex((name) => name === day);
	if (dayIndex === -1) fail('day must be a day name, e.g. Tuesday');
	if (typeof start !== 'string' || !TIME.test(start)) fail("start must be quoted, e.g. '19:00'");
	if (typeof end !== 'string' || !TIME.test(end)) fail("end must be quoted, e.g. '20:00'");
	if (end <= start) fail('end must be after start');
	if (!Array.isArray(breaks)) fail('breaks must be a list');

	const parsed = breaks.map((item: unknown) => {
		if (!isRecord(item)) fail('each break needs a name, from and to');
		const { name, from, to } = item;
		if (
			typeof name !== 'string' ||
			typeof from !== 'string' ||
			typeof to !== 'string' ||
			!DATE.test(from) ||
			!DATE.test(to) ||
			to < from
		) {
			fail(`break "${String(name)}" needs a name and quoted from/to dates`);
		}
		return { name, from, to };
	});

	return { day: dayIndex, start, end, breaks: parsed };
}

const metadata = import.meta.glob<unknown>('/src/content/sessions.md', {
	eager: true,
	query: '?metadata',
	import: 'metadata'
});

const schedule = parseSchedule(Object.values(metadata)[0]);

/**
 * The session on a date, or null if there isn't one (wrong day, or during a break).
 * Local development only: every date is a full-day session, so the team can test at home.
 * `dev` is always false in a production build.
 */
export function sessionOn(date: string): Session | null {
	if (dev) {
		return { id: date, start: dublinTime(`${date} 00:00`), end: dublinTime(`${date} 23:59`) };
	}
	if (new Date(`${date}T12:00:00Z`).getUTCDay() !== schedule.day) return null;
	if (schedule.breaks.some((b) => b.from <= date && date <= b.to)) return null;

	return {
		id: date,
		start: dublinTime(`${date} ${schedule.start}`),
		end: dublinTime(`${date} ${schedule.end}`)
	};
}

export function todaysSession(): Session | null {
	return sessionOn(todayInDublin());
}
