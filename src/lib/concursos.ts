const BASE = 'https://concursosnobrasil.com';

export const UFS = [
	'nacional',
	'ac', 'al', 'am', 'ap', 'ba', 'ce', 'df', 'es', 'go', 'ma', 'mg', 'ms', 'mt',
	'pa', 'pb', 'pe', 'pi', 'pr', 'rj', 'rn', 'ro', 'rr', 'rs', 'sc', 'se', 'sp', 'to',
] as const;

export type Uf = (typeof UFS)[number];

export const UF_NAMES: Record<string, string> = {
	nacional: 'Nacional',
	ac: 'Acre', al: 'Alagoas', am: 'Amazonas', ap: 'Amapá', ba: 'Bahia',
	ce: 'Ceará', df: 'Distrito Federal', es: 'Espírito Santo', go: 'Goiás',
	ma: 'Maranhão', mg: 'Minas Gerais', ms: 'Mato Grosso do Sul', mt: 'Mato Grosso',
	pa: 'Pará', pb: 'Paraíba', pe: 'Pernambuco', pi: 'Piauí', pr: 'Paraná',
	rj: 'Rio de Janeiro', rn: 'Rio Grande do Norte', ro: 'Rondônia', rr: 'Roraima',
	rs: 'Rio Grande do Sul', sc: 'Santa Catarina', se: 'Sergipe', sp: 'São Paulo',
	to: 'Tocantins',
};

export interface Concurso {
	orgao: string;
	titulo: string;
	url: string;
	vagas: string;
}

export interface ResultadoConcursos {
	uf: Uf;
	titulo: string;
	subtitulo: string;
	atualizado: string | null;
	total: number;
	fonte: string;
	concursos: Concurso[];
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora
const cache = new Map<string, { ts: number; data: ResultadoConcursos }>();

function decodeEntities(text: string): string {
	return text
		.replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
		.replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(parseInt(n, 16)))
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#0?39;|&apos;/g, "'")
		.replace(/&hellip;/g, '…')
		.replace(/&mdash;/g, '—');
}

function stripTags(html: string): string {
	return decodeEntities(html.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
}

function firstMatch(html: string, re: RegExp): string | null {
	const m = html.match(re);
	return m ? stripTags(m[1]) : null;
}

const ROW_RE =
	/<tr[^>]*>\s*<td[^>]*>\s*<a\s+([^>]+)>([\s\S]*?)<\/a>\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/g;

function parseRows(sectionHtml: string): Concurso[] {
	const concursos: Concurso[] = [];
	for (const m of sectionHtml.matchAll(ROW_RE)) {
		const attrs = m[1];
		const href = attrs.match(/href="([^"]+)"/)?.[1];
		if (!href) continue;
		const titulo = attrs.match(/title="([^"]*)"/)?.[1] ?? '';
		const orgao = stripTags(m[2]);
		const vagas = stripTags(m[3]);
		if (!orgao) continue;
		concursos.push({
			orgao,
			titulo: decodeEntities(titulo) || orgao,
			url: href,
			vagas: vagas || '—',
		});
	}
	return concursos;
}

async function fetchHtml(url: string): Promise<string> {
	const res = await fetch(url, {
		headers: {
			'User-Agent':
				'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
			Accept: 'text/html,application/xhtml+xml',
		},
		signal: AbortSignal.timeout(20_000),
	});
	if (!res.ok) throw new Error(`Origem respondeu ${res.status}`);
	return res.text();
}

export async function fetchConcursos(uf: Uf): Promise<ResultadoConcursos> {
	const cached = cache.get(uf);
	if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.data;

	const fonte = uf === 'nacional' ? `${BASE}/concursos/` : `${BASE}/concursos/${uf}`;
	const html = await fetchHtml(fonte);

	let section = html;
	if (uf === 'nacional') {
		const start = html.indexOf('<div id="nacional">');
		const end = html.indexOf('<div id="centro-oeste">');
		if (start === -1) throw new Error('Seção nacional não encontrada na origem');
		section = html.slice(start, end === -1 ? undefined : end);
	}

	const concursos = parseRows(section);
	const data: ResultadoConcursos = {
		uf,
		titulo: firstMatch(section, /<h1[^>]*>([\s\S]*?)<\/h1>/) ?? `Concursos ${UF_NAMES[uf] ?? uf.toUpperCase()}`,
		subtitulo: firstMatch(section, /<h2[^>]*>([\s\S]*?)<\/h2>/) ?? '',
		atualizado: new Date().toISOString(),
		total: concursos.length,
		fonte,
		concursos,
	};

	cache.set(uf, { ts: Date.now(), data });
	return data;
}
