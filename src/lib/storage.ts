import { promises as fs } from 'fs';
import path from 'path';

export interface UploadResult {
  url: string;
}

export async function uploadFile(
  file: File,
  folder: 'posts' | 'achievements' | 'gallery' | 'events' | 'certificates'
): Promise<UploadResult> {
  // Validate File size
  // Photos: < 5MB, Certificates: < 10MB
  const maxPhotoSize = 5 * 1024 * 1024;
  const maxCertificateSize = 10 * 1024 * 1024;
  
  const isCertificate = folder === 'certificates';
  const maxSize = isCertificate ? maxCertificateSize : maxPhotoSize;

  if (file.size > maxSize) {
    throw new Error(`File exceeds maximum allowed size of ${isCertificate ? '10MB' : '5MB'}`);
  }

  // Validate File type
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (isCertificate) {
    allowedMimeTypes.push('application/pdf');
  }

  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}. Allowed formats: ${allowedMimeTypes.map(t => t.split('/')[1]).join(', ')}`);
  }

  // Local development storage fallback
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const ext = path.extname(file.name) || (file.type.includes('/') ? `.${file.type.split('/')[1]}` : '');
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

  // Destination folder inside public/uploads
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
  
  // Ensure directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, uniqueName);
  await fs.writeFile(filePath, buffer);

  // Return the public URL path
  return {
    url: `/uploads/${folder}/${uniqueName}`,
  };
}
