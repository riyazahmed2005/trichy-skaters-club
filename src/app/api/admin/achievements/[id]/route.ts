import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      skaterName,
      competitionName,
      position,
      category,
      eventDate,
      description,
      status,
    } = await request.json();
    const resolvedParams = await params;
    const achievementId = resolvedParams.id;

    const data: any = {};
    if (skaterName) data.skaterName = skaterName;
    if (competitionName) data.competitionName = competitionName;
    if (position) data.position = position.toUpperCase();
    if (category) data.category = category;
    if (eventDate) data.eventDate = new Date(eventDate);
    if (description) data.description = description;
    if (status) {
      if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      data.status = status;
    }

    const updatedAchievement = await db.achievement.update({
      where: { id: achievementId },
      data,
    });

    return NextResponse.json({ success: true, achievement: updatedAchievement });
  } catch (error) {
    console.error('Admin update achievement error:', error);
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const achievementId = resolvedParams.id;

    await db.achievement.delete({
      where: { id: achievementId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin delete achievement error:', error);
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
  }
}
