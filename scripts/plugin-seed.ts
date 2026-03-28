import 'dotenv/config';
import { pgPool } from '../src/lib/db';

// Fase 2: Task 20 - Seed Script untuk Official Plugins buatan Kapten
async function seedOfficialPlugins() {
  console.log('🌱 Memulai Seeding Official Plugins...');
  
  const client = await pgPool.connect();

  try {
    // 1. Data Plugin Resmi Kapten
    const officialPluginId = 'omni-video-pro';
    
    // Insert/Upsert Plugin
    await client.query(`
      INSERT INTO plugins (id, name, description, author, category, is_official, price)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE SET 
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        price = EXCLUDED.price
    `, [
      officialPluginId,
      'Video Compressor Ultra (Official)',
      'Algoritma kompresi rahasia buatan Kapten yang mereduksi ukuran video hingga 95% tanpa kehilangan piksel mata biasa.',
      'Kapten IAM',
      'video',
      true,
      0
    ]);
    console.log(`✅ Upserted plugin: ${officialPluginId}`);

    // 2. Data Versinya
    await client.query(`
      INSERT INTO plugin_versions (plugin_id, version, changelog)
      VALUES ($1, $2, $3)
      ON CONFLICT (plugin_id, version) DO NOTHING
    `, [
      officialPluginId,
      '1.0.0',
      'Rilis perdana. Termasuk algoritma FFmpeg quantum.'
    ]);
    console.log(`✅ Injected version 1.0.0 untuk ${officialPluginId}`);
    
    // 3. Data Terinstal
    await client.query(`
      INSERT INTO installed_plugins (plugin_id, user_id, version_installed, local_path)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (plugin_id, user_id) DO NOTHING
    `, [
      officialPluginId,
      'system-admin', // dummy user
      '1.0.0',
      '/omni-plugins/data/omni-video-pro-v1.0.0'
    ]);
    console.log(`✅ Marked as installed for system-admin.`);
    
    console.log('🎉 Seeding Selesai!');
  } catch (err: any) {
    console.error('❌ Gagal melakukan seeding:', err.message);
  } finally {
    client.release();
    await pgPool.end();
  }
}

seedOfficialPlugins();
