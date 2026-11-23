import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	CMS_URL: {
		description: 'Base URL of the WordPress JSON API, without a trailing slash.',
		// Defaults to the live CMS, so local dev and Vercel work without setting it
		schema: (value: string | undefined) =>
			(value || 'https://cms.carrickdojo.com/json').replace(/\/$/, '')
	},
	DOJO_POLLING_SECRET: {
		description: 'Polling secret. Must match the one set on the Polls page in WordPress.',
		// Optional, so a missing value can't break the build. Sign-in refuses to run without it.
		schema: (value: string | undefined) => value || undefined
	}
});
