import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, statSync, existsSync } from 'fs';
import { join, resolve } from 'path';

// Fase 1: Task 06 - Plugin Asset Router
// Tempat fisik semua file plugin berada
const PLUGINS_DIR = resolve(process.cwd(), 'omni-plugins');

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const safePath = join(PLUGINS_DIR, ...path);

    // Kemanan: Mencegah directory traversal attack (LFI)
    if (!safePath.startsWith(PLUGINS_DIR) || !existsSync(safePath)) {
      return new NextResponse('Asset not found or access denied', { status: 404 });
    }

    const stat = statSync(safePath);
    if (!stat.isFile()) {
      return new NextResponse('Asset not found', { status: 404 });
    }

    const fileBuffer = readFileSync(safePath);

    // Ekstrak ekstensi untuk Content-Type
    const ext = safePath.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'js': 'application/javascript',
      'css': 'text/css',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'svg': 'image/svg+xml',
      'json': 'application/json',
      'ico': 'image/x-icon',
      'woff2': 'font/woff2',
      'wasm': 'application/wasm',
    };

    const contentType = mimeTypes[ext || ''] || 'application/octet-stream';

    // Agresif caching untuk asset statis plugin lokal
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Asset Router Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
