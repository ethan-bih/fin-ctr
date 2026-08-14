import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes('your-supabase-url') ||
    supabaseUrl.includes('your-supabase-project-id')
  ) {
    return null;
  }

  const normalizedSupabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '');

  return createBrowserClient(normalizedSupabaseUrl, supabaseAnonKey);
}
