import { NextRequest, NextResponse } from 'next/server';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { PLUGINS_DIR } from '@/modules/plugin-engine/system/health-monitor';

// Fase 7: Task 65 - Action reviewPluginCode (Admin UI endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pluginId = searchParams.get('pluginId');
    const role = searchParams.get('role'); // Simulate check

    if (role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Hanya Kapten yang diizinkan mengaudit file.' }, { status: 403 });
    }

    if (!pluginId) {
      return NextResponse.json({ error: 'pluginId required' }, { status: 400 });
    }

    const pluginDir = join(PLUGINS_DIR, pluginId);
    
    if (!existsSync(pluginDir)) {
      return NextResponse.json({ error: 'Plugin folder not found' }, { status: 404 });
    }

    const manifestPath = join(pluginDir, 'plugin.json');
    if (!existsSync(manifestPath)) {
      return NextResponse.json({ error: 'Manifest not found in plugin' }, { status: 404 });
    }
    
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const entryFile = manifest.main || 'index.js';
    const sourcePath = join(pluginDir, entryFile);

    if (!existsSync(sourcePath)) {
      return NextResponse.json({ error: 'Kumpulan kode script (main) tidak ditemukan' }, { status: 404 });
    }

    const sourceCode = readFileSync(sourcePath, 'utf8');

    return NextResponse.json({ 
      data: {
        pluginId,
        entryFile,
        codeLength: sourceCode.length,
        sourceCode
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
