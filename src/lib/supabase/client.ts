import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Lazy-loaded client instance
let supabaseInstance: SupabaseClient<Database> | null = null;

// Public client (uses anon key)
export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url === "undefined" || anonKey === "undefined") {
    // Return a dummy client during build to prevent crashes
    return createClient<Database>("https://placeholder-url.supabase.co", "placeholder-key");
  }

  supabaseInstance = createClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return supabaseInstance;
};

// Export the instance as 'supabase' but using a Proxy to keep it lazy
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get: (target, prop, receiver) => {
    return Reflect.get(getSupabase(), prop, receiver);
  },
});

// Server-side Supabase client with service role (full permissions)
export const createServerClient = () => {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey || url === "undefined" || serviceRoleKey === "undefined") {
     // Return a dummy client during build to prevent crashes
     return createClient<Database>("https://placeholder-url.supabase.co", "placeholder-key");
  }

  return createClient<Database>(
    url,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};

// Admin client helper
export const createAdminClient = () => createServerClient();

export default supabase;
