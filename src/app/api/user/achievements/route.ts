import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const achievements = await db.achievement.findMany({
      where: { submittedById: session.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, achievements });
  } catch (error) {
    console.error('Fetch own achievements error:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      skaterName,
      competitionName,
      position, // GOLD, SILVER, BRONZE, PARTICIPATION
      category,
      eventDate,
      description,
      certificateUrl,
      photoUrl,
    } = await request.json();

    if (!skaterName || !competitionName || !position || !category || !eventDate || !description) {
      return NextResponse.json({ error: 'Missing required achievement fields' }, { status: 400 });
    }

    const allowedPositions = ['GOLD', 'SILVER', 'BRONZE', 'PARTICIPATION'];
    if (!allowedPositions.includes(position.toUpperCase())) {
      return NextResponse.json({ error: 'Invalid position value' }, { status: 400 });
    }

    const newAchievement = await db.achievement.create({
      data: {
        skaterName,
        competitionName,
        position: position.toUpperCase() as any,
        category,
        eventDate: new Date(eventDate),
        description,
        certificateUrl: certificateUrl || null,
        photoUrl: photoUrl || null,
        status: 'PENDING', // Force pending
        submittedById: session.id,
      },
    });

    return NextResponse.json({ success: true, achievement: newAchievement });
  } catch (error) {
    console.error('Create achievement error:', error);
    return NextResponse.json({ error: 'Failed to submit achievement' }, { status: 500 });
  }
}
