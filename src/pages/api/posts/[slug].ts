import type { APIRoute } from 'astro';
import { isAuthenticated, json, unauthorized } from '../../../lib/auth';
import { CONTENT_DIR, getFile } from '../../../lib/github';
import { parseMarkdown, SLUG_RE, toDateInputValue } from '../../../lib/posts';

export const prerender = false;

export const GET: APIRoute = async (context) => {
	if (!isAuthenticated(context.cookies)) return unauthorized();

	const slug = context.params.slug ?? '';
	if (!SLUG_RE.test(slug)) return json({ error: 'Slug inválido.' }, 400);

	try {
		const file =
			(await getFile(`${CONTENT_DIR}/${slug}.md`)) ?? (await getFile(`${CONTENT_DIR}/${slug}.mdx`));
		if (!file) return json({ error: 'Post não encontrado.' }, 404);

		const { frontmatter, body } = parseMarkdown(file.content);
		return json({
			slug,
			title: frontmatter.title ?? '',
			description: frontmatter.description ?? '',
			pubDate: toDateInputValue(frontmatter.pubDate),
			author: frontmatter.author ?? 'Jeiel Miranda',
			heroImage: frontmatter.heroImage ?? '',
			content: body,
		});
	} catch (err) {
		return json({ error: err instanceof Error ? err.message : 'Erro ao abrir o post.' }, 500);
	}
};
