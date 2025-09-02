
import { createBrowserClient } from "@supabase/ssr";
import { createClient as createServerClient } from "@supabase/supabase-js";
import { env } from '../../../src/config/env';

const supabaseUrl = typeof window !== "undefined"
  ? env.supabase.url
  : env.supabase.url;
const supabaseKey = typeof window !== "undefined"
  ? env.supabase.anonKey
  : env.supabase.serviceRoleKey || env.supabase.anonKey;

export const createClient = () =>
  typeof window !== "undefined"
    ? createBrowserClient(supabaseUrl, supabaseKey)
    : createServerClient(supabaseUrl, supabaseKey);
