import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export type Profile = {
	id: string;
	name: string | null;
	github: string | null;
	website: string | null;
	blog: string | null;
	bio: string | null;
	languages: string[] | null;
	tools: string[] | null;
	stacks: string[] | null;
	skill_level: string | null;
	updated_at?: string;
};

export const isSupabaseConfigured = Boolean(
	import.meta.env.PUBLIC_SUPABASE_URL && import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
);

export function createClient() {
	const url = import.meta.env.PUBLIC_SUPABASE_URL;
	const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !anonKey) {
		throw new Error('Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY to use Supabase.');
	}
	return createSupabaseClient(url, anonKey);
}