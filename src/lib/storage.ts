import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
      `Invalid file type: ${file.type}. Allowed formats: ${allowedMimeTypes.map((t) => t.split('/')[1]).join(', ')}`
    );
  }

  // Convert file to base64 data URI for Cloudinary upload
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString('base64');
  const dataUri = `data:${file.type};base64,${base64}`;

  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `trichy-skaters-club/${folder}`,
    resource_type: isCertificate ? 'auto' : 'image',
  });

  return {
    url: result.secure_url,
  };
}
