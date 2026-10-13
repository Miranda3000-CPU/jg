import type { APIRoute } from 'astro';
import { fetchConcursos, UFS, type Uf } from '../../../lib/concursos';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
	const uf = (params.uf ?? '').toLowerCase();

	if (!(UFS as readonly string[]).includes(uf)) {
		return new Response(JSON.stringify({ error: 'UF inválida.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
		});
	}

	try {
		const data = await fetchConcursos(uf as Uf);
		return new Response(JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
			},
		});
	} catch (err) {
		return new Response(
			JSON.stringify({ error: err instanceof Error ? err.message : 'Erro ao consultar concursos.' }),
			{ status: 502, headers: { 'Content-Type': 'application/json; charset=utf-8' } },
		);
	}
};
