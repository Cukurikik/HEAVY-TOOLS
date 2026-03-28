import { pluginDb } from '../src/lib/db';
import fs from 'fs';

async function install() {
  try {
    const raw = fs.readFileSync('./omni-plugins/omni-image-optimizer/plugin.json', 'utf8');
    const manifest = JSON.parse(raw);

    // Upsert into plugins
    await pluginDb.run(
      `INSERT INTO plugins (id, name, description, author, main_file, permissions, price)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description`,
      [manifest.id, manifest.name, manifest.description, manifest.author, manifest.main, JSON.stringify(manifest.permissions), manifest.price || 0]
    );

    // Upsert into plugin_versions
    await pluginDb.run(
      `INSERT INTO plugin_versions (plugin_id, version, local_path_dir)
       VALUES ($1, $2, $3)
       ON CONFLICT (plugin_id, version) DO NOTHING`,
      [manifest.id, manifest.version, 'omni-plugins/omni-image-optimizer']
    );

    // Install for system-admin
    await pluginDb.run(
       "INSERT INTO installed_plugins (plugin_id, user_id, version_installed) VALUES ($1, $2, $3) ON CONFLICT(user_id, plugin_id) DO NOTHING", 
       [manifest.id, 'system-admin', manifest.version]
    );

    console.log(`✅ Plugin ${manifest.id} berhasil ditambahkan dan diinstal!`);
  } catch (error) {
    console.error('Gagal instal plugin:', error);
  }
}
install();
