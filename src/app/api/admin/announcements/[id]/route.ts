import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, isPin } = await request.json();
    const resolvedParams = await params;
    const annId = resolvedParams.id;

    const data: any = {};
    if (title) data.title = title;
    if (content) data.content = content;
    if (isPin !== undefined) data.isPin = !!isPin;

    const updatedAnnouncement = await db.announcement.update({
      where: { id: annId },
      data,
    });

    return NextResponse.json({ success: true, announcement: updatedAnnouncement });
  } catch (error) {
    console.error('Update announcement error:', error);
    return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const annId = resolvedParams.id;

    await db.announcement.delete({
      where: { id: annId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete announcement error:', error);
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
  }
}
