import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  // Authentication check: Vercel Cron sends a Bearer token if CRON_SECRET is configured
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  // Create a raw supabase client without cookies for background processing
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Perform a lightweight query to trigger database activity and prevent pausing
  const { data, error } = await supabase.from('profiles').select('id').limit(1);
  
  if (error) {
    console.error("Keepalive Cron Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ 
    success: true, 
    message: 'Supabase database activity triggered successfully',
    timestamp: new Date().toISOString() 
  });
}
