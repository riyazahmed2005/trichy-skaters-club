import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { uploadFile } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as any;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const validFolders = ['posts', 'achievements', 'gallery', 'events', 'certificates'];
    if (!folder || !validFolders.includes(folder)) {
      return NextResponse.json({ error: 'Invalid upload destination folder' }, { status: 400 });
    }

    const result = await uploadFile(file, folder);
    return NextResponse.json({ success: true, url: result.url });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 });
  }
}
