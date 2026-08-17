import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const events = await db.event.findMany({
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error('Fetch public events error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
