import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const post = await db.post.findFirst({
      where: {
        slug,
        status: 'APPROVED',
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found or not approved yet' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Fetch post detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch post details' }, { status: 500 });
  }
}
