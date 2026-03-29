import { createAdminClient } from './src/lib/supabase/client';
import * as dotenv from 'dotenv';
dotenv.config();

async function test() {
  const admin = createAdminClient();
  
  const tablesToTry = ['plans', 'Plan', 'plan', 'submissions', 'Submission', 'submission'];
  
  for (const table of tablesToTry) {
    const { data, error } = await admin.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table '${table}' failed:`, error.message);
    } else {
      console.log(`Table '${table}' SUCCESS! Data:`, data);
    }
  }
}

test();
