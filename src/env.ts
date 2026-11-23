import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	CMS_URL: {
		description: 'Base URL of the WordPress JSON API, without a trailing slash.',
		// Defaults to the live CMS, so local dev and Vercel work without setting it
		schema: (value: string | undefined) =>
			(value || 'https://cms.carrickdojo.com/json').replace(/\/$/, '')
	}
});
