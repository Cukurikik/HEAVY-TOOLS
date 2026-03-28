import { NextRequest, NextResponse } from 'next/server'
import { generateUploadUrl } from '@/lib/storage'
import { db } from '@/lib/db'

// MOCK CONSTANTS
const MAX_FREE_PDF_SIZE = 50 * 1024 * 1024; // 50MB
const MOCK_USER_ID = "dev-user-id";

/**
 * 32. API upload-url PDF
 * Generates a Firebase Admin Signed URL meant specifically for uploading PDF files
 * directly from browser without congesting the Next.js server limits.
 */
export async function POST(request: NextRequest) {
  try {
    const { fileName, fileSize, contentType } = await request.json()

    // 34. MIME Validation Server
    if (contentType !== 'application/pdf') {
      return NextResponse.json({ error: 'Hanya file PDF yang diizinkan.' }, { status: 400 })
    }

    // 35. Size Limit Enforcement
    if (fileSize > MAX_FREE_PDF_SIZE) {
      return NextResponse.json({ error: 'Batas ukuran file PDF akun Free adalah 50MB.' }, { status: 413 })
    }

    // Register empty placeholder in Postgres
    const cloudRecord = await db.cloudPdfFile.create({
      data: {
        userId: MOCK_USER_ID,
        fileName,
        sizeBytes: fileSize,
        fileUrl: 'pending', // Will be updated eventually
        isPinned: false
      }
    })

    // Construct highly unique key using cuid
    const uniqueFileName = `${cloudRecord.id}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Delegate to Firebase Signed URL provider (lib/storage)
    const uploadUrl = await generateUploadUrl(uniqueFileName, contentType, MOCK_USER_ID)

    return NextResponse.json({ 
      success: true, 
      uploadUrl,
      cloudFileId: cloudRecord.id
    })
  } catch (error) {
    console.error('PDF Upload URL generation failed:', error)
    return NextResponse.json({ error: 'Gagal menghubungi Firebase Storage' }, { status: 500 })
  }
}
