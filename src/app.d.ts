// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		interface Locals {
			token?: string;
		}
	}
	const __BUILD_INFO__: import('$lib/build-info').BuildInfo;
}

export {};
