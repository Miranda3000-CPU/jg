import type { APIRoute } from 'astro';
import { authenticateUser, createSessionToken, delay, json, sessionCookieOptions, SESSION_COOKIE } from '../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  let username = '';
  let password = '';
  try {
    const body = (await request.json()) as { username?: unknown; password?: unknown };
    username = typeof body.username === 'string' ? body.username : '';
    password = typeof body.password === 'string' ? body.password : '';
  } catch { return json({ error: 'Requisição inválida.' }, 400); }

  if (!username || !password) return json({ error: 'Informe usuário e senha.' }, 400);
  let user;
  try { user = authenticateUser(username, password); }
  catch (error) { return json({ error: error instanceof Error ? error.message : 'Falha na configuração de acesso.' }, 500); }
  if (!user) { await delay(600); return json({ error: 'Usuário ou senha incorretos.' }, 401); }

  cookies.set(SESSION_COOKIE, createSessionToken(user.username), sessionCookieOptions());
  return json({ ok: true, user: { username: user.username, name: user.name } });
};
