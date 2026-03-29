import { NextRequest, NextResponse } from 'next/server';
import { pluginDb } from '@/lib/db';
import AdmZip from 'adm-zip';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join, resolve, basename } from 'path';
import { validateManifest } from '@/lib/validators/plugin';
import { PLUGINS_DIR } from '@/modules/plugin-engine/system/health-monitor';

// Fase 4: Sistem Instalasi & Registrasi (adm-zip)
export async function POST(request: NextRequest) {
  let tempZipPath = '';
  
  try {
    // Task 31: Upload ZIP
    const formData = await request.formData();
    const file = formData.get('plugin') as File | null;
    const userId = formData.get('userId') as string || 'system-admin';

    if (!file || !file.name.endsWith('.zip')) {
      return NextResponse.json({ error: 'File harus berformat ZIP' }, { status: 400 });
    }

    // Sanitize user-provided filename to prevent path traversal vulnerability
    const safeFileName = basename(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    tempZipPath = join(process.cwd(), '.next', 'tmp', `${Date.now()}-${safeFileName}`);
    
    if (!existsSync(join(process.cwd(), '.next', 'tmp'))) {
      mkdirSync(join(process.cwd(), '.next', 'tmp'), { recursive: true });
    }
    
    writeFileSync(tempZipPath, buffer);

    // Task 34: adm-zip Extraction in memory to check Manifest
    const zip = new AdmZip(tempZipPath);
    const zipEntries = zip.getEntries();
    
    const manifestEntry = zipEntries.find(entry => entry.entryName === 'plugin.json' || entry.entryName.endsWith('/plugin.json'));
    
    if (!manifestEntry) {
      throw new Error('plugin.json tidak ditemukan di dalam ZIP');
    }

    // Task 32: Manifest Validation
    const manifestText = manifestEntry.getData().toString('utf8');
    const manifest = validateManifest(manifestText); // Will throw if invalid
    
    const pluginId = manifest.id;
    const version = manifest.version;

    // Task 33: Version Conflict Handling
    const existingCheck = await pluginDb.select('SELECT id FROM installed_plugins WHERE plugin_id = $1 AND user_id = $2', [pluginId, userId]);
    if (existingCheck.length > 0) {
      // In advanced system: trigger upgrade instead. Here we throw error.
       throw new Error(`Plugin ${pluginId} sudah terinstal untuk user ini. Harap uninstall terlebih dahulu.`);
    }

    // Tentukan folder tujuan /omni-plugins/{pluginId}
    const targetDir = join(PLUGINS_DIR, pluginId);
    
    if (existsSync(targetDir)) {
      rmSync(targetDir, { recursive: true, force: true });
    }
    mkdirSync(targetDir, { recursive: true });

    // Extract ke targetDir
    zip.extractAllTo(targetDir, true);

    // Task 35: File Validation (Memastikan index.js ada)
    const mainFilePath = join(targetDir, manifest.main || 'index.js');
    if (!existsSync(mainFilePath)) {
      throw new Error(`Entry file '${manifest.main}' tidak ditemukan berdasarkan manifest.`);
    }

    // Task 36: Insert ke tabel plugins (Jika belum ada, anggap side-loaded)
    // Note: In real marketplace, plugin metadata already exists, but for local sideloading:
    await pluginDb.run(`
      INSERT INTO plugins (id, name, description, author, price)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO NOTHING
    `, [pluginId, manifest.name, manifest.description || '', manifest.author, manifest.price || 0]);

    // Task 37: Insert ke tabel plugin_versions
    await pluginDb.run(`
      INSERT INTO plugin_versions (plugin_id, version, changelog)
      VALUES ($1, $2, $3)
      ON CONFLICT (plugin_id, version) DO NOTHING
    `, [pluginId, version, 'Local Installation']);

    // Task 38: Insert ke tabel installed_plugins
    await pluginDb.run(`
      INSERT INTO installed_plugins (plugin_id, user_id, version_installed, local_path)
      VALUES ($1, $2, $3, $4)
    `, [pluginId, userId, version, targetDir]);

    // Task 39: Cleanup temporary ZIP
    if (existsSync(tempZipPath)) rmSync(tempZipPath);

    return NextResponse.json({ message: 'Plugin berhasil diinstal', pluginId }, { status: 201 });
  } catch (error: any) {
    // Task 39: Pastikan terhapus walau error
    if (tempZipPath && existsSync(tempZipPath)) rmSync(tempZipPath);
    console.error('Instalasi gagal:', error.message);
    return NextResponse.json({ error: error.message || 'Instalasi Gagal' }, { status: 500 });
  }
}
