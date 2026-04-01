import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createClient()

  // Check if we have a session
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    await supabase.auth.signOut()
  }

  return redirect('/login')
}