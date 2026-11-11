// Replace the existing createMessage in src/lib/utils/api.ts with this.
// Add the import and the MessageError class near the top of the file.
//
// CMS_API stands for the base URL your other functions already use
// (https://cms.carrickdojo.com/json). Use whatever variable api.ts has now.

import { CARRICK_FRONTEND_SECRET, CMS_API_URL } from '$app/env/public';

export class MessageError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

export async function createMessage(
	firstname: string,
	lastname: string,
	email: string,
	phone: string,
	question: string,
	message: string,
	clientIp?: string
) {
	const headers: Record<string, string> = { 'Content-Type': 'application/json' };

	// Lets WordPress rate-limit each visitor instead of treating every request
	// from Vercel as one visitor. WordPress ignores these unless the secret matches.
	if (clientIp && CARRICK_FRONTEND_SECRET) {
		headers['X-Client-IP'] = clientIp;
		headers['X-Frontend-Secret'] = CARRICK_FRONTEND_SECRET;
	}

	const response = await fetch(`${CMS_API_URL}/api/messages`, {
		method: 'POST',
		headers,
		body: JSON.stringify({ firstname, lastname, email, phone, question, message })
	});

	const body = await response.json().catch(() => null);

	if (!response.ok) {
		throw new MessageError(response.status, body?.message ?? 'Could not send the message');
	}

	return body as { id: number; message: boolean; sent: boolean };
}
