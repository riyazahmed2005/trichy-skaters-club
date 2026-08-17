import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, date, time, location, coverImage } = await request.json();
    const resolvedParams = await params;
    const eventId = resolvedParams.id;

    const data: any = {};
    if (name) {
      data.name = name;
      const cleanName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      data.slug = `${cleanName}-${Math.random().toString(36).substring(2, 7)}`;
    }
    if (description) data.description = description;
    if (date) data.date = new Date(date);
    if (time) data.time = time;
    if (location) data.location = location;
    if (coverImage !== undefined) data.coverImage = coverImage;

    const updatedEvent = await db.event.update({
      where: { id: eventId },
      data,
    });

    return NextResponse.json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const eventId = resolvedParams.id;

    await db.event.delete({
      where: { id: eventId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
