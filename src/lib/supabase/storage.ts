import { supabase } from './client';

// Storage bucket names
export const STORAGE_BUCKETS = {
  MEDIA: 'media',
  AVATARS: 'avatars',
  TRACKS: 'tracks',
  DOCUMENTS: 'documents',
} as const;

// File upload helper
export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Blob,
  options?: {
    cacheControl?: string;
    contentType?: string;
    upsert?: boolean;
  }
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: options?.cacheControl || '3600',
      contentType: options?.contentType,
      upsert: options?.upsert || false,
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

  return {
    path: data.path,
    publicUrl: urlData.publicUrl,
  };
}

// Delete file helper
export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw error;
  }

  return true;
}

// List files helper
export async function listFiles(
  bucket: string,
  path?: string,
  options?: {
    limit?: number;
    offset?: number;
    sortBy?: { column: string; order: 'asc' | 'desc' };
  }
) {
  const { data, error } = await supabase.storage.from(bucket).list(path || '', {
    limit: options?.limit || 100,
    offset: options?.offset || 0,
    sortBy: options?.sortBy || { column: 'created_at', order: 'desc' },
  });

  if (error) {
    throw error;
  }

  return data;
}

// Get public URL
export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// Create signed URL (for private files)
export async function createSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}

// File validation helpers
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/aac',
];

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function validateFileType(
  file: File,
  allowedTypes: string[]
): boolean {
  return allowedTypes.includes(file.type);
}

export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Image upload with resize (client-side)
export async function uploadAvatar(
  userId: string,
  file: File,
  maxSizeKB: number = 500
): Promise<string> {
  // Validate file type
  if (!validateFileType(file, ALLOWED_IMAGE_TYPES)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.');
  }

  // Validate file size (default 5MB for images before resize)
  if (!validateFileSize(file, 5)) {
    throw new Error('File too large. Maximum size is 5MB.');
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

  // Upload file
  const result = await uploadFile(STORAGE_BUCKETS.AVATARS, fileName, file, {
    upsert: true,
  });

  return result.publicUrl;
}

// Track file upload
export async function uploadTrackFile(
  userId: string,
  file: File
): Promise<{ path: string; publicUrl: string }> {
  // Validate file type
  if (!validateFileType(file, ALLOWED_AUDIO_TYPES)) {
    throw new Error('Invalid file type. Please upload an MP3, WAV, OGG, or AAC file.');
  }

  // Validate file size (50MB for audio)
  if (!validateFileSize(file, 50)) {
    throw new Error('File too large. Maximum size is 50MB.');
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/tracks/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  // Upload file
  const result = await uploadFile(STORAGE_BUCKETS.TRACKS, fileName, file);

  return result;
}
