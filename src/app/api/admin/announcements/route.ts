import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const announcements = await db.announcement.findMany({
      orderBy: [{ isPin: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, announcements });
  } catch (error) {
    console.error('Fetch announcements error:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, isPin } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required announcement fields' }, { status: 400 });
    }

    const newAnnouncement = await db.announcement.create({
      data: {
        title,
        content,
        isPin: !!isPin,
      },
    });

    return NextResponse.json({ success: true, announcement: newAnnouncement });
  } catch (error) {
    console.error('Create announcement error:', error);
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}
