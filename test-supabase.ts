import { createAdminClient } from './src/lib/supabase/admin';
import * as dotenv from 'dotenv';
dotenv.config();

async function test() {
  const admin = createAdminClient();
  const { data, error } = await admin.from('plans').select('*');
  if (error) {
    console.error('Error with plans:', error);
  } else {
    console.log('Successfully found plans:', data);
  }
}

test();