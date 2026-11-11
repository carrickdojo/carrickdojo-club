import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	CARRICK_FRONTEND_SECRET: {	public: true},
	CMS_API_URL: { 	public: true}
});