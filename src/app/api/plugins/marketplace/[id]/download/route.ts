import { NextRequest, NextResponse } from 'next/server';
import { pluginDb } from '@/lib/db';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Fase 3: Task 28 - Download Plugin (Zip Delivery)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: pluginId } = await params;
    const { searchParams } = new URL(request.url);
    const version = searchParams.get('version');
    
    if (!pluginId || !version) {
      return NextResponse.json({ error: 'Plugin ID dan version diperlukan' }, { status: 400 });
    }

    const sqlQuery = `
      SELECT zip_url, file_hash
      FROM plugin_versions
      WHERE plugin_id = $1 AND version = $2
    `;
    
    const results = await pluginDb.select(sqlQuery, [pluginId, version]);

    if (results.length === 0) {
      return NextResponse.json({ error: 'Versi plugin tidak ditemukan' }, { status: 404 });
    }

    const versionData = results[0];

    // Jika ada zip_url eksternal, kita bisa redirect
    if (versionData.zip_url && versionData.zip_url.startsWith('http')) {
      return NextResponse.redirect(versionData.zip_url);
    }

    // Jika ini adalah market lokal, kita asumsikan zip_url adalah path lokal relatif ke zip
    const zipPath = versionData.zip_url; 
    
    if (!zipPath || !existsSync(zipPath)) {
       return NextResponse.json({ error: 'File ZIP tidak tersedia secara lokal' }, { status: 404 });
    }

    const fileBuffer = readFileSync(zipPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${pluginId}-v${version}.zip"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
