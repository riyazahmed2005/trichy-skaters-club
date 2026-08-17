import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const images = await db.galleryImage.findMany({
      include: {
        uploadedBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error('Fetch gallery error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url, caption, category } = await request.json();

    if (!url || !caption || !category) {
      return NextResponse.json({ error: 'Missing required gallery fields' }, { status: 400 });
    }

    const allowedCategories = ['Training', 'Competition', 'Events', 'Winners', 'Celebrations', 'Other'];
    if (!allowedCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const newImage = await db.galleryImage.create({
      data: {
        url,
        caption,
        category,
        uploadedById: session.id,
      },
    });

    return NextResponse.json({ success: true, image: newImage });
  } catch (error) {
    console.error('Create gallery image error:', error);
    return NextResponse.json({ error: 'Failed to add gallery image' }, { status: 500 });
  }
}
