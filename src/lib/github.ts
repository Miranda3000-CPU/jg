import { env } from './env';

const GITHUB_API = 'https://api.github.com';
const OWNER = env('GITHUB_OWNER') || 'Miranda3000-CPU';
const REPO = env('GITHUB_REPO') || 'jg';
const BRANCH = env('GITHUB_BRANCH') || 'master';
export const CONTENT_DIR = 'src/content/blog';

export interface RepoFile {
	name: string;
	path: string;
	sha: string;
}

function headers(): Record<string, string> {
	const token = env('GITHUB_TOKEN');
	if (!token) throw new Error('GITHUB_TOKEN não configurado');
	return {
		Authorization: `Bearer ${token}`,
		Accept: 'application/vnd.github+json',
		'X-GitHub-Api-Version': '2022-11-28',
		'Content-Type': 'application/json',
	};
}

function contentUrl(path: string): string {
	return `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`;
}

export async function listPostFiles(): Promise<RepoFile[]> {
	const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${CONTENT_DIR}?ref=${BRANCH}`, {
		headers: headers(),
	});
	if (!res.ok) throw new Error(`Falha ao listar posts no GitHub (${res.status})`);
	const data: unknown = await res.json();
	if (!Array.isArray(data)) return [];
	return data
		.filter((f): f is { name: string; path: string; sha: string } =>
			typeof f === 'object' && f !== null && /\.(md|mdx)$/.test(String((f as { name?: string }).name)),
		)
		.map((f) => ({ name: f.name, path: f.path, sha: f.sha }));
}

export async function getFile(path: string): Promise<{ content: string; sha: string } | null> {
	const res = await fetch(contentUrl(path), { headers: headers() });
	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`Falha ao ler arquivo no GitHub (${res.status})`);
	const data = (await res.json()) as { content?: string; encoding?: string; sha?: string };
	const content =
		data.encoding === 'base64' && data.content
			? Buffer.from(data.content, 'base64').toString('utf-8')
			: String(data.content ?? '');
	return { content, sha: String(data.sha ?? '') };
}

export async function putFile(
	path: string,
	content: string,
	message: string,
	sha?: string,
): Promise<{ sha: string; htmlUrl?: string }> {
	const body: Record<string, unknown> = {
		message,
		content: Buffer.from(content, 'utf-8').toString('base64'),
		branch: BRANCH,
	};
	if (sha) body.sha = sha;
	const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}`, {
		method: 'PUT',
		headers: headers(),
		body: JSON.stringify(body),
	});
	if (!res.ok) {
		const detail = await res.text();
		throw new Error(`Falha ao salvar no GitHub (${res.status}): ${detail}`);
	}
	const data = (await res.json()) as { content?: { sha?: string; html_url?: string } };
	return { sha: String(data.content?.sha ?? ''), htmlUrl: data.content?.html_url };
}
