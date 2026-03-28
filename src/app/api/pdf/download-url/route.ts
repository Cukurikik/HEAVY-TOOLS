import { NextRequest, NextResponse } from 'next/server'
import { generateDownloadUrl } from '@/lib/storage'
import { db } from '@/lib/db'

/**
 * 33. API download-url PDF
 * Restricts external downloading by forcing generation of a 1-hour valid Firebase Signed URL mapped to the requester's ID.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')
    const userId = "dev-user-id" // Swap with Auth soon

    if (!fileId) {
      return NextResponse.json({ error: 'ID Dokumen diperlukan' }, { status: 400 })
    }

    // Verify ownership against Prisma Postgres Model
    const record = await db.cloudPdfFile.findFirst({
      where: { id: fileId, userId }
    })

    if (!record) {
      return NextResponse.json({ error: 'Dokumen tidak ditemukan atau akses ditolak' }, { status: 404 })
    }

    // Extract path: we generally store string paths similar to "userId/fileName"
    // Assuming fileUrl eventually stores the physical Firebase key after webhook verification
    const storageKey = record.fileUrl === 'pending' 
      ? `${userId}/${record.fileName}` // Predictable upload path
      : record.fileUrl.split('/').slice(-2).join('/') 

    const downloadUrl = await generateDownloadUrl(storageKey)

    return NextResponse.json({ success: true, downloadUrl })
  } catch (error) {
    console.error('PDF Download URL generation failed:', error)
    return NextResponse.json({ error: 'Gagal mencetak URL Unduh PDF' }, { status: 500 })
  }
}
