import { put } from '@vercel/blob';
import path from 'path';

export interface UploadResult {
  url: string;
}

export async function uploadFile(
  file: File,
  folder: 'posts' | 'achievements' | 'gallery' | 'events' | 'certificates'
): Promise<UploadResult> {
  // Validate file size
  const maxPhotoSize = 5 * 1024 * 1024;
  const maxCertificateSize = 10 * 1024 * 1024;

  const isCertificate = folder === 'certificates';
  const maxSize = isCertificate ? maxCertificateSize : maxPhotoSize;

  if (file.size > maxSize) {
    throw new Error(`File exceeds maximum allowed size of ${isCertificate ? '10MB' : '5MB'}`);
  }

  // Validate file type
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (isCertificate) {
    allowedMimeTypes.push('application/pdf');
  }

  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type: ${file.type}. Allowed formats: ${allowedMimeTypes
        .map((t) => t.split('/')[1])
        .join(', ')}`
    );
  }

  // Generate unique filename
  const ext = path.extname(file.name) || `.${file.type.split('/')[1]}`;
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

  // Upload to Vercel Blob
  const blob = await put(`trichy-skaters-club/${folder}/${uniqueName}`, file, {
    access: 'public',
  });

  return {
    url: blob.url,
  };
}
