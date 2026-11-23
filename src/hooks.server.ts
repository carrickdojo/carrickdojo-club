import type { Handle } from '@sveltejs/kit/hooks';
import { SIGNIN_COOKIE, cookieOptions } from '#lib/server/signin.ts';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(SIGNIN_COOKIE);
	event.locals.token = token;

	// Each visit restarts the 10-minute idle timer
	if (token) event.cookies.set(SIGNIN_COOKIE, token, cookieOptions());

	const response = await resolve(event);

	// Never cache anything personal: a cached page could show one child's sign-in to another
	const path = event.url.pathname;
	if (token || path.startsWith('/polls') || path.startsWith('/signin')) {
		response.headers.set('Cache-Control', 'private, no-store');
	}

	return response;
};
