import { NextRequest, NextResponse } from 'next/server';
import { pluginDb } from '@/lib/db';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import { PLUGINS_DIR } from '@/modules/plugin-engine/system/health-monitor';

// Fase 4: Task 40 - API Uninstall
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: pluginId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'system-admin';
    
    if (!pluginId) {
      return NextResponse.json({ error: 'Plugin ID diperlukan' }, { status: 400 });
    }

    // 1. Cek apakah terinstal
    const installed = await pluginDb.select(
      'SELECT id, local_path FROM installed_plugins WHERE plugin_id = $1 AND user_id = $2',
      [pluginId, userId]
    );

    if (installed.length === 0) {
      return NextResponse.json({ error: 'Plugin tidak terinstal untuk user ini' }, { status: 404 });
    }

    // 2. Hapus fisik dari disk (jika kita mau menghapus full folder atau specific user data)
    // Disini kita hapus folder global plugin jika ini single-tenant atau system-wide uninstall.
    // Kita asumsikan uninstall menghapus folder physically untuk security.
    const targetDir = join(PLUGINS_DIR, pluginId);
    if (existsSync(targetDir)) {
      rmSync(targetDir, { recursive: true, force: true });
    }

    // 3. Hapus dari DB
    await pluginDb.run('DELETE FROM installed_plugins WHERE plugin_id = $1 AND user_id = $2', [pluginId, userId]);
    // Optionally delete from plugin_permissions if requested.
    await pluginDb.run('DELETE FROM plugin_permissions WHERE plugin_id = $1 AND user_id = $2', [pluginId, userId]);

    return NextResponse.json({ message: `Plugin ${pluginId} berhasil dihapus` }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal melakukan uninstall', details: error.message }, { status: 500 });
  }
}
