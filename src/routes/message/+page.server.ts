import { createMessage } from '#lib/utils/api.ts';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const firstname = data.get('firstname');
		const lastname = data.get('lastname');
		const email = data.get('email');
		const phone = data.get('phone');
		const question = data.get('question');
		const message = data.get('message');

		if (!firstname || !lastname || !email || !phone || !question || !message) {
			return fail(400, {
				firstname,
				lastname,
				email,
				phone,
				question,
				message,
				missing: true
			});
		}

		console.log(data);

		await createMessage(firstname, lastname, email, phone, question, message);
		// console.log('Form sent');
		return { success: true };
	}
} satisfies Actions;
