import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

let adminClient: SupabaseClient | null = null;

export function createAdminClient(): SupabaseClient<Database> {
  if (adminClient) {
    return adminClient as SupabaseClient<Database>;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase URL and service role key are required.');
  }

  adminClient = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}