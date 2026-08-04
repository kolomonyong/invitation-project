// src/lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createServerClient = async () => {
  const cookieStore = await cookies();
  return createServerComponentClient({
    cookies: () => cookieStore as any,
  });
};