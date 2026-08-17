import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, category, status, images } = await request.json();
    const resolvedParams = await params;
    const postId = resolvedParams.id;

    const data: any = {};
    if (title) data.title = title;
    if (content) data.content = content;
    if (category) data.category = category;
    if (images) data.images = images;
    if (status) {
      if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      data.status = status;
    }

    // Slug generation on title edit
    if (title) {
      const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      data.slug = `${cleanTitle}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const updatedPost = await db.post.update({
      where: { id: postId },
      data,
    });

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('Admin update post error:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const postId = resolvedParams.id;

    await db.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin delete post error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
