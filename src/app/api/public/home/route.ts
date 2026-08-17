import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [
      latestPosts,
      featuredAchievements,
      upcomingEvents,
      pinnedAnnouncements,
      counts,
    ] = await Promise.all([
      db.post.findMany({
        where: { status: 'APPROVED' },
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      db.achievement.findMany({
        where: { status: 'APPROVED' },
        orderBy: { eventDate: 'desc' },
        take: 4,
      }),
      db.event.findMany({
        where: { date: { gte: new Date() } },
        orderBy: { date: 'asc' },
        take: 3,
      }),
      db.announcement.findMany({
        where: { isPin: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      Promise.all([
        db.user.count(),
        db.post.count({ where: { status: 'APPROVED' } }),
        db.achievement.count({ where: { status: 'APPROVED' } }),
        db.event.count(),
      ]),
    ]);

    return NextResponse.json({
      success: true,
      latestPosts,
      featuredAchievements,
      upcomingEvents,
      pinnedAnnouncements,
      stats: {
        skatersCount: counts[0] + 25, // offset for visual premium touch
        approvedPosts: counts[1],
        approvedAchievements: counts[2],
        totalEvents: counts[3],
      },
    });
  } catch (error) {
    console.error('Fetch public home data error:', error);
    return NextResponse.json({ error: 'Failed to fetch homepage data' }, { status: 500 });
  }
}
