import { adminStorage } from './firebase-admin'

/**
 * Firebase Storage helper utilities.
 * Replaces the previous AWS S3 implementation.
 * Uses Firebase Admin SDK for server-side signed URL generation.
 */

const BUCKET_NAME = process.env.FIREBASE_STORAGE_BUCKET || ''

function getBucket() {
  if (!adminStorage) {
    throw new Error('Firebase Admin Storage is not initialized. Check your environment variables.')
  }
  return adminStorage.bucket(BUCKET_NAME)
}

export async function generateUploadUrl(fileName: string, contentType: string, userId: string) {
  const bucket = getBucket()
  const file = bucket.file(`${userId}/${fileName}`)

  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
    contentType,
  })

  return url
}

export async function generateDownloadUrl(key: string) {
  const bucket = getBucket()
  const file = bucket.file(key)

  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
  })

  return url
}

export async function getCloudMetadata(key: string) {
  const bucket = getBucket()
  const file = bucket.file(key)
  const [metadata] = await file.getMetadata()

  return {
    sizeBytes: metadata.size ? Number(metadata.size) : undefined,
    mimeType: metadata.contentType,
    lastModified: metadata.updated ? new Date(metadata.updated) : undefined,
  }
}

export async function deleteCloudObject(key: string) {
  const bucket = getBucket()
  const file = bucket.file(key)
  return file.delete()
}
