import { NextResponse } from 'next/server';
import { getCachedTemplates } from '@/lib/cache';

export async function GET() {
  try {
    const templates = await getCachedTemplates();
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error in /api/templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}
