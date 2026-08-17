import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = await db.post.findMany({
      where: { authorId: session.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Fetch own posts error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, category, images } = await request.json();

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Title, content, and category are required' }, { status: 400 });
    }

    const allowedCategories = ['Training', 'Competition', 'Event', 'Club News', 'Other'];
    if (!allowedCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Slug creation for SEO friendly route params
    const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const rand = Math.random().toString(36).substring(2, 7);
    const slug = `${cleanTitle}-${rand}`;

    const newPost = await db.post.create({
      data: {
        title,
        slug,
        content,
        category,
        images: JSON.stringify(images || []),
        status: 'PENDING', // Force pending review
        authorId: session.id,
      },
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
