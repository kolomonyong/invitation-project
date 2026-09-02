import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

// GET /api/revalidate?tag=templates
// Purge Next.js cache by revalidating the relevant paths
export async function GET() {
  // Revalidate the API route that serves templates data
  revalidatePath('/api/templates');
  revalidatePath('/dashboard');

  return NextResponse.json({ revalidated: true, timestamp: new Date().toISOString() });
}
