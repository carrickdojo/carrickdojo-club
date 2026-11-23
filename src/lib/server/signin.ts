import { dev } from '$app/env';

export const SIGNIN_COOKIE = 'dojo_signin';

// Club laptops are shared: sign out automatically after 10 minutes without using the site
export const IDLE_SECONDS = 10 * 60;

export const cookieOptions = () => ({
	path: '/',
	httpOnly: true, // page scripts can't read it
	secure: !dev, // HTTPS only (except local development)
	sameSite: 'lax' as const,
	maxAge: IDLE_SECONDS
});
