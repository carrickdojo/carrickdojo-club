import { sections } from '../content/docs/sections';

export interface DocMeta {
	title: string;
	description?: string;
	order?: number;
	level?: 'beginner' | 'intermediate' | 'advanced';
}

// Front matter only. The page content is loaded separately, one page at a time.
const metadata = import.meta.glob<DocMeta>('/src/content/docs/**/*.md', {
	eager: true,
	query: '?metadata',
	import: 'metadata'
});

// e.g. '/src/content/docs/reference/changelog.md' becomes slug 'reference/changelog'
export const docs = Object.entries(metadata)
	.map(([path, meta]) => {
		const slug = path.replace('/src/content/docs/', '').replace(/\.md$/, '');
		return { ...meta, slug, section: slug.split('/')[0] };
	})
	.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

// Sections in the order set in sections.ts, skipping any with no pages yet
export const docsNav = sections
	.map((section) => ({ ...section, pages: docs.filter((doc) => doc.section === section.slug) }))
	.filter((section) => section.pages.length > 0);
