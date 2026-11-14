import type { APIRoute } from 'astro';
import { getSessionUser, json, unauthorized } from '../../lib/auth';

export const prerender = false;
export const GET: APIRoute = ({ cookies }) => {
  const user = getSessionUser(cookies);
  if (!user) return unauthorized();
  return json({ user: { username: user.username, name: user.name } });
};
