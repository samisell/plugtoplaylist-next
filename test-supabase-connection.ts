import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testConnection() {
  console.log('--- Supabase Connection Test ---');
  console.log('URL:', supabaseUrl ? 'Set' : 'MISSING');
  console.log('Anon Key:', supabaseAnonKey ? 'Set' : 'MISSING');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing from .env');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log('\n1. Testing table "Plan" (Prisma style)...');
  const { data: planData, error: planError } = await supabase.from('Plan').select('*').limit(1);
  
  if (planError) {
    console.log('Table "Plan" not found or error:', planError.message);
    
    console.log('\n2. Testing table "plans" (Supabase style)...');
    const { data: plansData, error: plansError } = await supabase.from('plans').select('*').limit(1);
    
    if (plansError) {
      console.error('Table "plans" also failed:', plansError.message);
    } else {
      console.log('✅ Success! Found table "plans".');
      console.log('Sample Data:', plansData);
    }
  } else {
    console.log('✅ Success! Found table "Plan".');
    console.log('Sample Data:', planData);
  }

  console.log('\n3. Testing table "User" (Prisma style)...');
  const { data: userData, error: userError } = await supabase.from('User').select('id, email').limit(1);
  if (userError) {
     console.log('Table "User" failed, trying "users"...');
     const { data: usersData, error: usersError } = await supabase.from('users').select('id, email').limit(1);
     if (usersError) console.error('Table "users" failed.');
     else console.log('✅ Success! Found table "users".');
  } else {
     console.log('✅ Success! Found table "User".');
  }

  console.log('\n--- Test Complete ---');
}

testConnection();
