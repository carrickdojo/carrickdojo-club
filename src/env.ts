import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	CARRICK_FRONTEND_SECRET: {
		description:
			'Shared secret sent to WordPress so it can trust the visitor IP header. Must match CARRICK_FRONTEND_SECRET in wp-config.php.',
		// Optional for now, so a missing value cannot break the build.
		// Without it the form still works, but WordPress rate-limits by Vercel's IP.
		schema: (value: string | undefined) => value || undefined
	}
});
