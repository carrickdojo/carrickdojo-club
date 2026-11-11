import { CARRICK_FRONTEND_SECRET } from '$app/env/private';
const CMS_API = 'https://cms.carrickdojo.com/json';

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

	const response = await fetch(`${CMS_API}/api/messages`, {
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
