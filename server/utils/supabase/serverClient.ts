import { createClient } from '@supabase/supabase-js';
import { createServerClient } from "@supabase/ssr";
import { cookies } from 'next/headers'

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabasePublicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseServerClient = () => createClient(supabaseUrl, supabaseKey);

export const supabaseServerClientWithAuth = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    supabasePublicUrl,
    supabaseAnonKey,
    {
      cookies: {
        async getAll() {
          const store = await cookieStore;
          return store.getAll();
        },
        async setAll(cookiesToSet) {
          try {
            const store = await cookieStore;
            cookiesToSet.forEach(({ name, value, options }) => store.set(name, value, options));
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};