import { createClient } from '@supabase/supabase-js';
import { createServerClient } from "@supabase/ssr";
import { cookies } from 'next/headers'
import { env } from '../../../src/config/env';

// Use environment configuration with fallbacks
const supabaseUrl = env.supabase.url;
const supabaseKey = env.supabase.serviceRoleKey || env.supabase.anonKey;
const supabasePublicUrl = env.supabase.url;
const supabaseAnonKey = env.supabase.anonKey;

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