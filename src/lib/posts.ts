export const AUTHORS = [
	'Jeiel Miranda',
	'Giovanna Miranda',
	'Jeiel Miranda & Giovanna Miranda',
] as const;

export type Author = (typeof AUTHORS)[number];

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function slugify(title: string): string {
	return title
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);
}

export function todayISO(): string {
	const d = new Date();
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export interface PostFields {
	title: string;
	description: string;
	pubDate: string;
	updatedDate?: string;
	heroImage?: string;
	author: Author;
	content: string;
}

export function buildMarkdown(fields: PostFields): string {
	const lines = [
		'---',
		`title: ${JSON.stringify(fields.title)}`,
		`description: ${JSON.stringify(fields.description)}`,
		`pubDate: '${fields.pubDate}'`,
	];
	if (fields.updatedDate) lines.push(`updatedDate: '${fields.updatedDate}'`);
	if (fields.heroImage) lines.push(`heroImage: ${JSON.stringify(fields.heroImage)}`);
	lines.push(`author: ${JSON.stringify(fields.author)}`, '---', '', fields.content.trim(), '');
	return lines.join('\n');
}

export function parseMarkdown(raw: string): { frontmatter: Record<string, string>; body: string } {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) return { frontmatter: {}, body: raw.trim() };
	const frontmatter: Record<string, string> = {};
	for (const line of match[1].split(/\r?\n/)) {
		const kv = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
		if (!kv) continue;
		let value = kv[2].trim();
		if (
			(value.startsWith("'") && value.endsWith("'")) ||
			(value.startsWith('"') && value.endsWith('"'))
		) {
			value = value.slice(1, -1);
		}
		frontmatter[kv[1]] = value;
	}
	return { frontmatter, body: match[2].trim() };
}

export function toDateInputValue(value: string | undefined): string {
	if (!value) return '';
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return '';
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
