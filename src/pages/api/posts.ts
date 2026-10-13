import type { APIRoute } from 'astro';
import { isAuthenticated, json, unauthorized } from '../../lib/auth';
import { getFile, listPostFiles } from '../../lib/github';
import { parseMarkdown } from '../../lib/posts';

export const prerender = false;

export const GET: APIRoute = async (context) => {
	if (!isAuthenticated(context.cookies)) return unauthorized();

	try {
		const files = await listPostFiles();
		const posts = await Promise.all(
			files.map(async (file) => {
				const loaded = await getFile(file.path);
				const { frontmatter } = parseMarkdown(loaded?.content ?? '');
				return {
					slug: file.name.replace(/\.(md|mdx)$/, ''),
					title: frontmatter.title ?? file.name,
					description: frontmatter.description ?? '',
					pubDate: frontmatter.pubDate ?? '',
					author: frontmatter.author ?? 'Jeiel Miranda',
				};
			}),
		);
		posts.sort((a, b) => (a.pubDate < b.pubDate ? 1 : -1));
		return json({ posts });
	} catch (err) {
		return json({ error: err instanceof Error ? err.message : 'Erro ao listar posts.' }, 500);
	}
};
