import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from './env';

export const SESSION_COOKIE = 'cms_auth';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

function secret(): string {
	const s = env('CMS_SECRET');
	if (!s) throw new Error('CMS_SECRET não configurado');
	return s;
}

function sign(exp: number): string {
	return createHmac('sha256', secret()).update(`cms.${exp}`).digest('hex');
}

export function createSessionToken(): string {
	const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
	return `${exp}.${sign(exp)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
	if (!token) return false;
	const [expStr, sig] = token.split('.');
	if (!expStr || !sig) return false;
	const exp = Number(expStr);
	if (!Number.isFinite(exp) || exp * 1000 <= Date.now()) return false;
	const expected = Buffer.from(sign(exp));
	const received = Buffer.from(sig);
	if (expected.length !== received.length) return false;
	return timingSafeEqual(expected, received);
}

export function verifyPassword(input: string): boolean {
	const expected = env('CMS_PASSWORD');
	if (!expected) return false;
	const a = Buffer.from(input);
	const b = Buffer.from(expected);
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}

interface CookieReader {
	get(name: string): { value?: string } | undefined;
}

export function isAuthenticated(cookies: CookieReader): boolean {
	return verifySessionToken(cookies.get(SESSION_COOKIE)?.value);
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
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
}

export function unauthorized(): Response {
	return json({ error: 'Não autenticado.' }, 401);
}

export function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
