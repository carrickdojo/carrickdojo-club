export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * '2026-11-24 19:00' in Irish time becomes an exact moment, allowing for summer time.
 */
export function dublinTime(local: string): Date {
	const asUtc = new Date(`${local.replace(' ', 'T')}:00Z`);
	const offset = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'Europe/Dublin',
		timeZoneName: 'longOffset'
	})
		.formatToParts(asUtc)
		.find((part) => part.type === 'timeZoneName')?.value; // 'GMT' or 'GMT+01:00'

	const match = offset?.match(/([+-])(\d{2}):(\d{2})/);
	const minutes = match
		? (match[1] === '-' ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3]))
		: 0;

	return new Date(asUtc.getTime() - minutes * 60_000);
}

/**
 * Today's date in Ireland, e.g. '2026-11-24'.
 */
export function todayInDublin(): string {
	return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Dublin' }).format(new Date());
}
