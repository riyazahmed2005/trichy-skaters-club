import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const achievements = await db.achievement.findMany({
      where: { status: 'APPROVED' },
      orderBy: { eventDate: 'desc' },
    });

    return NextResponse.json({ success: true, achievements });
  } catch (error) {
    console.error('Fetch public achievements error:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}
