import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalUsers,
      totalPosts,
      pendingPosts,
      approvedPosts,
      totalAchievements,
      pendingAchievements,
      totalGalleryImages,
      upcomingEvents,
    ] = await Promise.all([
      db.user.count(),
      db.post.count(),
      db.post.count({ where: { status: 'PENDING' } }),
      db.post.count({ where: { status: 'APPROVED' } }),
      db.achievement.count(),
      db.achievement.count({ where: { status: 'PENDING' } }),
      db.galleryImage.count(),
      db.event.count({ where: { date: { gte: new Date() } } }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalPosts,
        pendingPosts,
        approvedPosts,
        totalAchievements,
        pendingAchievements,
        totalGalleryImages,
        upcomingEvents,
      },
    });
  } catch (error) {
    console.error('Fetch admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
