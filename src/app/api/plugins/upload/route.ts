import { NextRequest, NextResponse } from 'next/server';

// Fase 1: Task 10 - Max Upload Size Config
// Next.js App Router tidak menggunakan `export const config = { api: { bodyParser... } }`
// Melainkan kita cek ukuran buffer atau stream. Limit: 50MB
const MAX_UPLOAD_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_UPLOAD_SIZE) {
      return NextResponse.json({ error: 'File plugin terlalu besar (Max 50MB)' }, { status: 413 });
    }

    // Nanti akan diekstrak menggunakan adm-zip di Fase 4
    return NextResponse.json({ message: 'Upload endpoint ready' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
