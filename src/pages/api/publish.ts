import type { APIRoute } from 'astro';
import { isAuthenticated, json, unauthorized } from '../../lib/auth';
import { CONTENT_DIR, getFile, putFile } from '../../lib/github';
import {
	AUTHORS,
	buildMarkdown,
	DATE_RE,
	SLUG_RE,
	todayISO,
	type Author,
} from '../../lib/posts';

export const prerender = false;

interface PublishBody {
	slug?: unknown;
	title?: unknown;
	description?: unknown;
	pubDate?: unknown;
	author?: unknown;
	heroImage?: unknown;
	content?: unknown;
	isNew?: unknown;
}

function asString(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}

export const POST: APIRoute = async (context) => {
	if (!isAuthenticated(context.cookies)) return unauthorized();

	let body: PublishBody;
	try {
		body = (await context.request.json()) as PublishBody;
	} catch {
		return json({ error: 'Requisição inválida.' }, 400);
	}

	const slug = asString(body.slug);
	const title = asString(body.title);
	const description = asString(body.description);
	const pubDate = asString(body.pubDate);
	const author = asString(body.author);
	const heroImage = asString(body.heroImage);
	const content = asString(body.content);
	const isNew = body.isNew === true;

	if (!SLUG_RE.test(slug)) {
		return json({ error: 'Link (slug) inválido: use apenas letras minúsculas, números e hífens.' }, 400);
	}
	if (!title || title.length > 200) return json({ error: 'Título obrigatório (máx. 200 caracteres).' }, 400);
	if (!description || description.length > 500) {
		return json({ error: 'Resumo obrigatório (máx. 500 caracteres).' }, 400);
	}
	if (!DATE_RE.test(pubDate)) return json({ error: 'Data inválida.' }, 400);
	if (!(AUTHORS as readonly string[]).includes(author)) return json({ error: 'Autor inválido.' }, 400);
	if (heroImage && !heroImage.startsWith('/') && !/^https?:\/\//.test(heroImage)) {
		return json({ error: 'Imagem de capa deve ser uma URL ou caminho iniciado em "/".' }, 400);
	}
	if (!content || content.length > 200_000) {
		return json({ error: 'Conteúdo obrigatório (máx. 200.000 caracteres).' }, 400);
	}

	try {
		const existingMd = await getFile(`${CONTENT_DIR}/${slug}.md`);
		const existingMdx = existingMd ? null : await getFile(`${CONTENT_DIR}/${slug}.mdx`);
		const existing = existingMd ?? existingMdx;

		if (isNew && existing) {
			return json({ error: 'Já existe um post com esse link. Escolha outro ou edite o existente.' }, 409);
		}

		const updating = Boolean(existing);
		const finalPath = existingMd
			? `${CONTENT_DIR}/${slug}.md`
			: existingMdx
				? `${CONTENT_DIR}/${slug}.mdx`
				: `${CONTENT_DIR}/${slug}.md`;

		const markdown = buildMarkdown({
			title,
			description,
			pubDate,
			updatedDate: updating ? todayISO() : undefined,
			heroImage: heroImage || undefined,
			author: author as Author,
			content,
		});

		const message = updating ? `post: atualiza "${title}"` : `post: publica "${title}" (${author})`;
		await putFile(finalPath, markdown, message, updating ? existing?.sha : undefined);

		return json({ ok: true, url: `/blog/${slug}/`, updated: updating });
	} catch (err) {
		return json({ error: err instanceof Error ? err.message : 'Erro ao publicar.' }, 500);
	}
};
