import { fail } from '@sveltejs/kit';
import { createMessage, MessageError } from '#lib/utils/messages.server.ts';
import type { Actions } from './$types';

// Keep these in step with the limits in the WordPress theme (endpoints/messages.php)
const LIMITS = {
	firstname: 100,
	lastname: 100,
	email: 254,
	phone: 50,
	question: 200,
	message: 5000
} as const;

type Field = keyof typeof LIMITS;
const FIELDS = Object.keys(LIMITS) as Field[];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

// One shape for every failure, so the page can rely on it
function failWith(status: number, values: Values, errors: Errors = {}, formError?: string) {
	return fail(status, { values, errors, formError });
}

export const actions = {
	default: async ({ request, getClientAddress }) => {
		const data = await request.formData();

		// Honeypot: real visitors never see or fill this field. Pretend it worked.
		if (data.get('website')) {
			return { success: true };
		}

		// Trim every value. A File or a missing field becomes an empty string.
		const values = {} as Values;
		for (const field of FIELDS) {
			const value = data.get(field);
			values[field] = typeof value === 'string' ? value.trim() : '';
		}

		// Validate
		const errors: Errors = {};
		for (const field of FIELDS) {
			if (!values[field]) {
				errors[field] = 'This field is required';
			} else if (values[field].length > LIMITS[field]) {
				errors[field] = `Please keep this under ${LIMITS[field]} characters`;
			}
		}
		if (!errors.email && !EMAIL_PATTERN.test(values.email)) {
			errors.email = 'Please enter a valid email address';
		}
		if (Object.keys(errors).length > 0) {
			return failWith(400, values, errors);
		}

		// Send to WordPress. Never log the form values: they are personal data.
		try {
			await createMessage(
				values.firstname,
				values.lastname,
				values.email,
				values.phone,
				values.question,
				values.message,
				getClientAddress()
			);
		} catch (error) {
			if (error instanceof MessageError && error.status === 429) {
				return failWith(429, values, {}, 'Please wait a minute before sending another message.');
			}
			if (error instanceof MessageError && error.status === 400) {
				return failWith(400, values, {}, error.message);
			}
			console.error(
				'Sending message failed:',
				error instanceof Error ? error.message : 'unknown error'
			);
			return failWith(
				500,
				values,
				{},
				'Sorry, something went wrong and your message was not sent. Please try again later.'
			);
		}

		return { success: true };
	}
} satisfies Actions;
