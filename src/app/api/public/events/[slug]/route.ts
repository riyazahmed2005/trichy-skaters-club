import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const event = await db.event.findUnique({
      where: { slug },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Fetch event detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch event details' }, { status: 500 });
  }
}
