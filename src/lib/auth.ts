import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from './env';

export const SESSION_COOKIE = 'cms_auth';
const MAX_AGE = 60 * 60 * 24 * 7;

export interface CmsUser { username: string; name: string; password: string; }

function secret(): string {
  const value = env('CMS_SECRET');
  if (!value) throw new Error('CMS_SECRET não configurado');
  return value;
}

function users(): CmsUser[] {
  const raw = env('CMS_USERS_JSON');
  if (!raw) throw new Error('CMS_USERS_JSON não configurado. Cadastre as contas individuais do CMS.');
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw new Error('CMS_USERS_JSON precisa conter um JSON válido.'); }
  if (!Array.isArray(parsed)) throw new Error('CMS_USERS_JSON deve ser uma lista de usuários.');
  return parsed.filter((item): item is CmsUser =>
    typeof item === 'object' && item !== null &&
    typeof (item as CmsUser).username === 'string' &&
    typeof (item as CmsUser).name === 'string' &&
    typeof (item as CmsUser).password === 'string' &&
    (item as CmsUser).username.length > 0 &&
    (item as CmsUser).password.length >= 12
  );
}

function sign(username: string, exp: number): string {
  return createHmac('sha256', secret()).update(`cms.${username}.${exp}`).digest('hex');
}

export function authenticateUser(username: string, password: string): CmsUser | null {
  const user = users().find((entry) => entry.username.toLowerCase() === username.trim().toLowerCase());
  if (!user) return null;
  const a = Buffer.from(password);
  const b = Buffer.from(user.password);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return user;
}

export function createSessionToken(username: string): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  return `${username}.${exp}.${sign(username, exp)}`;
}

export function getSessionUser(cookies: CookieReader): CmsUser | null {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [username, expStr, signature] = token.split('.');
  if (!username || !expStr || !signature) return null;
  const exp = Number(expStr);
  if (!Number.isSafeInteger(exp) || exp * 1000 <= Date.now()) return null;
  const expected = Buffer.from(sign(username, exp));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  return users().find((entry) => entry.username === username) ?? null;
}

interface CookieReader { get(name: string): { value?: string } | undefined; }

export function isAuthenticated(cookies: CookieReader): boolean {
  return getSessionUser(cookies) !== null;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: env('NODE_ENV') === 'production',
    path: '/',
    maxAge: MAX_AGE,
  };
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export function unauthorized(): Response { return json({ error: 'Sessão expirada. Entre novamente.' }, 401); }
export function delay(ms: number): Promise<void> { return new Promise((resolve) => setTimeout(resolve, ms)); }
