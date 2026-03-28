import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCloudMetadata } from '@/lib/storage'

/**
 * 36. Storage Webhook/Event Listener
 * Re-verifies files successfully parked inside Firebase Storage, activating
 * their database flags and generating simulated structural metadata (pages, etc).
 */
export async function POST(request: NextRequest) {
  try {
    const { fileId, userId } = await request.json()

    const tempRecord = await db.cloudPdfFile.findUnique({
      where: { id: fileId }
    })

    if (!tempRecord) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const uniqueFileName = `${fileId}-${tempRecord.fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const key = `${userId}/${uniqueFileName}`;

    // Confirm it exists in Firebase Admin bucket
    const meta = await getCloudMetadata(key)

    if (!meta) {
      return NextResponse.json({ error: 'File phantom or missing' }, { status: 400 })
    }

    // 37. Cloud PDF Page Counter Utilitas (Mock placeholder - avoids heavy server PDF parsing libs)
    // 40. Cloud PDF Thumbnail Generator (Mock - assumes frontend/cloudflare worker did it)
    const mockPageCount = Math.floor(Math.random() * 50) + 1; 

    await db.cloudPdfFile.update({
      where: { id: fileId },
      data: {
        fileUrl: `firebase-storage://${key}`,
        pageCount: mockPageCount
      }
    })

    return NextResponse.json({ success: true, verifiedKey: key })
  } catch (error) {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
