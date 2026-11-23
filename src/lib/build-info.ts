export interface BuildInfo {
	built: string;
	commit: string;
	branch: string;
	node: string;
	packages: Record<string, string>;
}

// Vite replaces __BUILD_INFO__ with the real values at build time (see vite.config.ts)
export const buildInfo: BuildInfo = __BUILD_INFO__;
