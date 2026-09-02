import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

// GET /api/revalidate?tag=templates
// Purge Next.js cache for a given tag (e.g. after adding a new template in Supabase)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag') || 'templates';

  revalidateTag(tag);

  return NextResponse.json({ revalidated: true, tag, timestamp: new Date().toISOString() });
}
