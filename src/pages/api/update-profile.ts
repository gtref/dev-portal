import type { APIRoute } from 'astro';
import { createClient } from '../../lib/supabase';

export const prerender = true;

export const GET: APIRoute = () =>
	new Response(JSON.stringify({ error: 'Use POST to update a profile.' }), {
		status: 405,
		headers: { 'Content-Type': 'application/json', Allow: 'POST' },
	});

export const POST: APIRoute = async ({ request }) => {
	const authorization = request.headers.get('Authorization');
	const token = authorization?.replace(/^Bearer\s+/i, '');
	if (!token) return new Response('Unauthorized', { status: 401 });

	const client = createClient();
	const { data: { user }, error: authError } = await client.auth.getUser(token);
	if (authError || !user) return new Response('Unauthorized', { status: 401 });

	const body = await request.json();
	const { id: _id, ...fields } = body;
	const { error } = await client.from('profiles').upsert({ ...fields, id: user.id, updated_at: new Date().toISOString() });
	if (error) return Response.json({ error: error.message }, { status: 400 });
	return Response.json({ ok: true });
};