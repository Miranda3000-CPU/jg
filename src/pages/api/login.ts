import type { APIRoute } from 'astro';
import {
	createSessionToken,
	delay,
	json,
	sessionCookieOptions,
	verifyPassword,
	SESSION_COOKIE,
} from '../../lib/auth';
import { env } from '../../lib/env';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
	let password = '';
	try {
		const body = (await request.json()) as { password?: unknown };
		password = typeof body.password === 'string' ? body.password : '';
	} catch {
		return json({ error: 'Requisição inválida.' }, 400);
	}

	if (!env('CMS_PASSWORD')) {
		return json({ error: 'Servidor sem CMS_PASSWORD configurado.' }, 500);
	}

	if (!password || !verifyPassword(password)) {
		await delay(600);
		return json({ error: 'Senha incorreta.' }, 401);
	}

	cookies.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions());
	return json({ ok: true });
};
