import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const events = await db.event.findMany({
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error('Fetch events error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, date, time, location, coverImage } = await request.json();

    if (!name || !description || !date || !time || !location) {
      return NextResponse.json({ error: 'Missing required event fields' }, { status: 400 });
    }

    // Slug generation
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${cleanName}-${Math.random().toString(36).substring(2, 7)}`;

    const newEvent = await db.event.create({
      data: {
        name,
        slug,
        description,
        date: new Date(date),
        time,
        location,
        coverImage: coverImage || null,
      },
    });

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
